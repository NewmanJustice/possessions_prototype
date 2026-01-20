require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

// Import routes
const accessRoutes = require('./routes/access');
const authRoutes = require('./routes/auth');
const possessionsRoutes = require('./routes/possessions');
const claimsRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers with relaxed CSP for GOV.UK assets
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:'],
      },
    },
  })
);

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

// Make session available to all templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Serve static assets from GOV.UK Frontend
app.use(
  '/govuk',
  express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'))
);

// Serve GOV.UK Frontend assets at /assets/ (for hardcoded paths in CSS)
app.use(
  '/assets',
  express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets'))
);

// Serve custom static assets
app.use('/public', express.static(path.join(__dirname, '../public')));

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
