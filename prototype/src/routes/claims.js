const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const claimService = require('../services/claimService');
const documentUpload = require('../integrations/documentUpload');

// All claims routes require SOLICITOR role
router.use(requireAuth);
router.use(requireRole('SOLICITOR'));

// GET /claims/start
router.get('/start', (req, res) => {
  // Initialize claim if not exists
  claimService.initializeClaim(req.session);

  res.render('pages/claims/start', {
    pageTitle: 'Make a possession claim',
    showBackLink: true,
    backLinkHref: '/possessions',
  });
});

// POST /claims/start
router.post('/start', (req, res) => {
  res.redirect('/claims/claim-type');
});

// GET /claims/claim-type
router.get('/claim-type', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/claim-type', {
    pageTitle: 'What type of claim do you want to make?',
    showBackLink: true,
    backLinkHref: '/claims/start',
    errors: transformedErrors,
    values: { claimType: claim?.claimType } || {},
  });

  delete req.session.errors;
});

// POST /claims/claim-type
router.post('/claim-type', (req, res) => {
  const { claimType } = req.body;
  const errors = claimService.validateStep('claimType', { claimType });

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/claim-type');
  }

  claimService.updateClaim(req.session, 'claimType', claimType);
  res.redirect('/claims/property-address');
});

// GET /claims/property-address
router.get('/property-address', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/property-address', {
    pageTitle: 'What is the property address?',
    showBackLink: true,
    backLinkHref: '/claims/claim-type',
    errors: transformedErrors,
    values: claim?.property || {},
  });

  delete req.session.errors;
});

// POST /claims/property-address
router.post('/property-address', (req, res) => {
  const { addressLine1, addressLine2, town, county, postcode } = req.body;
  const data = { addressLine1, addressLine2, town, county, postcode };
  const errors = claimService.validateStep('property', data);

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/property-address');
  }

  claimService.updateClaim(req.session, 'property', data);
  res.redirect('/claims/claimant');
});

// GET /claims/claimant
router.get('/claimant', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/claimant', {
    pageTitle: 'Claimant details',
    showBackLink: true,
    backLinkHref: '/claims/property-address',
    errors: transformedErrors,
    values: claim?.claimant || {},
  });

  delete req.session.errors;
});

// POST /claims/claimant
router.post('/claimant', (req, res) => {
  const { organisationName, reference, contactName, email, telephone } = req.body;
  const data = { organisationName, reference, contactName, email, telephone };
  const errors = claimService.validateStep('claimant', data);

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/claimant');
  }

  claimService.updateClaim(req.session, 'claimant', data);
  res.redirect('/claims/defendant');
});

// GET /claims/defendant
router.get('/defendant', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/defendant', {
    pageTitle: 'Defendant details',
    showBackLink: true,
    backLinkHref: '/claims/claimant',
    errors: transformedErrors,
    values: claim?.defendant || {},
  });

  delete req.session.errors;
});

// POST /claims/defendant
router.post('/defendant', (req, res) => {
  const { fullName, addressLine1, addressLine2, town, county, postcode } = req.body;
  const data = { fullName, addressLine1, addressLine2, town, county, postcode };
  const errors = claimService.validateStep('defendant', data);

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/defendant');
  }

  claimService.updateClaim(req.session, 'defendant', data);
  res.redirect('/claims/grounds');
});

// GET /claims/grounds
router.get('/grounds', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/grounds', {
    pageTitle: 'Grounds for possession',
    showBackLink: true,
    backLinkHref: '/claims/defendant',
    errors: transformedErrors,
    values: { grounds: claim?.grounds || [] },
  });

  delete req.session.errors;
});

// POST /claims/grounds
router.post('/grounds', (req, res) => {
  let grounds = req.body.grounds || [];

  // Ensure grounds is always an array
  if (!Array.isArray(grounds)) {
    grounds = [grounds];
  }

  const errors = claimService.validateStep('grounds', { grounds });

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/grounds');
  }

  claimService.updateClaim(req.session, 'grounds', grounds);
  res.redirect('/claims/key-dates');
});

// GET /claims/key-dates
router.get('/key-dates', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  // Get values from session (if validation failed) or from claim
  const values = req.session.values || claim?.keyDates || {};

  res.render('pages/claims/key-dates', {
    pageTitle: 'Key dates',
    showBackLink: true,
    backLinkHref: '/claims/grounds',
    errors: transformedErrors,
    values: values,
  });

  delete req.session.errors;
  delete req.session.values;
});

// POST /claims/key-dates
router.post('/key-dates', (req, res) => {
  const data = req.body;
  console.log('Key dates POST data:', JSON.stringify(data, null, 2));
  const errors = claimService.validateStep('keyDates', data);

  if (errors.length > 0) {
    console.log('Key dates validation errors:', JSON.stringify(errors, null, 2));
    req.session.errors = errors;
    req.session.values = data; // Preserve form values
    return res.redirect('/claims/key-dates');
  }

  console.log('Key dates validation passed, redirecting to documents');
  claimService.updateClaim(req.session, 'keyDates', data);
  res.redirect('/claims/documents');
});

// GET /claims/documents
router.get('/documents', (req, res) => {
  res.render('pages/claims/documents', {
    pageTitle: 'Upload documents',
    showBackLink: true,
    backLinkHref: '/claims/key-dates',
    featureEnabled: documentUpload.isEnabled(),
  });
});

// POST /claims/documents (placeholder)
router.post('/documents', (req, res) => {
  res.redirect('/claims/check-answers');
});

// GET /claims/check-answers
router.get('/check-answers', (req, res) => {
  const claim = claimService.getClaim(req.session);

  if (!claim) {
    return res.redirect('/claims/start');
  }

  res.render('pages/claims/check-answers', {
    pageTitle: 'Check your answers',
    showBackLink: true,
    backLinkHref: '/claims/documents',
    claim,
  });
});

// POST /claims/submit
router.post('/submit', (req, res) => {
  try {
    const claim = claimService.submitClaim(req.session);
    res.redirect('/claims/confirmation');
  } catch (error) {
    console.error('Claim submission error:', error);
    res.status(500).render('pages/error', {
      pageTitle: 'There was a problem',
      heading: 'There was a problem submitting your claim',
      message: 'Please try again later.',
    });
  }
});

// GET /claims/confirmation
router.get('/confirmation', (req, res) => {
  const claim = claimService.getClaim(req.session);

  if (!claim || claim.status !== 'submitted') {
    return res.redirect('/claims/start');
  }

  res.render('pages/claims/confirmation', {
    pageTitle: 'Claim submitted',
    claim,
  });
});

module.exports = router;
