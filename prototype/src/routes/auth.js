const express = require('express');
const router = express.Router();
const { requireAccessCode, requireUserType } = require('../middleware/auth');

// All auth routes require access code and user type to be selected first
router.use(requireAccessCode);
router.use(requireUserType);

// GET /auth/sign-in - Sign in page
router.get('/sign-in', (req, res) => {
  // If already signed in, redirect to possessions
  if (req.session.user) {
    return res.redirect('/possessions');
  }

  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/auth/sign-in', {
    pageTitle: 'Sign in or create an account',
    errors: transformedErrors,
    values: req.session.values || {},
  });

  delete req.session.errors;
  delete req.session.values;
});

// POST /auth/sign-in - Process sign in
router.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email is not blank (any value accepted for prototype)
  if (!email || email.trim() === '') {
    errors.push({
      field: 'email',
      message: 'Enter your email address',
      href: '#email',
    });
  }

  // Validate password is not blank (any value accepted for prototype)
  if (!password || password.trim() === '') {
    errors.push({
      field: 'password',
      message: 'Enter your password',
      href: '#password',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = { email };
    return res.redirect('/auth/sign-in');
  }

  // Store email for 2FA step
  req.session.pendingAuth = { email };
  res.redirect('/auth/one-time-code');
});

// GET /auth/one-time-code - One-time code (2FA) page
router.get('/one-time-code', (req, res) => {
  if (!req.session.pendingAuth) {
    return res.redirect('/auth/sign-in');
  }

  res.render('pages/auth/one-time-code', {
    pageTitle: 'Enter your security code',
    errors: req.session.errors || [],
    values: req.session.values || {},
    email: req.session.pendingAuth.email,
  });

  delete req.session.errors;
  delete req.session.values;
});

// POST /auth/one-time-code - Verify one-time code
router.post('/one-time-code', (req, res) => {
  const { code } = req.body;
  const errors = [];

  if (!req.session.pendingAuth) {
    return res.redirect('/auth/sign-in');
  }

  if (!code || code.trim() === '') {
    errors.push({
      field: 'code',
      message: 'Enter your security code',
      href: '#code',
    });
  } else if (!/^\d{6}$/.test(code.trim())) {
    errors.push({
      field: 'code',
      message: 'Enter a 6-digit security code',
      href: '#code',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = { code };
    return res.redirect('/auth/one-time-code');
  }

  // Accept any 6-digit code (prototype)
  // Map user type to role
  const userTypeToRole = {
    'professional': 'SOLICITOR',
    'citizen': 'CITIZEN',
    'court-staff': 'COURT_STAFF',
    'judge': 'JUDGE'
  };

  const role = userTypeToRole[req.session.userType] || 'SOLICITOR';

  // Set user session with role based on selected user type
  req.session.user = {
    email: req.session.pendingAuth.email,
    role: role,
    userType: req.session.userType,
    signedInAt: new Date().toISOString(),
    registeredClaimantName: 'Treetops Housing', // Default for prototype
  };

  delete req.session.pendingAuth;
  res.redirect('/case-list');
});

// GET /auth/forgot-password - Forgot password page
router.get('/forgot-password', (req, res) => {
  const errors = req.session.errors || [];
  const successEmail = req.session.successEmail || null;

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/auth/forgot-password', {
    pageTitle: 'Forgotten password',
    errors: transformedErrors,
    values: req.session.values || {},
    successEmail: successEmail,
  });

  delete req.session.errors;
  delete req.session.values;
  delete req.session.successEmail;
});

// POST /auth/forgot-password - Process forgot password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const errors = [];

  // Validate email is not blank (any value accepted for prototype)
  if (!email || email.trim() === '') {
    errors.push({
      field: 'email',
      message: 'Enter your email address',
      href: '#email',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = { email };
    return res.redirect('/auth/forgot-password');
  }

  // For prototype: accept any email and show success message
  req.session.successEmail = email;
  res.redirect('/auth/forgot-password');
});

module.exports = router;
