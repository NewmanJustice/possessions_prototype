const express = require('express');
const router = express.Router();

// GET /access - Access code gate page
router.get('/', (req, res) => {
  // If already granted access, redirect to sign-in
  if (req.session.accessGranted) {
    return res.redirect('/auth/sign-in');
  }

  res.render('pages/access/index', {
    pageTitle: 'Enter access code',
    errors: req.session.errors || [],
    values: req.session.values || {},
  });

  // Clear errors and values after rendering
  delete req.session.errors;
  delete req.session.values;
});

// POST /access - Validate access code
router.post('/', (req, res) => {
  const { accessCode } = req.body;
  const expectedCode = process.env.ACCESS_CODE || 'letmein';
  const errors = [];

  if (!accessCode || accessCode.trim() === '') {
    errors.push({
      field: 'accessCode',
      message: 'Enter the access code',
      href: '#accessCode',
    });
  } else if (accessCode !== expectedCode) {
    errors.push({
      field: 'accessCode',
      message: 'The access code you entered is not correct',
      href: '#accessCode',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = { accessCode };
    return res.redirect('/access');
  }

  // Grant access
  req.session.accessGranted = true;
  res.redirect('/auth/sign-in');
});

module.exports = router;
