require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

// Import routes
const accessRoutes = require('./routes/access');
const selectUserTypeRoutes = require('./routes/selectUserType');
const authRoutes = require('./routes/auth');
const possessionsRoutes = require('./routes/possessions');
const claimsRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/access');
});

// Register routes
app.use('/access', accessRoutes);
app.use('/select-user-type', selectUserTypeRoutes);
app.use('/auth', authRoutes);
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

// Start server
app.listen(PORT, () => {
  console.log(`HMCTS Possessions Prototype running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
