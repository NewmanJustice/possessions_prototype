require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Import routes
const accessRoutes = require('./routes/access');
const selectUserTypeRoutes = require('./routes/selectUserType');
const authRoutes = require('./routes/auth');
const caseListRoutes = require('./routes/caseList');
const possessionsRoutes = require('./routes/possessions');
const claimsRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 3000;

// Prototype Annotator configuration
// On Azure, use /home for persistent storage; locally use ./data
const ANNOTATOR_DB_PATH = process.env.ANNOTATOR_DB_PATH ||
  (process.env.NODE_ENV === 'production' ? '/home/data/annotations.sqlite' : './data/annotations.sqlite');
const ANNOTATOR_EXPORT_DIR = process.env.ANNOTATOR_EXPORT_DIR ||
  (process.env.NODE_ENV === 'production' ? '/home/data/exports' : './data/exports');

// Security headers with relaxed settings for prototype
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for prototype to avoid asset loading issues
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Trust proxy - required for Azure App Service
app.set('trust proxy', 1);

// Force HTTPS in production (Azure App Service)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'prototype-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Language switcher middleware
app.use((req, res, next) => {
  // Check for language parameter in query string
  const lang = req.query.lang;
  if (lang === 'en' || lang === 'cy') {
    req.session.language = lang;
  }
  // Default to English if not set
  if (!req.session.language) {
    req.session.language = 'en';
  }
  next();
});

// Make session available to all templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Journey map middleware - inject data for claims pages
const journeyMapService = require('./services/journeyMapService');
app.use((req, res, next) => {
  // Check if this is a claims page
  const isClaimsPage = req.originalUrl.startsWith('/claims/');
  res.locals.isClaimsPage = isClaimsPage;

  if (isClaimsPage) {
    const journeyMapData = journeyMapService.getJourneyMapData(req.session, req.originalUrl);
    res.locals.journeyZones = journeyMapData.zones;
    res.locals.currentStationId = journeyMapData.currentStationId;
    res.locals.selectedBranch = journeyMapData.selectedBranch;
  }
  next();
});

// Serve static assets from GOV.UK Frontend
app.use(
  '/govuk',
  express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'), {
    maxAge: '1d',
    setHeaders: (res, filepath) => {
      // Ensure correct MIME types
      if (filepath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      } else if (filepath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
    }
  })
);

// Serve GOV.UK Frontend assets at /assets/ (for hardcoded paths in CSS)
app.use(
  '/assets',
  express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets'), {
    maxAge: '1d',
    setHeaders: (res, filepath) => {
      // Ensure correct MIME types for all asset types
      if (filepath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      } else if (filepath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filepath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
    }
  })
);

// Serve custom static assets
app.use('/public', express.static(path.join(__dirname, '../public'), {
  maxAge: '1d'
}));

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure(
  [
    path.join(__dirname, 'views'),
    path.join(__dirname, '../node_modules/govuk-frontend/dist'),
  ],
  {
    autoescape: true,
    express: app,
    noCache: process.env.NODE_ENV !== 'production',
    watch: process.env.NODE_ENV !== 'production',
  }
);

// Add global variables to Nunjucks
nunjucksEnv.addGlobal('serviceName', 'Possessions Prototype');
nunjucksEnv.addGlobal('isPrototype', true);

// Set view engine
app.set('view engine', 'njk');

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Async initialization function for prototype annotator
async function initializeAnnotator() {
  try {
    // Ensure data directory exists
    const dbDir = path.dirname(ANNOTATOR_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(ANNOTATOR_EXPORT_DIR)) {
      fs.mkdirSync(ANNOTATOR_EXPORT_DIR, { recursive: true });
    }

    // Dynamic import for ES module
    const { createPrototypeAnnotator } = await import('prototype-annotator');

    const annotator = await createPrototypeAnnotator({
      basePath: '/__prototype-annotator',
      dbPath: ANNOTATOR_DB_PATH,
      exportDir: ANNOTATOR_EXPORT_DIR,
      urlMode: 'canonical', // Store canonical URL for consistency across environments
      enableOverlay: true,
      enableDashboard: true,
    });

    // Workaround: Serve annotator client files manually (package has path bugs)
    const annotatorClientPath = path.join(__dirname, '../node_modules/prototype-annotator/client/dist');
    const overlayJsPath = path.join(annotatorClientPath, 'overlay.js');
    const overlayExists = fs.existsSync(overlayJsPath);

    if (!overlayExists) {
      console.warn('Prototype Annotator: overlay.js not found, overlay features disabled');
    }

    // Serve overlay.js (only if user has access and file exists)
    app.get('/__prototype-annotator/overlay.js', (req, res, next) => {
      if (req.session?.accessGranted && overlayExists) {
        return res.sendFile(overlayJsPath);
      }
      // Return 204 No Content instead of 500 error when file doesn't exist
      if (!overlayExists) {
        return res.status(204).end();
      }
      next();
    });

    // Serve dashboard static assets (CSS, JS) - only if user has access
    const dashboardPath = path.join(annotatorClientPath, 'dashboard');
    const dashboardExists = fs.existsSync(dashboardPath);
    const dashboardStatic = dashboardExists ? express.static(dashboardPath) : null;

    if (!dashboardExists) {
      console.warn('Prototype Annotator: dashboard not found, dashboard features disabled');
    }

    app.use('/__prototype-annotator/dashboard', (req, res, next) => {
      if (!req.session?.accessGranted || !dashboardStatic) {
        return next('route');
      }
      dashboardStatic(req, res, next);
    });

    // Serve dashboard index.html for SPA routes - only if user has access and files exist
    app.get('/__prototype-annotator/dashboard', (req, res, next) => {
      if (req.session?.accessGranted && dashboardExists) {
        return res.sendFile(path.join(dashboardPath, 'index.html'));
      }
      if (!dashboardExists) {
        return res.status(404).send('Dashboard not available');
      }
      next();
    });
    app.get('/__prototype-annotator/dashboard/*', (req, res, next) => {
      if (req.session?.accessGranted && dashboardExists) {
        // Check if this is an asset request (has file extension)
        if (req.path.includes('/assets/')) {
          return next(); // Let static middleware handle it
        }
        return res.sendFile(path.join(dashboardPath, 'index.html'));
      }
      if (!dashboardExists) {
        return res.status(404).send('Dashboard not available');
      }
      next();
    });

    // Add annotator middleware (router + injector) - only after access screen
    // The package's router and middleware() both include the HTML injector
    const annotatorMiddleware = annotator.middleware();
    app.use((req, res, next) => {
      if (req.session?.accessGranted) {
        return annotatorMiddleware(req, res, next);
      }
      next();
    });

    console.log(`Prototype Annotator initialized`);
    console.log(`  Database: ${ANNOTATOR_DB_PATH}`);
    console.log(`  Dashboard: http://localhost:${PORT}/__prototype-annotator/dashboard`);

    return annotator;
  } catch (error) {
    console.error('Failed to initialize Prototype Annotator:', error.message);
    return null;
  }
}

// Function to register application routes (called after annotator is initialized)
function registerRoutes() {
  // Root redirect
  app.get('/', (req, res) => {
    res.redirect('/access');
  });

  // Register routes
  app.use('/access', accessRoutes);
  app.use('/select-user-type', selectUserTypeRoutes);
  app.use('/auth', authRoutes);
  app.use('/case-list', caseListRoutes);
  app.use('/possessions', possessionsRoutes);
  app.use('/claims', claimsRoutes);

  // Sign out route
  app.get('/sign-out', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect('/access');
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).render('pages/error', {
      pageTitle: 'Page not found',
      heading: 'Page not found',
      message: 'If you typed the web address, check it is correct.',
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Application error:', err);
    res.status(500).render('pages/error', {
      pageTitle: 'Sorry, there is a problem with the service',
      heading: 'Sorry, there is a problem with the service',
      message: 'Try again later.',
    });
  });
}

// Combined async initialization (for server startup)
async function initialize() {
  await initializeAnnotator();
  registerRoutes();
}

// Only start server if this file is run directly (not required by tests)
if (require.main === module) {
  // Server mode: initialize annotator first, then register routes
  initialize().then(() => {
    app.listen(PORT, () => {
      console.log(`HMCTS Possessions Prototype running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });
} else {
  // Test/import mode: register routes synchronously (skip annotator)
  registerRoutes();
}

// Export for testing
module.exports = app;
module.exports.initialize = initialize;
module.exports.initializeAnnotator = initializeAnnotator;
module.exports.registerRoutes = registerRoutes;
