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
  res.redirect('/claims/eligibility');
});

// GET /claims/eligibility
router.get('/eligibility', (req, res) => {
  res.render('pages/claims/eligibility', {
    pageTitle: 'Property not eligible for this online service',
    showBackLink: false,
  });
});

// POST /claims/eligibility
router.post('/eligibility', (req, res) => {
  res.redirect('/claims/border-postcode');
});

// GET /claims/border-postcode
router.get('/border-postcode', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/border-postcode', {
    pageTitle: 'Border postcode',
    errors: transformedErrors,
    values: { propertyLocation: claim?.propertyLocation } || {},
  });

  delete req.session.errors;
});

// POST /claims/border-postcode
router.post('/border-postcode', (req, res) => {
  // Accept both borderNation (test) and propertyLocation (form)
  const propertyLocation = req.body.propertyLocation || req.body.borderNation;
  // Validate using claimService
  const errors = claimService.validateStep('border-postcode', { propertyLocation });

  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.values = { propertyLocation };
    return res.redirect('/claims/border-postcode');
  }

  // Set isWales in claimDraft
  if (!req.session.claimDraft) claimService.initializeClaim(req.session);
  req.session.claimDraft.isWales = propertyLocation === 'wales';
  req.session.claimDraft.propertyLocation = propertyLocation;

  // Branch: next route (placeholder: claimant-type)
  // TODO: update to Wales/England branch when implemented
  res.redirect('/claims/claimant-type');
});

// GET /claims/claimant-type
router.get('/claimant-type', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/claims/claimant-type', {
    pageTitle: 'Claimant type',
    errors: transformedErrors,
    values: { claimantType: claim?.claimantType } || {},
  });

  delete req.session.errors;
});

// POST /claims/claimant-type
router.post('/claimant-type', (req, res) => {
  const { claimantType } = req.body;
  const errors = [];

  // Validate claimant type selection
  if (!claimantType) {
    errors.push({
      field: 'claimantType',
      message: 'Select who the claimant is in this case',
      href: '#claimantType',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/claimant-type');
  }

  // Store claimant type in claim
  claimService.updateClaim(req.session, 'claimantType', claimantType);

  // Route based on claimant type and property location
  const isWales = req.session.claimDraft && req.session.claimDraft.isWales;
  if (claimantType === 'registered-provider') {
    res.redirect('/claims/claim-type');
  } else if (isWales) {
    res.redirect('/claims/claimant-ineligible-welsh');
  } else {
    res.redirect('/claims/claimant-ineligible');
  }
});

// GET /claims/claimant-ineligible
router.get('/claimant-ineligible', (req, res) => {
  res.render('pages/claims/claimant-ineligible', {
    pageTitle: "You're not eligible for this online service",
    showBackLink: false,
  });
});

// POST /claims/claimant-ineligible
router.post('/claimant-ineligible', (req, res) => {
  // Return to start of claim journey
  res.redirect('/claims/start');
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
    pageTitle: 'Claim type',
    errors: transformedErrors,
    values: { claimType: claim?.claimType } || {},
  });

  delete req.session.errors;
});

// POST /claims/claim-type
router.post('/claim-type', (req, res) => {
  const { claimType } = req.body;
  const errors = [];

  // Validate claim type selection
  if (!claimType) {
    errors.push({
      field: 'claimType',
      message: 'Select yes if this is a claim against trespassers',
      href: '#claimType',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/claim-type');
  }

  // Store claim type in claim
  claimService.updateClaim(req.session, 'claimType', claimType);

  // Route based on claim type
  if (claimType === 'no') {
    // Happy path: not against trespassers
    res.redirect('/claims/name-of-claimant');
  } else {
    // Bad path: claim against trespassers
    res.redirect('/claims/claim-type-ineligible');
  }
});

// GET /claims/claim-type-ineligible
router.get('/claim-type-ineligible', (req, res) => {
  res.render('pages/claims/claim-type-ineligible', {
    pageTitle: "You're not eligible for this online service",
    showBackLink: false,
  });
});

// POST /claims/claim-type-ineligible
router.post('/claim-type-ineligible', (req, res) => {
  // Return to start of claim journey
  res.redirect('/claims/start');
});

// GET /claims/name-of-claimant
router.get('/name-of-claimant', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  res.render('pages/claims/name-of-claimant', {
    pageTitle: 'Claimant name',
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      useRegisteredName: claim.useRegisteredName || '',
      customClaimantName: claim.customClaimantName || ''
    },
    registeredClaimantName: req.session.user?.registeredClaimantName || 'Treetops Housing',
  });

  delete req.session.errors;
});

// POST /claims/name-of-claimant
router.post('/name-of-claimant', (req, res) => {
  const { useRegisteredName, customClaimantName } = req.body;
  const errors = [];

  // Validate useRegisteredName selection
  if (!useRegisteredName) {
    errors.push({
      field: 'useRegisteredName',
      message: 'Select yes if this is the correct claimant name',
      href: '#useRegisteredName',
    });
  }

  // If "no" selected, validate custom name
  if (useRegisteredName === 'no') {
    if (!customClaimantName || customClaimantName.trim() === '') {
      errors.push({
        field: 'customClaimantName',
        message: 'Enter the correct claimant name',
        href: '#customClaimantName',
      });
    }
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily so they can be displayed back to the user
    const claim = claimService.getClaim(req.session) || {};
    claim.useRegisteredName = useRegisteredName;
    claim.customClaimantName = customClaimantName;
    req.session.claimDraft = claim;
    return res.redirect('/claims/name-of-claimant');
  }

  // Store the claimant name based on selection
  let claimantName;
  if (useRegisteredName === 'yes') {
    claimantName = req.session.user?.registeredClaimantName || 'Treetops Housing';
  } else {
    claimantName = customClaimantName.trim();
  }

  claimService.updateClaim(req.session, 'claimantName', claimantName);
  claimService.updateClaim(req.session, 'useRegisteredName', useRegisteredName);
  if (useRegisteredName === 'no') {
    claimService.updateClaim(req.session, 'customClaimantName', customClaimantName.trim());
  }

  res.redirect('/claims/contact-preferences');
});

// GET /claims/contact-preferences
router.get('/contact-preferences', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get registered email and address from user session
  const registeredEmail = req.session.user?.email_registered || req.session.user?.email || '';
  const registeredAddress = req.session.user?.registeredAddress || {
    buildingAndStreet: '123 Registered Street',
    addressLine2: '',
    townOrCity: 'London',
    county: 'Greater London',
    postcode: 'SW1A 1AA'
  };

  // Get contact preferences from claim or use defaults
  const contactPreferences = claim.contactPreferences || {};

  res.render('pages/claims/contact-preferences', {
    pageTitle: 'Contact preferences',
    errors: errors, // For layout template to check for error title prefix
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      useRegisteredEmail: contactPreferences.useRegisteredEmail || '',
      alternateEmail: contactPreferences.alternateEmail || '',
      useRegisteredAddress: contactPreferences.useRegisteredAddress || '',
      buildingAndStreet: contactPreferences.buildingAndStreet || '',
      addressLine2: contactPreferences.addressLine2 || '',
      townOrCity: contactPreferences.townOrCity || '',
      county: contactPreferences.county || '',
      postcode: contactPreferences.postcode || '',
      providePhone: contactPreferences.providePhone || '',
      contactPhone: contactPreferences.contactPhone || ''
    },
    registeredEmail,
    registeredAddress,
  });

  delete req.session.errors;
});

// POST /claims/contact-preferences
router.post('/contact-preferences', (req, res) => {
  const {
    useRegisteredEmail,
    alternateEmail,
    useRegisteredAddress,
    buildingAndStreet,
    addressLine2,
    townOrCity,
    county,
    postcode,
    providePhone,
    contactPhone
  } = req.body;

  const errors = [];

  // Validate email selection
  if (!useRegisteredEmail) {
    errors.push({
      field: 'useRegisteredEmail',
      message: 'Select yes if you want to use your registered email',
      href: '#useRegisteredEmail',
    });
  }

  // If "no" selected for email, validate alternate email
  if (useRegisteredEmail === 'no') {
    if (!alternateEmail || alternateEmail.trim() === '') {
      errors.push({
        field: 'alternateEmail',
        message: 'Enter an email address',
        href: '#alternateEmail',
      });
    } else {
      const trimmedEmail = alternateEmail.trim();
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.push({
          field: 'alternateEmail',
          message: 'Enter an email address in the correct format',
          href: '#alternateEmail',
        });
      } else if (trimmedEmail.length > 254) {
        errors.push({
          field: 'alternateEmail',
          message: 'Email address must be 254 characters or less',
          href: '#alternateEmail',
        });
      }
    }
  }

  // Validate address selection
  if (!useRegisteredAddress) {
    errors.push({
      field: 'useRegisteredAddress',
      message: 'Select yes if you want to use your registered address',
      href: '#useRegisteredAddress',
    });
  }

  // If "no" selected for address, validate alternate address fields
  if (useRegisteredAddress === 'no') {
    if (!buildingAndStreet || buildingAndStreet.trim() === '') {
      errors.push({
        field: 'buildingAndStreet',
        message: 'Enter building and street',
        href: '#buildingAndStreet',
      });
    }
    if (!townOrCity || townOrCity.trim() === '') {
      errors.push({
        field: 'townOrCity',
        message: 'Enter town or city',
        href: '#townOrCity',
      });
    }
    if (!postcode || postcode.trim() === '') {
      errors.push({
        field: 'postcode',
        message: 'Enter postcode',
        href: '#postcode',
      });
    }
  }

  // Validate phone if "yes" selected
  if (providePhone === 'yes') {
    if (!contactPhone || contactPhone.trim() === '') {
      errors.push({
        field: 'contactPhone',
        message: 'Enter a phone number',
        href: '#contactPhone',
      });
    } else {
      // Strip formatting characters and validate digit count
      const digitsOnly = contactPhone.replace(/[\s\+\(\)\-]/g, '');
      if (!/^\d+$/.test(digitsOnly)) {
        errors.push({
          field: 'contactPhone',
          message: 'Enter a phone number using only numbers',
          href: '#contactPhone',
        });
      } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        errors.push({
          field: 'contactPhone',
          message: 'Phone number must be between 7 and 15 digits',
          href: '#contactPhone',
        });
      }
    }
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily so they can be displayed back to the user
    const claim = claimService.getClaim(req.session) || {};
    claim.contactPreferences = {
      useRegisteredEmail,
      alternateEmail,
      useRegisteredAddress,
      buildingAndStreet,
      addressLine2,
      townOrCity,
      county,
      postcode,
      providePhone,
      contactPhone
    };
    req.session.claimDraft = claim;
    return res.redirect('/claims/contact-preferences');
  }

  // Determine which email to use
  let notificationEmail;
  if (useRegisteredEmail === 'yes') {
    notificationEmail = req.session.user?.email_registered || req.session.user?.email || '';
  } else {
    notificationEmail = alternateEmail.trim();
  }

  // Determine which address to use
  let correspondenceAddress;
  if (useRegisteredAddress === 'yes') {
    correspondenceAddress = req.session.user?.registeredAddress || {};
  } else {
    correspondenceAddress = {
      buildingAndStreet: buildingAndStreet.trim(),
      addressLine2: addressLine2 ? addressLine2.trim() : '',
      townOrCity: townOrCity.trim(),
      county: county ? county.trim() : '',
      postcode: postcode.trim()
    };
  }

  // Store contact preferences
  const contactPreferences = {
    useRegisteredEmail,
    alternateEmail: useRegisteredEmail === 'no' ? alternateEmail.trim() : null,
    notificationEmail,
    useRegisteredAddress,
    correspondenceAddress,
    providePhone,
    contactPhone: providePhone === 'yes' ? contactPhone.trim() : null,
    contactPhoneActive: providePhone === 'yes'
  };

  claimService.updateClaim(req.session, 'contactPreferences', contactPreferences);
  res.redirect('/claims/defendant-details');
});

// POST /claims/contact-preferences/lookup-address - Postcode lookup endpoint
router.post('/contact-preferences/lookup-address', (req, res) => {
  const { postcode } = req.body;

  // Simulated postcode lookup - returns dummy addresses for known postcodes
  const knownAddresses = {
    'LU5 6TB': [
      {
        value: 'addr1',
        text: '14 Long Street, Luton, LU5 6TB',
        buildingAndStreet: '14 Long Street',
        townOrCity: 'Luton',
        postcode: 'LU5 6TB'
      },
      {
        value: 'addr2',
        text: '16 Long Street, Luton, LU5 6TB',
        buildingAndStreet: '16 Long Street',
        townOrCity: 'Luton',
        postcode: 'LU5 6TB'
      }
    ]
  };

  const normalizedPostcode = postcode ? postcode.trim().toUpperCase() : '';
  const addresses = knownAddresses[normalizedPostcode] || [];

  // Return JSON for AJAX handling or redirect with session data
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.json({ addresses });
  }

  // For non-AJAX, store in session and redirect
  req.session.addressLookupResults = addresses;
  res.redirect('/claims/contact-preferences');
});

// GET /claims/defendant-details
router.get('/defendant-details', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get property address from session (needed for "same as property" option)
  const propertyAddress = claim.propertyAddress || null;

  // Get defendant from session (support single defendant for now)
  const defendant = claim.defendants && claim.defendants[0] ? claim.defendants[0] : {};

  // Extract address - check both top-level (from validation errors) and nested correspondenceAddress
  const address = defendant.correspondenceAddress || {};

  res.render('pages/claims/defendant-details', {
    pageTitle: 'Defendant details',
    errors: errors, // For layout template to check for error title prefix
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      nameKnown: defendant.nameKnown || '',
      firstName: defendant.firstName || '',
      lastName: defendant.lastName || '',
      addressKnown: defendant.addressKnown || '',
      addressSameAsProperty: defendant.addressSameAsProperty || '',
      // Prefer top-level properties (from validation failure) over nested correspondenceAddress
      buildingAndStreet: defendant.buildingAndStreet || address.buildingAndStreet || '',
      addressLine2: defendant.addressLine2 || address.addressLine2 || '',
      townOrCity: defendant.townOrCity || address.townOrCity || '',
      county: defendant.county || address.county || '',
      postcode: defendant.postcode || address.postcode || '',
      addAnotherDefendant: defendant.addAnotherDefendant || ''
    },
    propertyAddress,
  });

  delete req.session.errors;
});

// POST /claims/defendant-details
router.post('/defendant-details', (req, res) => {
  const {
    nameKnown,
    firstName,
    lastName,
    addressKnown,
    addressSameAsProperty,
    buildingAndStreet,
    addressLine2,
    townOrCity,
    county,
    postcode,
    addAnotherDefendant
  } = req.body;

  const errors = [];

  // Validate nameKnown selection
  if (!nameKnown) {
    errors.push({
      field: 'nameKnown',
      message: 'Select yes if you know the defendant\'s name',
      href: '#nameKnown',
    });
  }

  // If name known, validate name fields
  if (nameKnown === 'yes') {
    if (!firstName || firstName.trim() === '') {
      errors.push({
        field: 'firstName',
        message: 'Enter the defendant\'s first name',
        href: '#firstName',
      });
    } else if (firstName.trim().length > 255) {
      errors.push({
        field: 'firstName',
        message: 'First name must be 255 characters or less',
        href: '#firstName',
      });
    }

    if (!lastName || lastName.trim() === '') {
      errors.push({
        field: 'lastName',
        message: 'Enter the defendant\'s last name',
        href: '#lastName',
      });
    } else if (lastName.trim().length > 255) {
      errors.push({
        field: 'lastName',
        message: 'Last name must be 255 characters or less',
        href: '#lastName',
      });
    }
  }

  // Validate addressKnown selection
  if (!addressKnown) {
    errors.push({
      field: 'addressKnown',
      message: 'Select yes if you know the defendant\'s correspondence address',
      href: '#addressKnown',
    });
  }

  // If address known, validate addressSameAsProperty and address fields
  if (addressKnown === 'yes') {
    if (!addressSameAsProperty) {
      errors.push({
        field: 'addressSameAsProperty',
        message: 'Select yes if the correspondence address is the same as the property',
        href: '#addressSameAsProperty',
      });
    }

    // If different address, validate address fields
    if (addressSameAsProperty === 'no') {
      if (!buildingAndStreet || buildingAndStreet.trim() === '') {
        errors.push({
          field: 'buildingAndStreet',
          message: 'Enter building and street',
          href: '#buildingAndStreet',
        });
      }
      if (!townOrCity || townOrCity.trim() === '') {
        errors.push({
          field: 'townOrCity',
          message: 'Enter town or city',
          href: '#townOrCity',
        });
      }
      if (!postcode || postcode.trim() === '') {
        errors.push({
          field: 'postcode',
          message: 'Enter postcode',
          href: '#postcode',
        });
      }
    }
  }

  // Validate addAnotherDefendant selection
  if (!addAnotherDefendant) {
    errors.push({
      field: 'addAnotherDefendant',
      message: 'Select yes if you need to add another defendant',
      href: '#addAnotherDefendant',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily so they can be displayed back to the user
    const claim = claimService.getClaim(req.session) || {};
    claim.defendants = [{
      nameKnown,
      firstName,
      lastName,
      addressKnown,
      addressSameAsProperty,
      buildingAndStreet,
      addressLine2,
      townOrCity,
      county,
      postcode,
      addAnotherDefendant
    }];
    req.session.claimDraft = claim;
    return res.redirect('/claims/defendant-details');
  }

  // Build defendant object
  const defendant = {
    nameKnown,
    addAnotherDefendant
  };

  // Add name if known
  if (nameKnown === 'yes') {
    defendant.firstName = firstName.trim();
    defendant.lastName = lastName.trim();
  }

  // Handle address
  defendant.addressKnown = addressKnown;
  if (addressKnown === 'yes') {
    defendant.addressSameAsProperty = addressSameAsProperty;

    if (addressSameAsProperty === 'yes') {
      // Copy property address
      const claim = claimService.getClaim(req.session) || {};
      const propertyAddress = claim.propertyAddress || {};
      defendant.correspondenceAddress = {
        buildingAndStreet: propertyAddress.buildingAndStreet || '',
        addressLine2: propertyAddress.addressLine2 || '',
        townOrCity: propertyAddress.townOrCity || '',
        county: propertyAddress.county || '',
        postcode: propertyAddress.postcode || ''
      };
    } else {
      // Use provided address
      defendant.correspondenceAddress = {
        buildingAndStreet: buildingAndStreet.trim(),
        addressLine2: addressLine2 ? addressLine2.trim() : '',
        townOrCity: townOrCity.trim(),
        county: county ? county.trim() : '',
        postcode: postcode.trim()
      };
    }
  }

  // Store defendant as array (single defendant for now)
  claimService.updateClaim(req.session, 'defendants', [defendant]);

  res.redirect('/claims/tenancy');
});

// GET /claims/tenancy
router.get('/tenancy', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get tenancy from session or use defaults
  const tenancy = claim.tenancy || {};

  res.render('pages/claims/tenancy', {
    pageTitle: 'Tenancy or licence details',
    errors: errors, // For layout template to check for error title prefix
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      tenancyType: tenancy.tenancyType || '',
      otherTypeDetails: tenancy.otherTypeDetails || '',
      'startDate-day': tenancy.startDate?.day || '',
      'startDate-month': tenancy.startDate?.month || '',
      'startDate-year': tenancy.startDate?.year || '',
      documents: tenancy.documents || []
    },
  });

  delete req.session.errors;
});

// POST /claims/tenancy
router.post('/tenancy', (req, res) => {
  const tenancyType = req.body.tenancyType;
  const otherTypeDetails = req.body.otherTypeDetails;
  const startDateDay = req.body['startDate-day'];
  const startDateMonth = req.body['startDate-month'];
  const startDateYear = req.body['startDate-year'];
  const uploadedFileName = req.body.uploadedFileName;
  const uploadedFileSize = req.body.uploadedFileSize;
  const action = req.body.action; // 'addDocument' when Add new button clicked

  const errors = [];

  // Validate tenancy type is selected
  if (!tenancyType) {
    errors.push({
      field: 'tenancyType',
      message: 'Select the tenancy or licence type',
      href: '#tenancyType',
    });
  }

  // Validate "Other" free-text if "Other" is selected
  if (tenancyType === 'other') {
    if (otherTypeDetails && otherTypeDetails.length > 255) {
      errors.push({
        field: 'otherTypeDetails',
        message: 'Tenancy type description must be 255 characters or less',
        href: '#otherTypeDetails',
      });
    }
  }

  // Validate start date (optional, but if any part entered, all required)
  const hasDay = startDateDay && startDateDay.trim() !== '';
  const hasMonth = startDateMonth && startDateMonth.trim() !== '';
  const hasYear = startDateYear && startDateYear.trim() !== '';
  const hasAnyDate = hasDay || hasMonth || hasYear;
  const hasCompleteDate = hasDay && hasMonth && hasYear;

  if (hasAnyDate && !hasCompleteDate) {
    errors.push({
      field: 'startDate',
      message: 'Enter a complete start date or leave all fields blank',
      href: '#startDate-day',
    });
  }

  // Validate date values if complete
  if (hasCompleteDate) {
    const day = parseInt(startDateDay, 10);
    const month = parseInt(startDateMonth, 10);
    const year = parseInt(startDateYear, 10);

    if (isNaN(day) || day < 1 || day > 31) {
      errors.push({
        field: 'startDate-day',
        message: 'Day must be between 1 and 31',
        href: '#startDate-day',
      });
    }

    if (isNaN(month) || month < 1 || month > 12) {
      errors.push({
        field: 'startDate-month',
        message: 'Month must be between 1 and 12',
        href: '#startDate-month',
      });
    }

    if (isNaN(year) || year < 1800 || year > 2100) {
      errors.push({
        field: 'startDate-year',
        message: 'Year must be between 1800 and 2100',
        href: '#startDate-year',
      });
    }
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily
    const claim = claimService.getClaim(req.session) || {};
    claim.tenancy = {
      tenancyType,
      otherTypeDetails,
      startDate: {
        day: startDateDay,
        month: startDateMonth,
        year: startDateYear
      },
      documents: claim.tenancy?.documents || []
    };
    req.session.claimDraft = claim;
    return res.redirect('/claims/tenancy');
  }

  // Build tenancy object
  const tenancy = {
    tenancyType
  };

  // Add other type if specified
  if (tenancyType === 'other' && otherTypeDetails) {
    tenancy.otherTypeDetails = otherTypeDetails.trim();
  }

  // Add start date if complete
  if (hasCompleteDate) {
    tenancy.startDate = {
      day: startDateDay.trim(),
      month: startDateMonth.trim(),
      year: startDateYear.trim()
    };
  }

  // Preserve existing documents
  const existingTenancy = claimService.getClaim(req.session)?.tenancy || {};
  tenancy.documents = existingTenancy.documents || [];

  // Handle file upload (simulated)
  if (uploadedFileName && uploadedFileName.trim() !== '') {
    const fileName = uploadedFileName.trim();

    // Validate file extension
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
    const hasValidExtension = allowedExtensions.some(ext =>
      fileName.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      req.session.errors = [{
        field: 'uploadedFileName',
        message: 'File must be a PDF, DOC, DOCX, JPG, or PNG',
        href: '#uploadedFileName',
      }];
      const claim = claimService.getClaim(req.session) || {};
      claim.tenancy = tenancy;
      req.session.claimDraft = claim;
      return res.redirect('/claims/tenancy');
    }

    // Validate file size (5MB limit)
    if (uploadedFileSize && parseInt(uploadedFileSize, 10) > 5000000) {
      req.session.errors = [{
        field: 'uploadedFileName',
        message: 'File must be smaller than 5MB',
        href: '#uploadedFileName',
      }];
      const claim = claimService.getClaim(req.session) || {};
      claim.tenancy = tenancy;
      req.session.claimDraft = claim;
      return res.redirect('/claims/tenancy');
    }

    // Add file to documents array (simulated metadata)
    tenancy.documents.push({
      id: Date.now().toString(),
      name: fileName,
      uploadedAt: new Date().toISOString()
    });
  }

  // Determine groundsModel based on tenancy type
  let groundsModel;
  if (tenancyType === 'assured-tenancy') {
    groundsModel = 'ASSURED';
  } else if (['secure-tenancy', 'introductory-tenancy', 'flexible-tenancy'].includes(tenancyType)) {
    groundsModel = 'SECURE_LIKE';
  } else {
    // demoted-tenancy or other
    groundsModel = 'OTHER_UNSUPPORTED';
  }

  // Store groundsModel in tenancy
  tenancy.groundsModel = groundsModel;

  // Check if groundsModel has changed and clear incompatible grounds data
  const claim = claimService.getClaim(req.session) || {};
  const previousGroundsModel = claim.tenancy?.groundsModel;

  if (previousGroundsModel && previousGroundsModel !== groundsModel) {
    // Clear grounds data when groundsModel changes
    if (claim.grounds) {
      if (previousGroundsModel === 'ASSURED') {
        // Clear assured-specific grounds
        delete claim.grounds.assuredTenancy;
        delete claim.grounds.rentArrears;
        delete claim.grounds.hasAdditionalGrounds;
      } else if (previousGroundsModel === 'SECURE_LIKE') {
        // Clear secure-like-specific grounds
        delete claim.grounds.secureTenancy;
      }
      // For OTHER_UNSUPPORTED or any transition to it, clear all grounds
      if (groundsModel === 'OTHER_UNSUPPORTED') {
        claim.grounds = {};
      }
      claimService.updateClaim(req.session, 'grounds', claim.grounds);
    }
  }

  claimService.updateClaim(req.session, 'tenancy', tenancy);

  // If "Add new" button was clicked, stay on the tenancy page
  if (action === 'addDocument') {
    return res.redirect('/claims/tenancy');
  }

  // Route based on groundsModel
  if (groundsModel === 'ASSURED') {
    res.redirect('/claims/grounds-for-possession-assured-confirmation');
  } else if (groundsModel === 'SECURE_LIKE') {
    res.redirect('/claims/grounds-for-possession-secure-flexible');
  } else {
    res.redirect('/claims/grounds-for-possession-intro-demoted-other');
  }
});

// GET /claims/tenancy/remove-document - Remove document via link (avoids nested form issue)
router.get('/tenancy/remove-document', (req, res) => {
  const { documentId } = req.query;

  const claim = claimService.getClaim(req.session) || {};
  const tenancy = claim.tenancy || {};

  if (tenancy.documents && Array.isArray(tenancy.documents)) {
    tenancy.documents = tenancy.documents.filter(doc => doc.id !== documentId);
    claimService.updateClaim(req.session, 'tenancy', tenancy);
  }

  res.redirect('/claims/tenancy');
});

// POST /claims/tenancy/remove-document (kept for backwards compatibility)
router.post('/tenancy/remove-document', (req, res) => {
  const { documentId } = req.body;

  const claim = claimService.getClaim(req.session) || {};
  const tenancy = claim.tenancy || {};

  if (tenancy.documents && Array.isArray(tenancy.documents)) {
    tenancy.documents = tenancy.documents.filter(doc => doc.id !== documentId);
    claimService.updateClaim(req.session, 'tenancy', tenancy);
  }

  res.redirect('/claims/tenancy');
});

// GET /claims/claimant-details (placeholder for next screen)
router.get('/claimant-details', (req, res) => {
  const claim = claimService.getClaim(req.session);

  res.render('pages/claims/claimant-details', {
    pageTitle: 'Claimant details',
    showBackLink: true,
    backLinkHref: '/claims/name-of-claimant',
    claim,
  });
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

// GET /claims/grounds-for-possession-assured-confirmation - Screen 13.1: Assured journey confirmation
router.get('/grounds-for-possession-assured-confirmation', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved assuredProceed selection
  const grounds = claim.grounds || {};
  const assuredProceed = grounds.assuredProceed;

  res.render('pages/claims/grounds-assured-confirmation', {
    pageTitle: 'Assured tenancy grounds confirmation',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      assuredProceed: assuredProceed === true ? 'yes' : assuredProceed === false ? 'no' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/grounds-for-possession-assured-confirmation - Screen 13.1: Branch based on assured journey choice
router.post('/grounds-for-possession-assured-confirmation', (req, res) => {
  const { assuredProceed } = req.body;

  const errors = [];

  // Validate assuredProceed selection
  if (!assuredProceed) {
    errors.push({
      field: 'assuredProceed',
      message: 'Select whether you want to proceed with assured-tenancy grounds',
      href: '#assuredProceed',
    });
  }

  if (errors.length > 0) {
    // Build error list for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = error.message;
    });

    return res.render('pages/claims/grounds-assured-confirmation', {
      pageTitle: 'Assured tenancy grounds confirmation',
      errors: errors,
      errorList: errorList,
      fieldErrors: fieldErrors,
      values: {
        assuredProceed: assuredProceed || ''
      },
    });
  }

  // Store assuredProceed as boolean in grounds object
  const claim = claimService.getClaim(req.session) || {};
  const grounds = claim.grounds || {};
  grounds.assuredProceed = assuredProceed === 'yes';

  claimService.updateClaim(req.session, 'grounds', grounds);

  // Branch based on selection
  if (assuredProceed === 'yes') {
    res.redirect('/claims/grounds-for-possession-assured-selection');
  } else {
    res.redirect('/claims/grounds-for-possession');
  }
});

// Helper: Validate secure/flexible grounds (at least one required)
function validateSecureGrounds(body) {
  const hasAnyGround = body.ground1 || body.ground2 || body.ground2A ||
                       body.ground3 || body.ground4 || body.ground5 ||
                       body.ground6 || body.ground7 || body.ground8;

  if (!hasAnyGround) {
    return 'Select at least one ground for possession';
  }

  return null;
}

// Helper: Validate Ground 1 type (required when Ground 1 selected)
function validateSecureGround1Type(body) {
  if (body.ground1 && !body.ground1Type) {
    return 'Select whether ground 1 is rent arrears or breach of tenancy';
  }

  return null;
}

// GET /claims/grounds-for-possession-secure-flexible - Screen 13.2
router.get('/grounds-for-possession-secure-flexible', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const grounds = claim.grounds?.secureFlexible || {};

  res.render('pages/claims/grounds-secure-flexible', {
    pageTitle: 'Grounds for possession',
    ground1: grounds.ground1 || false,
    ground1Type: grounds.ground1Type || '',
    ground2: grounds.ground2 || false,
    ground2A: grounds.ground2A || false,
    ground3: grounds.ground3 || false,
    ground4: grounds.ground4 || false,
    ground5: grounds.ground5 || false,
    ground6: grounds.ground6 || false,
    ground7: grounds.ground7 || false,
    ground8: grounds.ground8 || false,
    errors: {},
    errorList: []
  });
});

// POST /claims/grounds-for-possession-secure-flexible - Screen 13.2
router.post('/grounds-for-possession-secure-flexible', (req, res) => {
  const {
    ground1, ground1Type, ground2, ground2A, ground3,
    ground4, ground5, ground6, ground7, ground8
  } = req.body;

  const errors = {};

  // Validate: at least one ground selected
  const groundsError = validateSecureGrounds(req.body);
  if (groundsError) {
    errors.grounds = { text: groundsError };
  }

  // Validate: Ground 1 type required when Ground 1 selected
  const ground1TypeError = validateSecureGround1Type(req.body);
  if (ground1TypeError) {
    errors.ground1Type = { text: ground1TypeError };
  }

  // If validation errors, re-render with errors
  if (Object.keys(errors).length > 0) {
    const errorList = Object.entries(errors).map(([field, error]) => ({
      text: error.text,
      href: `#${field}`
    }));

    return res.status(400).render('pages/claims/grounds-secure-flexible', {
      pageTitle: 'Grounds for possession',
      ground1: !!ground1,
      ground1Type: ground1Type || '',
      ground2: !!ground2,
      ground2A: !!ground2A,
      ground3: !!ground3,
      ground4: !!ground4,
      ground5: !!ground5,
      ground6: !!ground6,
      ground7: !!ground7,
      ground8: !!ground8,
      errors,
      errorList
    });
  }

  // Store in session
  const claim = claimService.getClaim(req.session) || {};
  if (!claim.grounds) {
    claim.grounds = {};
  }

  claim.grounds.secureFlexible = {
    ground1: !!ground1,
    ground1Type: ground1 ? (ground1Type || null) : null,
    ground2: !!ground2,
    ground2A: !!ground2A,
    ground3: !!ground3,
    ground4: !!ground4,
    ground5: !!ground5,
    ground6: !!ground6,
    ground7: !!ground7,
    ground8: !!ground8
  };

  claimService.updateClaim(req.session, 'grounds', claim.grounds);

  // Redirect to reasons for possession
  res.redirect('/claims/reasons-for-possession');
});

// GET /claims/grounds-for-possession-intro-demoted-other - Placeholder for OTHER_UNSUPPORTED path
router.get('/grounds-for-possession-intro-demoted-other', (req, res) => {
  res.render('pages/claims/grounds-intro-demoted-other', {
    pageTitle: 'Grounds for possession',
  });
});

// GET /claims/grounds - Screen 13.1: Rent arrears branch point (legacy route - redirects to new name)
router.get('/grounds', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved rent arrears selection
  const grounds = claim.grounds || {};
  const rentArrears = grounds.rentArrears;

  res.render('pages/claims/grounds', {
    pageTitle: 'Grounds for possession',
    errors: errors, // For layout template to check for error title prefix
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      rentArrears: rentArrears === true ? 'yes' : rentArrears === false ? 'no' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/grounds - Screen 13.1: Branch based on rent arrears
router.post('/grounds', (req, res) => {
  const { rentArrears } = req.body;

  const errors = [];

  // Validate rent arrears selection
  if (!rentArrears) {
    errors.push({
      field: 'rentArrears',
      message: 'Select yes if you are claiming possession because of rent arrears',
      href: '#rentArrears',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/grounds');
  }

  // Store rent arrears as boolean in grounds object
  const grounds = {
    rentArrears: rentArrears === 'yes'
  };

  claimService.updateClaim(req.session, 'grounds', grounds);

  // Branch based on selection
  if (rentArrears === 'yes') {
    res.redirect('/claims/assured-tenancy-grounds-selection');
  } else {
    res.redirect('/claims/other-tenancy-grounds');
  }
});

// GET /claims/assured-tenancy-grounds-selection - Screen 13.1.1
router.get('/assured-tenancy-grounds-selection', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved grounds selection
  const grounds = claim.grounds || {};
  const assuredTenancy = grounds.assuredTenancy || {};

  res.render('pages/claims/assured-tenancy-grounds-selection', {
    pageTitle: 'Grounds for possession',
    errors: errors, // For layout template to check for error title prefix
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      ground8: assuredTenancy.ground8 === true,
      ground10: assuredTenancy.ground10 === true,
      ground11: assuredTenancy.ground11 === true,
      hasAdditionalGrounds: grounds.hasAdditionalGrounds === true ? 'yes' : grounds.hasAdditionalGrounds === false ? 'no' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/assured-tenancy-grounds-selection - Screen 13.1.1
router.post('/assured-tenancy-grounds-selection', (req, res) => {
  const { ground8, ground10, ground11, hasAdditionalGrounds } = req.body;

  const errors = [];

  // Validate hasAdditionalGrounds selection (required)
  if (!hasAdditionalGrounds) {
    errors.push({
      field: 'hasAdditionalGrounds',
      message: 'Select whether you have other grounds for possession',
      href: '#hasAdditionalGrounds',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily
    const claim = claimService.getClaim(req.session) || {};
    const grounds = claim.grounds || {};
    grounds.assuredTenancy = {
      ground8: ground8 === 'true',
      ground10: ground10 === 'true',
      ground11: ground11 === 'true'
    };
    req.session.claimDraft = claim;
    req.session.claimDraft.grounds = grounds;
    return res.redirect('/claims/assured-tenancy-grounds-selection');
  }

  // Get existing grounds object (preserves rentArrears from screen 13.1)
  const claim = claimService.getClaim(req.session) || {};
  const grounds = claim.grounds || {};

  // Store assured tenancy selections
  grounds.assuredTenancy = {
    ground8: ground8 === 'true',
    ground10: ground10 === 'true',
    ground11: ground11 === 'true'
  };

  // Store hasAdditionalGrounds as boolean
  grounds.hasAdditionalGrounds = hasAdditionalGrounds === 'yes';

  claimService.updateClaim(req.session, 'grounds', grounds);

  // Branch based on selection
  if (hasAdditionalGrounds === 'yes') {
    res.redirect('/claims/grounds-for-possession');
  } else {
    res.redirect('/claims/preaction-protocol');
  }
});

// GET /claims/grounds-for-possession-assured-selection - Screen 13.1.1 (new route name)
router.get('/grounds-for-possession-assured-selection', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved grounds selection
  const grounds = claim.grounds || {};
  const assuredTenancy = grounds.assuredTenancy || {};

  res.render('pages/claims/assured-tenancy-grounds-selection', {
    pageTitle: 'Grounds for possession',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      ground8: assuredTenancy.ground8 === true,
      ground10: assuredTenancy.ground10 === true,
      ground11: assuredTenancy.ground11 === true,
      hasAdditionalGrounds: grounds.hasAdditionalGrounds === true ? 'yes' : grounds.hasAdditionalGrounds === false ? 'no' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/grounds-for-possession-assured-selection - Screen 13.1.1 (new route name)
router.post('/grounds-for-possession-assured-selection', (req, res) => {
  const { ground8, ground10, ground11, hasAdditionalGrounds } = req.body;

  const errors = [];

  // Validate hasAdditionalGrounds selection (required)
  if (!hasAdditionalGrounds) {
    errors.push({
      field: 'hasAdditionalGrounds',
      message: 'Select whether you have other grounds for possession',
      href: '#hasAdditionalGrounds',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    // Store submitted values temporarily
    const claim = claimService.getClaim(req.session) || {};
    const grounds = claim.grounds || {};
    grounds.assuredTenancy = {
      ground8: ground8 === 'true',
      ground10: ground10 === 'true',
      ground11: ground11 === 'true'
    };
    req.session.claimDraft = claim;
    req.session.claimDraft.grounds = grounds;
    return res.redirect('/claims/grounds-for-possession-assured-selection');
  }

  // Get existing grounds object
  const claim = claimService.getClaim(req.session) || {};
  const grounds = claim.grounds || {};

  // Store assured tenancy selections
  grounds.assuredTenancy = {
    ground8: ground8 === 'true',
    ground10: ground10 === 'true',
    ground11: ground11 === 'true'
  };

  // Store hasAdditionalGrounds as boolean
  grounds.hasAdditionalGrounds = hasAdditionalGrounds === 'yes';

  claimService.updateClaim(req.session, 'grounds', grounds);

  // Branch based on selection
  if (hasAdditionalGrounds === 'yes') {
    // Set up navigation contract for Screen 14
    if (!claim.navigation) claim.navigation = {};
    claim.navigation.screen14 = {
      previous: '/claims/grounds-for-possession-assured-selection',
      continue: '/claims/reasons-for-possession',
      titleMode: 'additional'
    };
    claimService.updateClaim(req.session, 'navigation', claim.navigation);
    res.redirect('/claims/grounds-for-possession');
  } else {
    res.redirect('/claims/preaction-protocol');
  }
});

// ============================================================================
// Screen 14: Grounds for Possession (Additional Grounds)
// ============================================================================

// GET /claims/grounds-for-possession - Screen 14
router.get('/grounds-for-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const navigation = claim.navigation?.screen14 || {};
  const additional = claim.grounds?.additional || {};

  // Determine title based on titleMode
  const titleMode = navigation.titleMode || 'additional';
  const pageTitle = titleMode === 'additional'
    ? 'Additional grounds for possession'
    : 'Grounds for possession';

  res.render('pages/claims/grounds-for-possession', {
    pageTitle,
    titleMode,
    navigation,
    // Mandatory grounds (1, 3, 4, 5, 7, 8)
    mandatoryGround1: additional.mandatoryGround1 || false,
    mandatoryGround3: additional.mandatoryGround3 || false,
    mandatoryGround4: additional.mandatoryGround4 || false,
    mandatoryGround5: additional.mandatoryGround5 || false,
    mandatoryGround7: additional.mandatoryGround7 || false,
    mandatoryGround8: additional.mandatoryGround8 || false,
    // Discretionary grounds (9-16)
    discretionaryGround9: additional.discretionaryGround9 || false,
    discretionaryGround10: additional.discretionaryGround10 || false,
    discretionaryGround11: additional.discretionaryGround11 || false,
    discretionaryGround12: additional.discretionaryGround12 || false,
    discretionaryGround13: additional.discretionaryGround13 || false,
    discretionaryGround14: additional.discretionaryGround14 || false,
    discretionaryGround15: additional.discretionaryGround15 || false,
    discretionaryGround16: additional.discretionaryGround16 || false,
    errors: {},
    errorList: []
  });
});

// POST /claims/grounds-for-possession - Screen 14
router.post('/grounds-for-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const navigation = claim.navigation?.screen14 || {};
  const { grounds } = req.body;

  // Convert grounds array to object with boolean values
  const groundsArray = Array.isArray(grounds) ? grounds : (grounds ? [grounds] : []);

  const additional = {
    mandatoryGround1: groundsArray.includes('mandatoryGround1'),
    mandatoryGround3: groundsArray.includes('mandatoryGround3'),
    mandatoryGround4: groundsArray.includes('mandatoryGround4'),
    mandatoryGround5: groundsArray.includes('mandatoryGround5'),
    mandatoryGround7: groundsArray.includes('mandatoryGround7'),
    mandatoryGround8: groundsArray.includes('mandatoryGround8'),
    discretionaryGround9: groundsArray.includes('discretionaryGround9'),
    discretionaryGround10: groundsArray.includes('discretionaryGround10'),
    discretionaryGround11: groundsArray.includes('discretionaryGround11'),
    discretionaryGround12: groundsArray.includes('discretionaryGround12'),
    discretionaryGround13: groundsArray.includes('discretionaryGround13'),
    discretionaryGround14: groundsArray.includes('discretionaryGround14'),
    discretionaryGround15: groundsArray.includes('discretionaryGround15'),
    discretionaryGround16: groundsArray.includes('discretionaryGround16')
  };

  // Handle Continue action
  // Validation: at least one ground required
  const hasAnyGround = Object.values(additional).some(v => v === true);

  if (!hasAnyGround) {
    const titleMode = navigation.titleMode || 'additional';
    const pageTitle = titleMode === 'additional'
      ? 'Additional grounds for possession'
      : 'Grounds for possession';

    return res.status(200).render('pages/claims/grounds-for-possession', {
      pageTitle,
      titleMode,
      navigation,
      ...additional,
      errors: {
        grounds: { text: 'Select at least one ground for possession' }
      },
      errorList: [{
        text: 'Select at least one ground for possession',
        href: '#grounds'
      }]
    });
  }

  // Store in session
  if (!claim.grounds) claim.grounds = {};
  claim.grounds.additional = additional;
  claimService.updateClaim(req.session, 'grounds', claim.grounds);

  // Redirect using navigation contract
  const continueRoute = navigation.continue || '/claims/reasons-for-possession';
  res.redirect(continueRoute);
});

// ============================================================================
// Screen 15: Reasons for Possession
// ============================================================================

// Ground definitions with display names
const groundDefinitions = {
  // Assured tenancy grounds (from screen 13.1.1)
  'assured.ground8': { name: 'Persistent delay in paying rent', number: 'Ground 8' },
  'assured.ground10': { name: 'Some rent arrears', number: 'Ground 10' },
  'assured.ground11': { name: 'Persistent delay in paying rent', number: 'Ground 11' },
  // Secure/flexible tenancy grounds (from screen 13.2)
  'secureFlexible.ground1': { name: 'Rent arrears or breach of tenancy', number: 'Ground 1' },
  'secureFlexible.ground2': { name: 'Nuisance or annoyance', number: 'Ground 2' },
  'secureFlexible.ground2A': { name: 'Domestic violence', number: 'Ground 2A' },
  'secureFlexible.ground3': { name: 'Deterioration of dwelling', number: 'Ground 3' },
  'secureFlexible.ground4': { name: 'Deterioration of furniture', number: 'Ground 4' },
  'secureFlexible.ground5': { name: 'False statement', number: 'Ground 5' },
  'secureFlexible.ground6': { name: 'Premium paid for assignment', number: 'Ground 6' },
  'secureFlexible.ground7': { name: 'Misconduct or conviction', number: 'Ground 7' },
  'secureFlexible.ground8': { name: 'Serious rent arrears', number: 'Ground 8' },
  // Additional mandatory grounds (from screen 14)
  'additional.mandatoryGround1': { name: 'Landlord requires property', number: 'Ground 1' },
  'additional.mandatoryGround3': { name: 'Out of season holiday let', number: 'Ground 3' },
  'additional.mandatoryGround4': { name: 'Student accommodation', number: 'Ground 4' },
  'additional.mandatoryGround5': { name: 'Minister of religion', number: 'Ground 5' },
  'additional.mandatoryGround7': { name: 'Death of tenant', number: 'Ground 7' },
  'additional.mandatoryGround8': { name: 'Serious rent arrears', number: 'Ground 8' },
  // Additional discretionary grounds (from screen 14)
  'additional.discretionaryGround9': { name: 'Suitable alternative accommodation', number: 'Ground 9' },
  'additional.discretionaryGround10': { name: 'Some rent arrears', number: 'Ground 10' },
  'additional.discretionaryGround11': { name: 'Persistent delay in paying rent', number: 'Ground 11' },
  'additional.discretionaryGround12': { name: 'Breach of tenancy obligation', number: 'Ground 12' },
  'additional.discretionaryGround13': { name: 'Waste or neglect', number: 'Ground 13' },
  'additional.discretionaryGround14': { name: 'Nuisance or annoyance', number: 'Ground 14' },
  'additional.discretionaryGround15': { name: 'Deterioration of furniture', number: 'Ground 15' },
  'additional.discretionaryGround16': { name: 'Employee letting', number: 'Ground 16' }
};

// Helper to collect all selected grounds from session
function getSelectedGrounds(claim) {
  const selectedGrounds = [];
  const grounds = claim.grounds || {};

  // Check assured tenancy grounds
  const assured = grounds.assuredTenancy || {};
  if (assured.ground8) selectedGrounds.push('assured.ground8');
  if (assured.ground10) selectedGrounds.push('assured.ground10');
  if (assured.ground11) selectedGrounds.push('assured.ground11');

  // Check secure/flexible tenancy grounds
  const secureFlexible = grounds.secureFlexible || {};
  if (secureFlexible.ground1) selectedGrounds.push('secureFlexible.ground1');
  if (secureFlexible.ground2) selectedGrounds.push('secureFlexible.ground2');
  if (secureFlexible.ground2A) selectedGrounds.push('secureFlexible.ground2A');
  if (secureFlexible.ground3) selectedGrounds.push('secureFlexible.ground3');
  if (secureFlexible.ground4) selectedGrounds.push('secureFlexible.ground4');
  if (secureFlexible.ground5) selectedGrounds.push('secureFlexible.ground5');
  if (secureFlexible.ground6) selectedGrounds.push('secureFlexible.ground6');
  if (secureFlexible.ground7) selectedGrounds.push('secureFlexible.ground7');
  if (secureFlexible.ground8) selectedGrounds.push('secureFlexible.ground8');

  // Check additional grounds
  const additional = grounds.additional || {};
  if (additional.mandatoryGround1) selectedGrounds.push('additional.mandatoryGround1');
  if (additional.mandatoryGround3) selectedGrounds.push('additional.mandatoryGround3');
  if (additional.mandatoryGround4) selectedGrounds.push('additional.mandatoryGround4');
  if (additional.mandatoryGround5) selectedGrounds.push('additional.mandatoryGround5');
  if (additional.mandatoryGround7) selectedGrounds.push('additional.mandatoryGround7');
  if (additional.mandatoryGround8) selectedGrounds.push('additional.mandatoryGround8');
  if (additional.discretionaryGround9) selectedGrounds.push('additional.discretionaryGround9');
  if (additional.discretionaryGround10) selectedGrounds.push('additional.discretionaryGround10');
  if (additional.discretionaryGround11) selectedGrounds.push('additional.discretionaryGround11');
  if (additional.discretionaryGround12) selectedGrounds.push('additional.discretionaryGround12');
  if (additional.discretionaryGround13) selectedGrounds.push('additional.discretionaryGround13');
  if (additional.discretionaryGround14) selectedGrounds.push('additional.discretionaryGround14');
  if (additional.discretionaryGround15) selectedGrounds.push('additional.discretionaryGround15');
  if (additional.discretionaryGround16) selectedGrounds.push('additional.discretionaryGround16');

  return selectedGrounds;
}

// GET /claims/reasons-for-possession - Screen 15: Reasons for possession
router.get('/reasons-for-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const selectedGrounds = getSelectedGrounds(claim);

  // If no grounds selected, skip to next screen
  if (selectedGrounds.length === 0) {
    return res.redirect('/claims/preaction-protocol');
  }

  // Initialize or get the loop controller
  let reasonsLoop = claim.reasonsLoop || { grounds: selectedGrounds, currentIndex: 0 };

  // If loop not yet initialized with current grounds, reset it
  if (!claim.reasonsLoop || JSON.stringify(claim.reasonsLoop.grounds) !== JSON.stringify(selectedGrounds)) {
    reasonsLoop = { grounds: selectedGrounds, currentIndex: 0 };
    claimService.updateClaim(req.session, 'reasonsLoop', reasonsLoop);
  }

  const currentGroundKey = reasonsLoop.grounds[reasonsLoop.currentIndex];
  const groundDef = groundDefinitions[currentGroundKey] || { name: 'Unknown ground', number: '' };

  // Get any previously saved reasons for this ground
  const reasonsForPossession = claim.reasonsForPossession || {};
  const savedReasons = reasonsForPossession[currentGroundKey] || '';

  res.render('pages/claims/reasons-for-possession', {
    pageTitle: 'Reasons for possession',
    groundName: groundDef.name,
    groundNumber: groundDef.number,
    groundKey: currentGroundKey,
    currentIndex: reasonsLoop.currentIndex,
    totalGrounds: reasonsLoop.grounds.length,
    reasons: savedReasons,
    errors: {},
    errorList: []
  });
});

// POST /claims/reasons-for-possession - Screen 15
router.post('/reasons-for-possession', (req, res) => {
  const { reasons, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Initialize or get the loop controller (same logic as GET)
  const selectedGrounds = getSelectedGrounds(claim);
  let reasonsLoop = claim.reasonsLoop;

  // Initialize loop if not present or grounds have changed
  if (!reasonsLoop || JSON.stringify(reasonsLoop.grounds) !== JSON.stringify(selectedGrounds)) {
    reasonsLoop = { grounds: selectedGrounds, currentIndex: 0 };
    claimService.updateClaim(req.session, 'reasonsLoop', reasonsLoop);
  }

  const currentGroundKey = reasonsLoop.grounds[reasonsLoop.currentIndex];
  const groundDef = groundDefinitions[currentGroundKey] || { name: 'Unknown ground', number: '' };

  // Handle Previous action
  if (action === 'previous') {
    // Save current input before navigating back
    if (reasons && reasons.trim()) {
      const reasonsForPossession = claim.reasonsForPossession || {};
      reasonsForPossession[currentGroundKey] = reasons.trim();
      claimService.updateClaim(req.session, 'reasonsForPossession', reasonsForPossession);
    }

    if (reasonsLoop.currentIndex > 0) {
      // Go to previous ground
      reasonsLoop.currentIndex--;
      claimService.updateClaim(req.session, 'reasonsLoop', reasonsLoop);
      return res.redirect('/claims/reasons-for-possession');
    } else {
      // First ground - go back to grounds selection
      return res.redirect('/claims/grounds-for-possession');
    }
  }

  // Handle Continue action
  const errors = {};
  const errorList = [];

  // AC-4: Character limit enforced (500 characters)
  if (reasons && reasons.length > 500) {
    errors.reasons = { text: 'Enter 500 characters or fewer' };
    errorList.push({ text: 'Enter 500 characters or fewer', href: '#reasons' });
  }

  // If validation errors, re-render
  if (errorList.length > 0) {
    return res.status(400).render('pages/claims/reasons-for-possession', {
      pageTitle: 'Reasons for possession',
      groundName: groundDef.name,
      groundNumber: groundDef.number,
      groundKey: currentGroundKey,
      currentIndex: reasonsLoop.currentIndex,
      totalGrounds: reasonsLoop.grounds.length,
      reasons: reasons || '',
      errors,
      errorList
    });
  }

  // AC-6: Persist reasons per ground
  const reasonsForPossession = claim.reasonsForPossession || {};
  reasonsForPossession[currentGroundKey] = (reasons || '').trim();
  claimService.updateClaim(req.session, 'reasonsForPossession', reasonsForPossession);

  // AC-7/AC-8: Move to next ground or complete
  if (reasonsLoop.currentIndex < reasonsLoop.grounds.length - 1) {
    // More grounds to process
    reasonsLoop.currentIndex++;
    claimService.updateClaim(req.session, 'reasonsLoop', reasonsLoop);
    return res.redirect('/claims/reasons-for-possession');
  } else {
    // All grounds processed - clear loop and redirect
    claimService.updateClaim(req.session, 'reasonsLoop', null);
    return res.redirect('/claims/preaction-protocol');
  }
});

// ============================================================================
// Screen 23: Money Judgement (PLACEHOLDER)
// ============================================================================
// GET /claims/money-judgement - Screen 23: Money judgement
router.get('/money-judgement', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const moneyJudgement = claim.moneyJudgement || {};

  // Convert boolean to form value for pre-population
  let moneyJudgementRequested = '';
  if (moneyJudgement.requested === true) {
    moneyJudgementRequested = 'yes';
  } else if (moneyJudgement.requested === false) {
    moneyJudgementRequested = 'no';
  }

  res.render('pages/claims/money-judgement', {
    pageTitle: 'Money judgement',
    moneyJudgementRequested,
    errors: {},
    errorList: []
  });
});

// POST /claims/money-judgement - Screen 23: Money judgement
router.post('/money-judgement', (req, res) => {
  const { moneyJudgementRequested } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!moneyJudgementRequested) {
    errors.moneyJudgementRequested = { text: 'Select whether you want the court to make a judgment for the outstanding arrears' };
    errorList.push({ text: 'Select whether you want the court to make a judgment for the outstanding arrears', href: '#moneyJudgementRequested' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/money-judgement', {
      pageTitle: 'Money judgement',
      moneyJudgementRequested: moneyJudgementRequested || '',
      errors,
      errorList
    });
  }

  // Store in session - convert form value to boolean
  const moneyJudgement = {
    requested: moneyJudgementRequested === 'yes'
  };
  claimService.updateClaim(req.session, 'moneyJudgement', moneyJudgement);

  // Redirect to next screen
  res.redirect('/claims/claimants-circumstances');
});

// ============================================================================
// Screen 24: Claimants Circumstances (PLACEHOLDER)
// ============================================================================
// GET /claims/claimants-circumstances - Screen 24: Claimant's circumstances
router.get('/claimants-circumstances', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const claimantCircumstances = claim.claimantCircumstances || {};
  const claimantName = claim.claimantName || 'the claimant';

  // Convert boolean to form value for pre-population
  let provideCircumstances = '';
  if (claimantCircumstances.provided === true) {
    provideCircumstances = 'yes';
  } else if (claimantCircumstances.provided === false) {
    provideCircumstances = 'no';
  }

  res.render('pages/claims/claimants-circumstances', {
    pageTitle: "Claimant's circumstances",
    claimantName,
    provideCircumstances,
    circumstancesDetails: claimantCircumstances.details || '',
    errors: {},
    errorList: []
  });
});

// POST /claims/claimants-circumstances - Screen 24: Claimant's circumstances
router.post('/claimants-circumstances', (req, res) => {
  const { provideCircumstances, circumstancesDetails } = req.body;
  const claim = claimService.getClaim(req.session) || {};
  const claimantName = claim.claimantName || 'the claimant';

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  // AC-2: Selection is required
  if (!provideCircumstances) {
    errors.provideCircumstances = { text: "Select whether you want to provide information about the claimant's circumstances" };
    errorList.push({ text: "Select whether you want to provide information about the claimant's circumstances", href: '#provideCircumstances' });
  }

  // AC-5: Character limit (only if Yes selected and details provided)
  if (provideCircumstances === 'yes' && circumstancesDetails && circumstancesDetails.length > 950) {
    errors.circumstancesDetails = { text: 'Enter 950 characters or fewer' };
    errorList.push({ text: 'Enter 950 characters or fewer', href: '#circumstancesDetails' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/claimants-circumstances', {
      pageTitle: "Claimant's circumstances",
      claimantName,
      provideCircumstances: provideCircumstances || '',
      circumstancesDetails: circumstancesDetails || '',
      errors,
      errorList
    });
  }

  // Store in session
  const claimantCircumstances = {
    provided: provideCircumstances === 'yes',
    details: provideCircumstances === 'yes' ? (circumstancesDetails || null) : null
  };
  claimService.updateClaim(req.session, 'claimantCircumstances', claimantCircumstances);

  // Redirect to next screen
  res.redirect('/claims/defendants-circumstances');
});

// ============================================================================
// Screen 25: Defendant's Circumstances
// ============================================================================
// GET /claims/defendants-circumstances - Screen 25: Defendant's circumstances
router.get('/defendants-circumstances', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const defendantCircumstances = claim.defendantCircumstances || {};

  // Convert boolean to form value for pre-population
  let provideDefendantCircumstances = '';
  if (defendantCircumstances.provided === true) {
    provideDefendantCircumstances = 'yes';
  } else if (defendantCircumstances.provided === false) {
    provideDefendantCircumstances = 'no';
  }

  res.render('pages/claims/defendants-circumstances', {
    pageTitle: "Defendants' circumstances",
    provideDefendantCircumstances,
    defendantDetails: defendantCircumstances.details || '',
    errors: {},
    errorList: []
  });
});

// POST /claims/defendants-circumstances - Screen 25: Defendant's circumstances
router.post('/defendants-circumstances', (req, res) => {
  const { provideDefendantCircumstances, defendantDetails } = req.body;

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  // AC-2: Selection is required
  if (!provideDefendantCircumstances) {
    errors.provideDefendantCircumstances = { text: "Select whether you want to provide information about the defendants' circumstances" };
    errorList.push({ text: "Select whether you want to provide information about the defendants' circumstances", href: '#provideDefendantCircumstances' });
  }

  // AC-5: Character limit (only if Yes selected and details provided)
  if (provideDefendantCircumstances === 'yes' && defendantDetails && defendantDetails.length > 950) {
    errors.defendantDetails = { text: 'Enter 950 characters or fewer' };
    errorList.push({ text: 'Enter 950 characters or fewer', href: '#defendantDetails' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/defendants-circumstances', {
      pageTitle: "Defendants' circumstances",
      provideDefendantCircumstances: provideDefendantCircumstances || '',
      defendantDetails: defendantDetails || '',
      errors,
      errorList
    });
  }

  // Store in session
  const defendantCircumstances = {
    provided: provideDefendantCircumstances === 'yes',
    details: provideDefendantCircumstances === 'yes' ? (defendantDetails || null) : null
  };
  claimService.updateClaim(req.session, 'defendantCircumstances', defendantCircumstances);

  // Redirect to next screen (Screen 26)
  res.redirect('/claims/alternative-to-possession');
});

// ============================================================================
// Screen 26: Alternative to Possession
// ============================================================================
// GET /claims/alternative-to-possession - Screen 26: Alternative to possession
router.get('/alternative-to-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const alternativesToPossession = claim.alternativesToPossession || {};

  let selectedOption = null;
  if (alternativesToPossession.suspensionOfRightToBuy) {
    selectedOption = 'suspensionOfRightToBuy';
  } else if (alternativesToPossession.demotionOfTenancy) {
    selectedOption = 'demotionOfTenancy';
  } else {
    selectedOption = 'neither';
  }

  res.render('pages/claims/alternative-to-possession', {
    pageTitle: 'Alternatives to possession',
    selectedOption: selectedOption,
    errors: {},
    errorList: []
  });
});

// POST /claims/alternative-to-possession
router.post('/alternative-to-possession', (req, res) => {
  const { alternativesToPossession, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/defendants-circumstances');
  }

  // Determine selection and update session
  let suspensionOfRightToBuy = false;
  let demotionOfTenancy = false;

  if (alternativesToPossession === 'suspensionOfRightToBuy') {
    suspensionOfRightToBuy = true;
  } else if (alternativesToPossession === 'demotionOfTenancy') {
    demotionOfTenancy = true;
  }

  // Store in session
  const alternativesToPossessionData = {
    suspensionOfRightToBuy,
    demotionOfTenancy
  };
  claimService.updateClaim(req.session, 'alternativesToPossession', alternativesToPossessionData);

  // Route based on selection
  if (suspensionOfRightToBuy) {
    return res.redirect('/claims/select-housing-act-suspension');
  } else if (demotionOfTenancy) {
    return res.redirect('/claims/select-housing-act-demotion');
  } else {
    return res.redirect('/claims/claiming-costs');
  }
});

// ============================================================================
// Screen 26a: Housing Act (Suspension of right to buy)
// ============================================================================

/**
 * Validates select housing act suspension form submission
 * @param {Object} body - Request body
 * @returns {Array} Array of error objects
 */
function validateSelectHousingActSuspension(body) {
  const errors = [];

  // Housing Act selection required
  if (!body.suspensionHousingAct) {
    errors.push({
      field: 'suspensionHousingAct',
      href: '#suspensionHousingAct',
      text: 'Select the Housing Act'
    });
  }

  // Other name required when Other selected
  if (body.suspensionHousingAct === 'other' && !body.housingActOtherName?.trim()) {
    errors.push({
      field: 'housingActOtherName',
      href: '#housingActOtherName',
      text: 'Enter the name of the Housing Act'
    });
  }

  // Section required
  if (!body.section?.trim()) {
    errors.push({
      field: 'section',
      href: '#section',
      text: 'Enter the Housing Act section'
    });
  } else if (body.section.length > 50) {
    // Section max length
    errors.push({
      field: 'section',
      href: '#section',
      text: 'Enter 50 characters or fewer'
    });
  }

  return errors;
}

// GET /claims/select-housing-act-suspension - Screen 26a
router.get('/select-housing-act-suspension', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const suspensionOrder = claim.suspensionOrder || {};

  res.render('pages/claims/select-housing-act-suspension', {
    pageTitle: 'Housing Act',
    selectedHousingAct: suspensionOrder.housingAct || null,
    otherActName: suspensionOrder.housingActOtherName || '',
    section: suspensionOrder.section || '',
    errors: {},
    errorList: []
  });
});

// POST /claims/select-housing-act-suspension - Screen 26a
router.post('/select-housing-act-suspension', (req, res) => {
  const { suspensionHousingAct, housingActOtherName, section, action } = req.body;

  // Handle Previous navigation
  if (action === 'previous') {
    return res.redirect('/claims/alternative-to-possession');
  }

  // Validate
  const errorList = validateSelectHousingActSuspension(req.body);

  if (errorList.length > 0) {
    // Convert to errors object for template
    const errors = {};
    errorList.forEach(err => {
      errors[err.field] = { text: err.text };
    });

    return res.render('pages/claims/select-housing-act-suspension', {
      pageTitle: 'Housing Act',
      selectedHousingAct: suspensionHousingAct || null,
      otherActName: housingActOtherName || '',
      section: section || '',
      errors,
      errorList
    });
  }

  // Save to session
  const suspensionOrder = {
    housingAct: suspensionHousingAct,
    housingActOtherName: suspensionHousingAct === 'other' ? housingActOtherName : null,
    section: section.trim()
  };
  claimService.updateClaim(req.session, 'suspensionOrder', suspensionOrder);

  // Navigate to next screen
  res.redirect('/claims/reasons-for-suspension');
});

// ============================================================================
// Screen 26b: Reasons for requesting a suspension order
// ============================================================================

/**
 * Validates reasons for suspension form submission
 * @param {Object} body - Request body
 * @returns {Array} Array of error objects
 */
function validateReasonsForSuspension(body) {
  const errors = [];

  // Check max length (only if text is provided)
  if (body.reasons && body.reasons.length > 950) {
    errors.push({
      field: 'reasons',
      href: '#reasons',
      text: 'Enter 950 characters or fewer'
    });
  }

  return errors;
}

// GET /claims/reasons-for-suspension - Screen 26b: Reasons for suspension
router.get('/reasons-for-suspension', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const suspensionOrder = claim.suspensionOrder || {};
  const reasons = suspensionOrder.reasons || '';

  res.render('pages/claims/reasons-for-suspension', {
    pageTitle: 'Reasons for requesting a suspension order',
    reasons,
    errors: {},
    errorList: []
  });
});

// POST /claims/reasons-for-suspension - Screen 26b: Reasons for suspension
router.post('/reasons-for-suspension', (req, res) => {
  const { reasons, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/alternative-to-possession');
  }

  // Validation for Continue action
  const validationErrors = validateReasonsForSuspension(req.body);

  if (validationErrors.length > 0) {
    // Build errors object for template
    const errors = {};
    validationErrors.forEach(error => {
      errors[error.field] = { text: error.text };
    });

    return res.status(200).render('pages/claims/reasons-for-suspension', {
      pageTitle: 'Reasons for requesting a suspension order',
      reasons: reasons || '',
      errors,
      errorList: validationErrors
    });
  }

  // Ensure suspensionOrder object exists in session
  const claim = claimService.getClaim(req.session) || {};
  const suspensionOrder = claim.suspensionOrder || {};

  // Store reasons (null if empty, string otherwise)
  const trimmedReasons = reasons?.trim() || null;
  suspensionOrder.reasons = trimmedReasons;

  // Update session preserving existing suspensionOrder data
  claimService.updateClaim(req.session, 'suspensionOrder', suspensionOrder);

  // Redirect to next screen
  res.redirect('/claims/claiming-costs');
});

// ============================================================================
// Screen 28: Claiming Costs
// ============================================================================
// GET /claims/claiming-costs - Screen 28: Claiming costs
router.get('/claiming-costs', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const claimingCostsData = claim.claimingCosts || {};
  const claimingCosts = claimingCostsData.value || null;

  res.render('pages/claims/claiming-costs', {
    pageTitle: 'Claiming costs',
    claimingCosts,
    errors: {},
    errorList: []
  });
});

// POST /claims/claiming-costs - Screen 28: Claiming costs
router.post('/claiming-costs', (req, res) => {
  const { claimingCosts, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/statement-of-express-terms');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!claimingCosts) {
    errors.claimingCosts = { text: 'Select yes if you want to ask for your costs back' };
    errorList.push({ text: 'Select yes if you want to ask for your costs back', href: '#claimingCosts' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/claiming-costs', {
      pageTitle: 'Claiming costs',
      claimingCosts: claimingCosts || null,
      errors,
      errorList
    });
  }

  // Store in session as object
  claimService.updateClaim(req.session, 'claimingCosts', { value: claimingCosts });

  // Redirect to next screen
  res.redirect('/claims/additional-reasons-for-possession');
});

// ============================================================================
// Screen 29: Additional Reasons for Possession
// ============================================================================
// GET /claims/additional-reasons-for-possession - Screen 29: Additional reasons for possession
router.get('/additional-reasons-for-possession', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const additionalReasons = claim.additionalReasons || {};
  const hasAdditionalReasons = additionalReasons.hasAdditionalReasons || null;
  const additionalReasonsText = additionalReasons.additionalReasonsText || null;

  res.render('pages/claims/additional-reasons-for-possession', {
    pageTitle: 'Additional reasons for possession',
    hasAdditionalReasons,
    additionalReasonsText,
    errors: {},
    errorList: []
  });
});

// POST /claims/additional-reasons-for-possession - Screen 29: Additional reasons for possession
router.post('/additional-reasons-for-possession', (req, res) => {
  const { hasAdditionalReasons, additionalReasonsText, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/claiming-costs');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!hasAdditionalReasons) {
    errors.hasAdditionalReasons = { text: 'Select yes if you have additional reasons for possession' };
    errorList.push({ text: 'Select yes if you have additional reasons for possession', href: '#hasAdditionalReasons' });
  }

  // Character limit validation
  if (additionalReasonsText && additionalReasonsText.length > 6400) {
    errors.additionalReasonsText = { text: 'Additional reasons must be 6400 characters or fewer' };
    errorList.push({ text: 'Additional reasons must be 6400 characters or fewer', href: '#additionalReasonsText' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/additional-reasons-for-possession', {
      pageTitle: 'Additional reasons for possession',
      hasAdditionalReasons: hasAdditionalReasons || null,
      additionalReasonsText: additionalReasonsText || null,
      errors,
      errorList
    });
  }

  // Store in session
  const additionalReasonsData = {
    hasAdditionalReasons,
    additionalReasonsText: additionalReasonsText || null
  };
  claimService.updateClaim(req.session, 'additionalReasons', additionalReasonsData);

  // Redirect to next screen
  res.redirect('/claims/underlessee-or-mortgagee');
});

// ============================================================================
// Screen 30: Underlessee or Mortgagee
// ============================================================================
// GET /claims/underlessee-or-mortgagee - Screen 30: Underlessee or mortgagee
router.get('/underlessee-or-mortgagee', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const underlesseeOrMortgageeData = claim.underlesseeOrMortgagee || {};
  const hasUnderlesseeOrMortgagee = underlesseeOrMortgageeData.hasUnderlesseeOrMortgagee || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/underlessee-or-mortgagee', {
    pageTitle: 'Underlessee or mortgagee entitled to claim relief against forfeiture',
    hasUnderlesseeOrMortgagee,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/underlessee-or-mortgagee - Screen 30: Underlessee or mortgagee
router.post('/underlessee-or-mortgagee', (req, res) => {
  const { hasUnderlesseeOrMortgagee, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/additional-reasons-for-possession');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!hasUnderlesseeOrMortgagee) {
    errors.hasUnderlesseeOrMortgagee = { text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture' };
    errorList.push({ text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture', href: '#hasUnderlesseeOrMortgagee' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const claim = claimService.getClaim(req.session) || {};
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/underlessee-or-mortgagee', {
      pageTitle: 'Underlessee or mortgagee entitled to claim relief against forfeiture',
      hasUnderlesseeOrMortgagee: hasUnderlesseeOrMortgagee || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session as object
  claimService.updateClaim(req.session, 'underlesseeOrMortgagee', { hasUnderlesseeOrMortgagee });

  // Redirect based on selection
  if (hasUnderlesseeOrMortgagee === 'yes') {
    res.redirect('/claims/underlessee-or-mortgagee-details');
  } else {
    // If No selected, skip Screen 31 and go to Screen 32
    res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
  }
});

// ============================================================================
// Screen 31: Underlessee or Mortgagee Details
// ============================================================================
// GET /claims/underlessee-or-mortgagee-details - Screen 31
router.get('/underlessee-or-mortgagee-details', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const details = claim.underlesseeOrMortgageeDetails || [];
  const currentEntry = details.length > 0 ? details[details.length - 1] : {};
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/underlessee-or-mortgagee-details', {
    pageTitle: 'Underlessee or mortgagee details',
    knowsName: currentEntry.knowsName || null,
    underlesseeName: currentEntry.name || null,
    knowsAddress: currentEntry.knowsAddress || null,
    address: currentEntry.address || {},
    hasAdditional: currentEntry.hasAdditional || null,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/underlessee-or-mortgagee-details - Screen 31
router.post('/underlessee-or-mortgagee-details', (req, res) => {
  const { knowsName, name, knowsAddress, buildingAndStreet, addressLine2, addressLine3,
          townOrCity, county, country, postcode, hasAdditional, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/underlessee-or-mortgagee');
  }

  // Handle Add New action
  if (action === 'addNew') {
    // Save current entry and add new empty entry
    const claim = claimService.getClaim(req.session) || {};
    const details = claim.underlesseeOrMortgageeDetails || [];

    const currentEntry = {
      knowsName: knowsName || null,
      name: knowsName === 'yes' ? name : null,
      knowsAddress: knowsAddress || null,
      address: knowsAddress === 'yes' ? {
        buildingAndStreet: buildingAndStreet || null,
        addressLine2: addressLine2 || null,
        addressLine3: addressLine3 || null,
        townOrCity: townOrCity || null,
        county: county || null,
        country: country || null,
        postcode: postcode || null
      } : null,
      hasAdditional: 'yes'
    };

    if (details.length > 0) {
      details[details.length - 1] = currentEntry;
    } else {
      details.push(currentEntry);
    }
    details.push({}); // Add new empty entry

    // Store array directly on claim
    const claimData = claimService.getClaim(req.session) || {};
    claimData.underlesseeOrMortgageeDetails = details;
    req.session.claimDraft = claimData;
    return res.redirect('/claims/underlessee-or-mortgagee-details');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  // Validate knowsName
  if (!knowsName) {
    errors.knowsName = { text: 'Select yes if you know the underlessee or mortgagee\'s name' };
    errorList.push({ text: 'Select yes if you know the underlessee or mortgagee\'s name', href: '#knowsName' });
  }

  // Validate name when knowsName is yes
  if (knowsName === 'yes' && (!name || name.trim() === '')) {
    errors.name = { text: 'Enter the underlessee or mortgagee\'s name' };
    errorList.push({ text: 'Enter the underlessee or mortgagee\'s name', href: '#name' });
  }

  // Validate knowsAddress
  if (!knowsAddress) {
    errors.knowsAddress = { text: 'Select yes if you know the underlessee or mortgagee\'s correspondence address' };
    errorList.push({ text: 'Select yes if you know the underlessee or mortgagee\'s correspondence address', href: '#knowsAddress' });
  }

  // Validate address fields when knowsAddress is yes
  if (knowsAddress === 'yes') {
    if (!buildingAndStreet || buildingAndStreet.trim() === '') {
      errors.buildingAndStreet = { text: 'Enter the building and street' };
      errorList.push({ text: 'Enter the building and street', href: '#buildingAndStreet' });
    }
    if (!townOrCity || townOrCity.trim() === '') {
      errors.townOrCity = { text: 'Enter the town or city' };
      errorList.push({ text: 'Enter the town or city', href: '#townOrCity' });
    }
    if (!postcode || postcode.trim() === '') {
      errors.postcode = { text: 'Enter the postcode' };
      errorList.push({ text: 'Enter the postcode', href: '#postcode' });
    }
  }

  // Validate hasAdditional
  if (!hasAdditional) {
    errors.hasAdditional = { text: 'Select yes if you need to add another underlessee or mortgagee' };
    errorList.push({ text: 'Select yes if you need to add another underlessee or mortgagee', href: '#hasAdditional' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const claim = claimService.getClaim(req.session) || {};
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/underlessee-or-mortgagee-details', {
      pageTitle: 'Underlessee or mortgagee details',
      knowsName,
      underlesseeName: name,
      knowsAddress,
      address: {
        buildingAndStreet,
        addressLine2,
        addressLine3,
        townOrCity,
        county,
        country,
        postcode
      },
      buildingAndStreet,
      addressLine2,
      addressLine3,
      townOrCity,
      county,
      country,
      postcode,
      hasAdditional,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  const claim = claimService.getClaim(req.session) || {};
  const details = claim.underlesseeOrMortgageeDetails || [];

  const currentEntry = {
    knowsName: knowsName,
    name: knowsName === 'yes' ? name : null,
    knowsAddress: knowsAddress,
    address: knowsAddress === 'yes' ? {
      buildingAndStreet: buildingAndStreet || null,
      addressLine2: addressLine2 || null,
      addressLine3: addressLine3 || null,
      townOrCity: townOrCity || null,
      county: county || null,
      country: country || null,
      postcode: postcode || null
    } : null,
    hasAdditional: hasAdditional
  };

  if (details.length > 0) {
    details[details.length - 1] = currentEntry;
  } else {
    details.push(currentEntry);
  }

  // Store array directly on claim (updateClaim uses spread which doesn't work for arrays)
  const claimData = claimService.getClaim(req.session) || {};
  claimData.underlesseeOrMortgageeDetails = details;
  req.session.claimDraft = claimData;

  // Redirect to Screen 32
  res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
});

// ============================================================================
// Screen 32: Underlessee Mortgagee Forfeiture Relief
// ============================================================================
// GET /claims/underlessee-mortgagee-forfeiture-relief - Screen 32
router.get('/underlessee-mortgagee-forfeiture-relief', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const forfeitureReliefData = claim.forfeitureRelief || {};
  const hasUnderlesseeOrMortgageeForRelief = forfeitureReliefData.hasUnderlesseeOrMortgageeForRelief || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/underlessee-mortgagee-forfeiture-relief', {
    pageTitle: 'Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture',
    hasUnderlesseeOrMortgageeForRelief,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/underlessee-mortgagee-forfeiture-relief - Screen 32
router.post('/underlessee-mortgagee-forfeiture-relief', (req, res) => {
  const { hasUnderlesseeOrMortgageeForRelief, action } = req.body;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action (dynamic based on journey path)
  if (action === 'previous') {
    const claim = claimService.getClaim(req.session) || {};
    const underlesseeOrMortgagee = claim.underlesseeOrMortgagee || {};

    // If user came via Screen 31 (selected Yes on Screen 30), go back to Screen 31
    if (underlesseeOrMortgagee.hasUnderlesseeOrMortgagee === 'yes') {
      return res.redirect('/claims/underlessee-or-mortgagee-details');
    }
    // Otherwise go back to Screen 30
    return res.redirect('/claims/underlessee-or-mortgagee');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!hasUnderlesseeOrMortgageeForRelief) {
    errors.hasUnderlesseeOrMortgageeForRelief = { text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture' };
    errorList.push({ text: 'Select yes if there is an underlessee or mortgagee entitled to claim relief against forfeiture', href: '#hasUnderlesseeOrMortgageeForRelief' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const claim = claimService.getClaim(req.session) || {};
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/underlessee-mortgagee-forfeiture-relief', {
      pageTitle: 'Indicate if there is an underlessee or mortgagee entitled to claim relief against forfeiture',
      hasUnderlesseeOrMortgageeForRelief: hasUnderlesseeOrMortgageeForRelief || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'forfeitureRelief', { hasUnderlesseeOrMortgageeForRelief });

  // Redirect based on selection
  if (hasUnderlesseeOrMortgageeForRelief === 'yes') {
    res.redirect('/claims/upload-additional-document');
  } else {
    res.redirect('/claims/applications');
  }
});

// ============================================================================
// Screen 33: Upload Additional Documents
// ============================================================================
// GET /claims/upload-additional-document - Screen 33
router.get('/upload-additional-document', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const documents = claim.uploadedDocuments || [];
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/upload-additional-document', {
    pageTitle: 'Upload additional documents',
    documents,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/upload-additional-document - Screen 33
router.post('/upload-additional-document', (req, res) => {
  const { action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Parse documents from form data
  let documents = [];
  if (req.body.documents) {
    if (Array.isArray(req.body.documents)) {
      documents = req.body.documents.map((doc, index) => ({
        id: `doc-${index}`,
        documentType: doc.documentType || null,
        fileName: doc.fileName || null,
        description: doc.description || null
      }));
    } else {
      // Single document case
      documents = [{
        id: 'doc-0',
        documentType: req.body.documents.documentType || req.body['documents[0][documentType]'] || null,
        fileName: null,
        description: req.body.documents.description || req.body['documents[0][description]'] || null
      }];
    }
  }

  // Handle indexed document fields (documents[0][documentType] format)
  const indexedDocs = {};
  for (const key of Object.keys(req.body)) {
    const match = key.match(/^documents\[(\d+)\]\[(\w+)\]$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2];
      if (!indexedDocs[index]) {
        indexedDocs[index] = { id: `doc-${index}` };
      }
      indexedDocs[index][field] = req.body[key] || null;
    }
  }

  if (Object.keys(indexedDocs).length > 0) {
    documents = Object.values(indexedDocs);
  }

  const caseNumber = claim.caseNumber || null;

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Helper function to save documents to session (arrays need direct assignment)
  const saveDocumentsToSession = (docs) => {
    const claimData = claimService.getClaim(req.session) || {};
    claimData.uploadedDocuments = docs;
    req.session.claimDraft = claimData;
  };

  // Handle Previous action
  if (action === 'previous') {
    // Save current documents before navigating
    saveDocumentsToSession(documents);
    return res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
  }

  // Handle Add New action
  if (action === 'addNew') {
    const docNumber = documents.length + 1;
    documents.push({
      id: `doc-${documents.length}`,
      documentType: null,
      fileName: `document-${docNumber}.pdf`,
      description: null
    });
    saveDocumentsToSession(documents);
    return res.status(200).render('pages/claims/upload-additional-document', {
      pageTitle: 'Upload additional documents',
      documents,
      caseNumber,
      errors: {},
      errorList: []
    });
  }

  // Handle Remove action
  if (action && action.startsWith('remove-')) {
    const indexToRemove = parseInt(action.replace('remove-', ''), 10);
    documents = documents.filter((_, index) => index !== indexToRemove);
    // Re-index documents
    documents = documents.map((doc, index) => ({
      ...doc,
      id: `doc-${index}`
    }));
    saveDocumentsToSession(documents);
    return res.status(200).render('pages/claims/upload-additional-document', {
      pageTitle: 'Upload additional documents',
      documents,
      caseNumber,
      errors: {},
      errorList: []
    });
  }

  // Handle Cancel Upload action
  if (action && action.startsWith('cancelUpload-')) {
    const indexToClear = parseInt(action.replace('cancelUpload-', ''), 10);
    if (documents[indexToClear]) {
      documents[indexToClear].fileName = null;
    }
    saveDocumentsToSession(documents);
    return res.status(200).render('pages/claims/upload-additional-document', {
      pageTitle: 'Upload additional documents',
      documents,
      caseNumber,
      errors: {},
      errorList: []
    });
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  // Check if at least one document is required
  const forfeitureRelief = claim.forfeitureRelief || {};
  const documentsRequired = forfeitureRelief.hasUnderlesseeOrMortgageeForRelief === 'yes';

  if (documentsRequired && documents.length === 0) {
    errorList.push({
      text: 'You must upload at least one document',
      href: '#documents'
    });
  }

  // Validate each document has a type
  documents.forEach((doc, index) => {
    if (!doc.documentType || doc.documentType === '') {
      const fieldKey = `documents[${index}][documentType]`;
      errors[fieldKey] = { text: 'Select the type of document' };
      errorList.push({
        text: 'Select the type of document',
        href: `#documents\\[${index}\\]\\[documentType\\]`
      });
    }
  });

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/upload-additional-document', {
      pageTitle: 'Upload additional documents',
      documents,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session (arrays need direct assignment)
  saveDocumentsToSession(documents);

  // Redirect to Screen 34
  res.redirect('/claims/applications');
});

// ============================================================================
// Screen 34: Applications
// ============================================================================
// GET /claims/applications - Screen 34
router.get('/applications', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const applicationsData = claim.applications || {};
  const planningApplication = applicationsData.planningApplication || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/applications', {
    pageTitle: 'Applications',
    planningApplication,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/applications - Screen 34
router.post('/applications', (req, res) => {
  const { planningApplication, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action (dynamic based on whether documents were uploaded)
  if (action === 'previous') {
    const uploadedDocuments = claim.uploadedDocuments || [];
    if (uploadedDocuments.length > 0) {
      // User uploaded documents - go back to Screen 33
      return res.redirect('/claims/upload-additional-document');
    } else {
      // User did not upload documents - go back to Screen 32
      return res.redirect('/claims/underlessee-mortgagee-forfeiture-relief');
    }
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!planningApplication) {
    errors.planningApplication = { text: 'Select yes if you are planning to make an application at the same time as your claim' };
    errorList.push({ text: 'Select yes if you are planning to make an application at the same time as your claim', href: '#planningApplication' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/applications', {
      pageTitle: 'Applications',
      planningApplication: planningApplication || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'applications', { planningApplication });

  // Redirect to Screen 35
  res.redirect('/claims/language-used');
});

// ============================================================================
// Screen 35: Language Used
// ============================================================================
// GET /claims/language-used - Screen 35
router.get('/language-used', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const languageUsedData = claim.languageUsed || {};
  const language = languageUsedData.language || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/language-used', {
    pageTitle: 'Language used',
    language,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/language-used - Screen 35
router.post('/language-used', (req, res) => {
  const { language, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/applications');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!language) {
    errors.language = { text: 'Select which language you used to complete this service' };
    errorList.push({ text: 'Select which language you used to complete this service', href: '#language' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/language-used', {
      pageTitle: 'Language used',
      language: language || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'languageUsed', { language });

  // Redirect to Screen 36
  res.redirect('/claims/completing-your-claim');
});

// ============================================================================
// Screen 36: Completing Your Claim
// ============================================================================
// GET /claims/completing-your-claim - Screen 36
router.get('/completing-your-claim', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const completionPreferenceData = claim.completionPreference || {};
  const completionPreference = completionPreferenceData.preference || null;
  const caseNumber = claim.caseNumber || null;

  res.render('pages/claims/completing-your-claim', {
    pageTitle: 'Completing your claim',
    completionPreference,
    caseNumber,
    errors: {},
    errorList: []
  });
});

// POST /claims/completing-your-claim - Screen 36
router.post('/completing-your-claim', (req, res) => {
  const { completionPreference, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/language-used');
  }

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  if (!completionPreference) {
    errors.completionPreference = { text: 'Select what you would like to do next' };
    errorList.push({ text: 'Select what you would like to do next', href: '#completionPreference' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    const caseNumber = claim.caseNumber || null;

    return res.status(200).render('pages/claims/completing-your-claim', {
      pageTitle: 'Completing your claim',
      completionPreference: completionPreference || null,
      caseNumber,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'completionPreference', { preference: completionPreference });

  // Redirect to Screen 37
  res.redirect('/claims/statement-of-truth');
});

// ============================================================================
// Screen 37: Statement of Truth
// ============================================================================
// GET /claims/statement-of-truth - Screen 37
router.get('/statement-of-truth', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const statementOfTruth = claim.statementOfTruth || {};
  const errors = req.session.errors || [];
  const values = req.session.values || {};

  // Clear flash data
  delete req.session.errors;
  delete req.session.values;

  // Transform errors to have 'text' property for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific errors
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = { text: error.message };
  });

  res.render('pages/claims/statement-of-truth', {
    pageTitle: 'Statement of truth',
    caseNumber: claim.caseNumber || '1234-5678-9101-1213',
    completedBy: statementOfTruth.completedBy || values.completedBy || null,
    errorList,
    errors: fieldErrors
  });
});

// POST /claims/statement-of-truth - Screen 37
router.post('/statement-of-truth', (req, res) => {
  const { completedBy, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Handle Cancel action
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Handle Previous action
  if (action === 'previous') {
    return res.redirect('/claims/completing-your-claim');
  }

  // Validation for Continue action
  const errors = claimService.validateStep('statement-of-truth', { completedBy });

  // If validation errors, re-render with errors
  if (errors.length > 0) {
    // Transform errors to have 'text' property for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific errors
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = { text: error.message };
    });

    return res.status(200).render('pages/claims/statement-of-truth', {
      pageTitle: 'Statement of truth',
      caseNumber: claim.caseNumber || '1234-5678-9101-1213',
      completedBy: completedBy || null,
      errorList,
      errors: fieldErrors
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'statementOfTruth', { completedBy });

  // Redirect to Screen 38
  res.redirect('/claims/check-your-answers');
});

// ============================================================================
// Screen 38: Check Your Answers
// ============================================================================
// GET /claims/check-your-answers
router.get('/check-your-answers', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};

  // Build property address string
  const propertyLocation = claim.propertyLocation || {};
  const propertyAddressParts = [
    propertyLocation.addressLine1,
    propertyLocation.addressLine2,
    propertyLocation.townOrCity,
    propertyLocation.county,
    propertyLocation.postcode
  ].filter(Boolean);
  const propertyAddress = propertyAddressParts.join('<br>') || 'Not provided';

  // Get defendant info
  const defendant = (claim.defendants && claim.defendants[0]) || {};
  const defendantName = defendant.firstName
    ? `${defendant.firstName}${defendant.lastName ? ' ' + defendant.lastName : ''}`
    : 'Not provided';

  // Get tenancy info
  const tenancy = claim.tenancy || {};
  const tenancyTypeMap = {
    'secure': 'Secure tenancy',
    'assured': 'Assured tenancy',
    'assured-shorthold': 'Assured shorthold tenancy',
    'demoted': 'Demoted tenancy',
    'introductory': 'Introductory tenancy',
    'flexible': 'Flexible tenancy',
    'licence': 'Licence'
  };
  const tenancyType = tenancyTypeMap[tenancy.tenancyType] || tenancy.tenancyType || 'Not provided';

  // Format tenancy start date
  let tenancyStartDate = 'Not provided';
  if (tenancy.startDateDay && tenancy.startDateMonth && tenancy.startDateYear) {
    tenancyStartDate = `${tenancy.startDateDay.toString().padStart(2, '0')}/${tenancy.startDateMonth.toString().padStart(2, '0')}/${tenancy.startDateYear}`;
  }

  // Get grounds for possession
  const grounds = claim.grounds || {};
  const groundsList = [];
  if (grounds.ground8) groundsList.push('Serious rent arrears (ground 8)');
  if (grounds.ground10) groundsList.push('Rent arrears (ground 10)');
  if (grounds.ground11) groundsList.push('Persistent delay in paying rent (ground 11)');
  if (grounds.ground12) groundsList.push('Breach of tenancy (ground 12)');
  const groundsText = groundsList.length > 0 ? groundsList.join(', ') : 'Not provided';

  // Get notice details
  const noticeOfIntention = claim.noticeOfIntention || {};
  const noticeDetails = claim.noticeDetails || {};
  const serviceMethodMap = {
    'first-class-post': 'First class post',
    'second-class-post': 'Second class post',
    'hand-delivery': 'Hand delivery',
    'email': 'Email'
  };
  const noticeServiceMethod = serviceMethodMap[noticeDetails.serviceMethod] || noticeDetails.serviceMethod || 'Not provided';

  // Format notice date
  let noticeDateFormatted = 'Not provided';
  if (noticeDetails.serviceDateDay && noticeDetails.serviceDateMonth && noticeDetails.serviceDateYear) {
    noticeDateFormatted = `${noticeDetails.serviceDateDay.toString().padStart(2, '0')}/${noticeDetails.serviceDateMonth.toString().padStart(2, '0')}/${noticeDetails.serviceDateYear}`;
  }

  // Get rent details
  const rentDetails = claim.rentDetails || {};
  const rentFrequencyMap = {
    'weekly': 'Weekly',
    'fortnightly': 'Fortnightly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'yearly': 'Yearly'
  };
  const rentFrequency = rentFrequencyMap[rentDetails.frequency] || rentDetails.frequency || 'Not provided';

  // Get rent arrears
  const rentArrears = claim.rentArrears || {};
  const paymentSources = rentArrears.paymentSources || {};
  const paymentSourcesList = [];
  if (paymentSources.universalCredit) paymentSourcesList.push('Universal Credit');
  if (paymentSources.housingBenefit) paymentSourcesList.push('Housing Benefit');
  if (paymentSources.discretionaryHousingPayment) paymentSourcesList.push('Discretionary Housing Payment');
  if (paymentSources.homelessPreventionFund) paymentSourcesList.push('Homeless prevention fund');
  if (paymentSources.other && paymentSources.otherDetails) paymentSourcesList.push(paymentSources.otherDetails);
  const paymentSourcesText = paymentSourcesList.length > 0 ? paymentSourcesList.join(', ') : 'Not provided';

  // Get rent statement documents
  const rentStatementDocs = rentArrears.documents || [];
  const rentStatementText = rentStatementDocs.length > 0
    ? rentStatementDocs.map(d => d.fileName).join(', ')
    : 'None uploaded';

  // Get other claim data
  const preActionProtocol = claim.preActionProtocol || {};
  const mediationSettlement = claim.mediationSettlement || {};
  const moneyJudgement = claim.moneyJudgement || {};
  const underlesseeOrMortgagee = claim.underlesseeOrMortgagee || {};
  const claimantCircumstances = claim.claimantCircumstances || {};
  const defendantCircumstances = claim.defendantCircumstances || {};
  const claimingCosts = claim.claimingCosts || {};
  const additionalReasons = claim.additionalReasons || {};
  const uploadedDocuments = claim.uploadedDocuments || [];
  const applications = claim.applications || {};
  const statementOfTruth = claim.statementOfTruth || {};
  const contactPreferences = claim.contactPreferences || {};

  // Claimant name
  const claimantName = claim.customClaimantName || claim.claimantName || 'Not provided';

  res.render('pages/claims/check-your-answers', {
    pageTitle: 'Check your answers',
    caseNumber: claim.caseNumber || '1234-5678-9101-1213',
    // Property
    propertyAddress,
    // Claimant
    claimantName,
    claimantType: claim.claimantType || 'Not provided',
    useRegisteredName: claim.useRegisteredName === 'yes' ? 'Yes' : (claim.useRegisteredName === 'no' ? 'No' : 'Not provided'),
    useEmailForNotifications: contactPreferences.useEmail === true ? 'Yes' : (contactPreferences.useEmail === false ? 'No' : 'Not provided'),
    useAddressForDocuments: contactPreferences.useAddress === true ? 'Yes' : (contactPreferences.useAddress === false ? 'No' : 'Not provided'),
    providePhone: contactPreferences.providePhone === true ? 'Yes' : (contactPreferences.providePhone === false ? 'No' : 'Not provided'),
    // Defendant
    claimType: claim.claimType || 'Not provided',
    defendantNameKnown: defendant.nameKnown === true ? 'Yes' : (defendant.nameKnown === false ? 'No' : 'Not provided'),
    defendantName,
    defendantAddressSame: defendant.addressSameAsProperty === true ? 'Yes' : (defendant.addressSameAsProperty === false ? 'No' : 'Not provided'),
    // Tenancy
    tenancyType,
    tenancyStartDate,
    tenancyDocumentUploaded: (tenancy.documents && tenancy.documents.length > 0) ? 'Yes' : 'No',
    // Grounds
    groundsText,
    hasAdditionalGrounds: grounds.hasAdditionalGrounds === true ? 'Yes' : 'No',
    // Pre-action protocol
    followedPreActionProtocol: preActionProtocol.followed === true ? 'Yes' : (preActionProtocol.followed === false ? 'No' : 'Not provided'),
    attemptedMediation: mediationSettlement.attemptedMediation === true ? 'Yes' : (mediationSettlement.attemptedMediation === false ? 'No' : 'Not provided'),
    attemptedSettlement: mediationSettlement.attemptedSettlement === true ? 'Yes' : (mediationSettlement.attemptedSettlement === false ? 'No' : 'Not provided'),
    // Notice
    noticeServed: noticeOfIntention.noticeServed === true ? 'Yes' : (noticeOfIntention.noticeServed === false ? 'No' : 'Not provided'),
    noticeServiceMethod,
    noticeDateFormatted,
    noticeDocumentUploaded: (noticeDetails.documents && noticeDetails.documents.length > 0) ? 'Yes' : 'No',
    // Rent
    rentAmount: rentDetails.amount ? rentDetails.amount.toString() : 'Not provided',
    rentFrequency,
    dailyRentConfirmed: rentDetails.dailyAmountConfirmed === true ? 'Yes' : (rentDetails.dailyAmountConfirmed === false ? 'No' : 'Not provided'),
    rentStatementText,
    totalArrears: rentArrears.totalArrears ? rentArrears.totalArrears.toLocaleString() : 'Not provided',
    thirdPartyPayments: rentArrears.thirdPartyPayments === true ? 'Yes' : (rentArrears.thirdPartyPayments === false ? 'No' : 'Not provided'),
    paymentSourcesText,
    // Money judgement
    moneyJudgementRequested: moneyJudgement.requested === true ? 'Yes' : (moneyJudgement.requested === false ? 'No' : 'Not provided'),
    // Underlessee/mortgagee
    hasUnderlesseeOrMortgagee: underlesseeOrMortgagee.hasUnderlesseeOrMortgagee === 'yes' ? 'Yes' : (underlesseeOrMortgagee.hasUnderlesseeOrMortgagee === 'no' ? 'No' : 'Not provided'),
    // Circumstances
    provideClaimantCircumstances: claimantCircumstances.provide === true ? 'Yes' : (claimantCircumstances.provide === false ? 'No' : 'Not provided'),
    provideDefendantCircumstances: defendantCircumstances.provide === true ? 'Yes' : (defendantCircumstances.provide === false ? 'No' : 'Not provided'),
    // Costs
    claimingCostsValue: claimingCosts.value === 'yes' ? 'Yes' : (claimingCosts.value === 'no' ? 'No' : 'Not provided'),
    // Additional reasons
    hasAdditionalReasons: additionalReasons.hasAdditionalReasons === true ? 'Yes' : (additionalReasons.hasAdditionalReasons === false ? 'No' : 'Not provided'),
    // Documents
    hasUploadedDocuments: uploadedDocuments.length > 0 ? 'Yes' : 'No',
    // Applications
    planningApplication: applications.planningApplication === 'yes' ? 'Yes' : (applications.planningApplication === 'no' ? 'No' : 'Not provided'),
    // Statement of truth
    statementCompletedBy: statementOfTruth.completedBy || 'Not provided'
  });
});

// POST /claims/check-your-answers
router.post('/check-your-answers', (req, res) => {
  const { action } = req.body;

  // Handle Previous
  if (action === 'previous') {
    return res.redirect('/claims/statement-of-truth');
  }

  // Handle Cancel
  if (action === 'cancel') {
    return res.redirect('/case-list');
  }

  // Default: Submit and pay - redirect to payment
  res.redirect('/claims/pay-claim-fee');
});

// ============================================================================
// Screen 39: Pay Claim Fee
// ============================================================================
// GET /claims/pay-claim-fee - Final screen: payment confirmation page
router.get('/pay-claim-fee', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};

  res.render('pages/claims/pay-claim-fee', {
    pageTitle: 'Pay claim fee',
    caseNumber: claim.caseNumber || '1234-5678-9101-1213'
  });
});

// ============================================================================
// Screen 26c: Housing Act (Demotion of tenancy)
// ============================================================================
// GET /claims/select-housing-act-demotion - Screen 26c: Housing Act selection for demotion
router.get('/select-housing-act-demotion', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const demotionOrder = claim.demotionOrder || {};

  res.render('pages/claims/select-housing-act-demotion', {
    pageTitle: 'Housing Act',
    selectedHousingAct: demotionOrder.housingAct || null,
    errorList: [],
    errors: {}
  });
});

// POST /claims/select-housing-act-demotion - Screen 26c: Housing Act selection for demotion
router.post('/select-housing-act-demotion', (req, res) => {
  const { demotionHousingAct } = req.body;

  // Validate Housing Act selection
  const errors = [];
  if (!demotionHousingAct) {
    errors.push({
      field: 'demotionHousingAct',
      text: 'Select the Housing Act',
      href: '#demotionHousingAct'
    });
  }

  if (errors.length > 0) {
    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = { text: error.text };
    });

    return res.render('pages/claims/select-housing-act-demotion', {
      pageTitle: 'Housing Act',
      selectedHousingAct: demotionHousingAct || null,
      errorList: errors,
      errors: fieldErrors
    });
  }

  // Save selection to session
  const demotionOrder = {
    housingAct: demotionHousingAct
  };
  claimService.updateClaim(req.session, 'demotionOrder', demotionOrder);

  // Navigate to next screen (Screen 26d)
  res.redirect('/claims/statement-of-express-terms');
});

// ============================================================================
// Screen 26d: Statement of Express Terms
// ============================================================================
// GET /claims/statement-of-express-terms - Screen 26d: Statement of express terms
router.get('/statement-of-express-terms', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const demotionOrder = claim.demotionOrder || {};

  res.render('pages/claims/statement-of-express-terms', {
    pageTitle: 'Statement of express terms',
    selectedExpressTerms: demotionOrder.statementOfExpressTerms || null,
    expressTermsDetails: demotionOrder.statementOfExpressTermsDetails || '',
    errorList: [],
    errors: {}
  });
});

// POST /claims/statement-of-express-terms - Screen 26d: Statement of express terms
router.post('/statement-of-express-terms', (req, res) => {
  const { statementOfExpressTerms, statementOfExpressTermsDetails } = req.body;

  // Validate required field
  const errors = [];
  if (!statementOfExpressTerms) {
    errors.push({
      text: 'Select yes if you have served the statement of express terms',
      href: '#statementOfExpressTerms',
      field: 'statementOfExpressTerms'
    });
  }

  if (errors.length > 0) {
    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = { text: error.text };
    });

    return res.render('pages/claims/statement-of-express-terms', {
      pageTitle: 'Statement of express terms',
      selectedExpressTerms: statementOfExpressTerms || null,
      expressTermsDetails: statementOfExpressTermsDetails || '',
      errorList: errors,
      errors: fieldErrors
    });
  }

  // Save selection to session
  const claim = claimService.getClaim(req.session) || {};
  const demotionOrder = claim.demotionOrder || {};

  demotionOrder.statementOfExpressTerms = statementOfExpressTerms;
  demotionOrder.statementOfExpressTerms = statementOfExpressTerms === 'yes' ? (statementOfExpressTermsDetails || null) : null;

  claimService.updateClaim(req.session, 'demotionOrder', demotionOrder);

  // Navigate to next screen (Screen 28: Claiming costs)
  res.redirect('/claims/claiming-costs');
});

// GET /claims/preaction-protocol - Screen 16: Pre-action protocol
router.get('/preaction-protocol', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved pre-action protocol selection
  const preActionProtocol = claim.preActionProtocol || {};
  const followed = preActionProtocol.followed;

  res.render('pages/claims/preaction-protocol', {
    pageTitle: 'Pre-action protocol',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      followed: followed === true ? 'true' : followed === false ? 'false' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/preaction-protocol - Screen 16: Pre-action protocol
router.post('/preaction-protocol', (req, res) => {
  const { followed } = req.body;

  const errors = [];

  // Validate followed selection
  if (!followed) {
    errors.push({
      field: 'followed',
      message: 'Select whether you have followed the pre-action protocol',
      href: '#followed',
    });
  }

  if (errors.length > 0) {
    // Build error list for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = error.message;
    });

    return res.status(400).render('pages/claims/preaction-protocol', {
      pageTitle: 'Pre-action protocol',
      errors: errors,
      errorList: errorList,
      fieldErrors: fieldErrors,
      values: {
        followed: followed || ''
      },
    });
  }

  // Store pre-action protocol as boolean
  const preActionProtocol = {
    followed: followed === 'true'
  };

  claimService.updateClaim(req.session, 'preActionProtocol', preActionProtocol);

  // Both paths redirect to mediation-settlement
  res.redirect('/claims/mediation-settlement');
});

// GET /claims/mediation-settlement - Screen 17: Mediation and settlement
router.get('/mediation-settlement', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved mediation/settlement data
  const mediationSettlement = claim.mediationSettlement || {};

  res.render('pages/claims/mediation-settlement', {
    pageTitle: 'Mediation and settlement',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      mediationAttempted: mediationSettlement.mediationAttempted === true ? 'true' : mediationSettlement.mediationAttempted === false ? 'false' : '',
      mediationDetails: mediationSettlement.mediationDetails || '',
      settlementAttempted: mediationSettlement.settlementAttempted === true ? 'true' : mediationSettlement.settlementAttempted === false ? 'false' : '',
      settlementDetails: mediationSettlement.settlementDetails || ''
    },
  });

  delete req.session.errors;
});

// POST /claims/mediation-settlement - Screen 17: Mediation and settlement
router.post('/mediation-settlement', (req, res) => {
  const { mediationAttempted, mediationDetails, settlementAttempted, settlementDetails } = req.body;

  const errors = [];

  // Validate mediationAttempted selection (required)
  if (!mediationAttempted) {
    errors.push({
      field: 'mediationAttempted',
      message: 'Select whether you have attempted mediation',
      href: '#mediationAttempted',
    });
  }

  // Validate settlementAttempted selection (required)
  if (!settlementAttempted) {
    errors.push({
      field: 'settlementAttempted',
      message: 'Select whether you have tried to reach a settlement',
      href: '#settlementAttempted',
    });
  }

  // Validate mediation details character limit (only if Yes selected)
  if (mediationAttempted === 'true' && mediationDetails && mediationDetails.length > 250) {
    errors.push({
      field: 'mediationDetails',
      message: 'Enter 250 characters or fewer',
      href: '#mediationDetails',
    });
  }

  // Validate settlement details character limit (only if Yes selected)
  if (settlementAttempted === 'true' && settlementDetails && settlementDetails.length > 250) {
    errors.push({
      field: 'settlementDetails',
      message: 'Enter 250 characters or fewer',
      href: '#settlementDetails',
    });
  }

  if (errors.length > 0) {
    // Build error list for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = error.message;
    });

    return res.status(400).render('pages/claims/mediation-settlement', {
      pageTitle: 'Mediation and settlement',
      errors: errors,
      errorList: errorList,
      fieldErrors: fieldErrors,
      values: {
        mediationAttempted: mediationAttempted || '',
        mediationDetails: mediationDetails || '',
        settlementAttempted: settlementAttempted || '',
        settlementDetails: settlementDetails || ''
      },
    });
  }

  // Build mediation settlement object with data clearing logic
  const mediationSettlementData = {
    mediationAttempted: mediationAttempted === 'true',
    // Clear details if No selected, otherwise store the value
    mediationDetails: mediationAttempted === 'true' ? (mediationDetails || null) : null,
    settlementAttempted: settlementAttempted === 'true',
    // Clear details if No selected, otherwise store the value
    settlementDetails: settlementAttempted === 'true' ? (settlementDetails || null) : null
  };

  claimService.updateClaim(req.session, 'mediationSettlement', mediationSettlementData);

  res.redirect('/claims/notice-of-intention');
});

// GET /claims/notice-of-intention - Screen 18: Notice of intention
router.get('/notice-of-intention', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Get saved notice served selection
  const noticeOfIntention = claim.noticeOfIntention || {};
  const noticeServed = noticeOfIntention.noticeServed;

  res.render('pages/claims/notice-of-intention', {
    pageTitle: 'Notice of your intention to seek possession',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      noticeServed: noticeServed === true ? 'true' : noticeServed === false ? 'false' : ''
    },
  });

  delete req.session.errors;
});

// POST /claims/notice-of-intention - Screen 18: Notice of intention
router.post('/notice-of-intention', (req, res) => {
  const { noticeServed } = req.body;

  const errors = [];

  // Validate noticeServed selection
  if (!noticeServed) {
    errors.push({
      field: 'noticeServed',
      message: 'Select whether you have served notice to the defendants',
      href: '#noticeServed',
    });
  }

  if (errors.length > 0) {
    // Build error list for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = error.message;
    });

    return res.status(400).render('pages/claims/notice-of-intention', {
      pageTitle: 'Notice of your intention to seek possession',
      errors: errors,
      errorList: errorList,
      fieldErrors: fieldErrors,
      values: {
        noticeServed: noticeServed || ''
      },
    });
  }

  // Store notice of intention as boolean
  const noticeOfIntention = {
    noticeServed: noticeServed === 'true'
  };

  claimService.updateClaim(req.session, 'noticeOfIntention', noticeOfIntention);

  // If notice served, collect details; otherwise skip to rent details
  if (noticeServed === 'true') {
    res.redirect('/claims/notice-details');
  } else {
    res.redirect('/claims/rent-details');
  }
});

// GET /claims/notice-details - Screen 19: Notice details
router.get('/notice-details', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const errors = req.session.errors || [];

  // Build error list for error summary
  const errorList = errors.map(error => ({
    text: error.message,
    href: error.href
  }));

  // Build field-specific error messages
  const fieldErrors = {};
  errors.forEach(error => {
    fieldErrors[error.field] = error.message;
  });

  // Initialize noticeDetails if needed
  if (!claim.noticeDetails) {
    claim.noticeDetails = { documents: [] };
    claimService.updateClaim(req.session, 'noticeDetails', claim.noticeDetails);
  }

  const noticeDetails = claim.noticeDetails || {};

  res.render('pages/claims/notice-details', {
    pageTitle: 'Notice details',
    errors: errors,
    errorList: errorList,
    fieldErrors: fieldErrors,
    values: {
      serviceMethod: noticeDetails.serviceMethod || ''
    },
    documents: noticeDetails.documents || []
  });

  delete req.session.errors;
});

// POST /claims/notice-details - Screen 19: Notice details
router.post('/notice-details', (req, res) => {
  const { serviceMethod, uploadDocument } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  const errors = [];

  // AC-2: Validate serviceMethod selection (required)
  if (!serviceMethod) {
    errors.push({
      field: 'serviceMethod',
      message: 'Select how you served the notice',
      href: '#serviceMethod',
    });
  }

  // Validate inline upload document if provided (fallback for non-JS scenario)
  if (uploadDocument && uploadDocument.name) {
    if (!isValidFileType(uploadDocument.name)) {
      errors.push({
        field: 'upload',
        message: 'The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG',
        href: '#upload',
      });
    } else if (uploadDocument.size && !isValidFileSize(uploadDocument.size)) {
      errors.push({
        field: 'upload',
        message: 'The selected file must be smaller than 10MB',
        href: '#upload',
      });
    }
  }

  if (errors.length > 0) {
    // Build error list for error summary
    const errorList = errors.map(error => ({
      text: error.message,
      href: error.href
    }));

    // Build field-specific error messages
    const fieldErrors = {};
    errors.forEach(error => {
      fieldErrors[error.field] = error.message;
    });

    const noticeDetails = claim.noticeDetails || { documents: [] };

    return res.status(400).render('pages/claims/notice-details', {
      pageTitle: 'Notice details',
      errors: errors,
      errorList: errorList,
      fieldErrors: fieldErrors,
      values: {
        serviceMethod: serviceMethod || ''
      },
      documents: noticeDetails.documents || []
    });
  }

  // Initialize noticeDetails if needed, preserving existing documents
  const existingNoticeDetails = claim.noticeDetails || { documents: [] };

  // AC-8: Store service method
  const noticeDetails = {
    serviceMethod: serviceMethod,
    documents: existingNoticeDetails.documents || []
  };

  claimService.updateClaim(req.session, 'noticeDetails', noticeDetails);

  // AC-10: Redirect to rent-details
  res.redirect('/claims/rent-details');
});

// Helper: Validate file type (Q2)
function isValidFileType(filename) {
  if (!filename) return false;
  const ext = filename.toLowerCase().split('.').pop();
  return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'].includes(ext);
}

// Helper: Validate file size (Q2 - 10MB max)
function isValidFileSize(size) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return size <= MAX_SIZE;
}

// POST /claims/notice-details/upload - Simulated upload endpoint (AC-5, Q1)
router.post('/notice-details/upload', (req, res) => {
  const { document } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Initialize noticeDetails if needed
  if (!claim.noticeDetails) {
    claim.noticeDetails = { documents: [] };
  }

  const errors = {};

  // Validation: File type (Q2)
  if (!isValidFileType(document.name)) {
    errors.upload = {
      text: 'The selected file must be a PDF, DOC, DOCX, JPG, JPEG or PNG'
    };
  }

  // Validation: File size (Q2)
  if (!errors.upload && !isValidFileSize(document.size)) {
    errors.upload = {
      text: 'The selected file must be smaller than 10MB'
    };
  }

  // Validation: Max 10 documents (Q3)
  if (!errors.upload && claim.noticeDetails.documents.length >= 10) {
    errors.upload = {
      text: 'You can only upload a maximum of 10 documents'
    };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Store metadata only (Q1) - AC-5
  claim.noticeDetails.documents.push({
    id: document.id,
    name: document.name,
    uploadedAt: document.uploadedAt,
    size: document.size
  });

  claimService.updateClaim(req.session, 'noticeDetails', claim.noticeDetails);

  res.json({ success: true, document });
});

// POST /claims/notice-details/remove - Remove document (Q3)
router.post('/notice-details/remove', (req, res) => {
  const { documentId } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  if (claim.noticeDetails && claim.noticeDetails.documents) {
    claim.noticeDetails.documents = claim.noticeDetails.documents.filter(
      doc => doc.id !== documentId
    );
    claimService.updateClaim(req.session, 'noticeDetails', claim.noticeDetails);
  }

  res.json({ success: true });
});

// Helper: Validate rent amount (Screen 20)
function validateRentAmount(amount) {
  if (!amount || amount.trim() === '') {
    return 'Enter the rent amount as a number greater than 0';
  }

  const trimmedAmount = amount.trim();

  // Check for valid numeric format (max 2 decimal places)
  if (!/^\d+(\.\d{1,2})?$/.test(trimmedAmount)) {
    return 'Enter the rent amount as a number greater than 0';
  }

  const numValue = parseFloat(trimmedAmount);

  // Must be positive and not exceed maximum
  if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
    return 'Enter the rent amount as a number greater than 0';
  }

  return null;
}

// Helper: Validate rent frequency (Screen 20)
function validateRentFrequency(frequency) {
  const validFrequencies = ['weekly', 'fortnightly', 'monthly', 'other'];
  if (!frequency || !validFrequencies.includes(frequency)) {
    return 'Select how often rent should be paid';
  }
  return null;
}

// Helper: Calculate daily rent (Screen 20)
function calculateDailyRent(amount, frequency) {
  const numAmount = parseFloat(amount);
  let dailyAmount = null;

  switch (frequency) {
    case 'weekly':
      dailyAmount = (numAmount / 7).toFixed(2);
      break;
    case 'fortnightly':
      dailyAmount = (numAmount / 14).toFixed(2);
      break;
    case 'monthly':
      dailyAmount = (numAmount / 365 * 12).toFixed(2);
      break;
    case 'other':
      dailyAmount = null;
      break;
  }

  return dailyAmount !== null ? parseFloat(dailyAmount) : null;
}

// GET /claims/rent-details - Screen 20: Rent details
router.get('/rent-details', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const rentDetails = claim.rentDetails || {};

  res.render('pages/claims/rent-details', {
    pageTitle: 'Rent details',
    amount: rentDetails.amount !== undefined ? rentDetails.amount : '',
    frequency: rentDetails.frequency || '',
    errors: {},
    errorList: []
  });
});

// POST /claims/rent-details - Screen 20: Rent details
router.post('/rent-details', (req, res) => {
  const { amount, frequency } = req.body;
  const errors = {};

  // Validate amount
  const amountError = validateRentAmount(amount);
  if (amountError) {
    errors.amount = { text: amountError };
  }

  // Validate frequency
  const frequencyError = validateRentFrequency(frequency);
  if (frequencyError) {
    errors.frequency = { text: frequencyError };
  }

  // If validation errors, re-render with errors
  if (Object.keys(errors).length > 0) {
    const errorList = Object.entries(errors).map(([field, error]) => ({
      text: error.text,
      href: `#${field}`
    }));

    return res.status(400).render('pages/claims/rent-details', {
      pageTitle: 'Rent details',
      amount: amount || '',
      frequency: frequency || '',
      errors,
      errorList
    });
  }

  // Calculate daily rent
  const calculatedDailyAmount = calculateDailyRent(amount, frequency);

  // Store in session
  const rentDetails = {
    amount: parseFloat(amount),
    frequency: frequency,
    calculatedDailyAmount: calculatedDailyAmount
  };

  claimService.updateClaim(req.session, 'rentDetails', rentDetails);

  // Conditional routing based on frequency
  if (frequency === 'weekly' || frequency === 'fortnightly' || frequency === 'monthly') {
    res.redirect('/claims/daily-rent-amount');
  } else {
    res.redirect('/claims/details-of-rent-arrears');
  }
});

// Helper: Validate manual daily rent amount (Screen 21)
function validateManualDailyAmount(amount) {
  if (!amount || amount.trim() === '') {
    return 'Enter the daily rent amount as a number greater than 0';
  }

  const trimmed = amount.trim();

  // Check format - max 2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return 'Enter the daily rent amount as a number greater than 0';
  }

  const numValue = parseFloat(trimmed);

  // Must be positive and not exceed maximum
  if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
    return 'Enter the daily rent amount as a number greater than 0';
  }

  return null;
}

// GET /claims/daily-rent-amount - Screen 21: Daily rent amount confirmation
router.get('/daily-rent-amount', (req, res) => {
  const claim = claimService.getClaim(req.session);
  const rentDetails = claim?.rentDetails || {};

  // Redirect back if no calculated amount available
  if (!rentDetails.calculatedDailyAmount) {
    return res.redirect('/claims/rent-details');
  }

  // Pre-populate from session on revisit
  let confirmation;
  if (rentDetails.dailyAmountConfirmed === true) {
    confirmation = 'yes';
  } else if (rentDetails.dailyAmountConfirmed === false) {
    confirmation = 'no';
  }

  // Get manual amount if previously entered (dailyAmountConfirmed === false)
  const manualDailyAmount = (rentDetails.dailyAmountConfirmed === false && rentDetails.dailyAmount)
    ? rentDetails.dailyAmount
    : '';

  res.render('pages/claims/daily-rent-amount', {
    pageTitle: 'Daily rent amount',
    calculatedDailyAmount: rentDetails.calculatedDailyAmount,
    confirmation,
    manualDailyAmount,
    errors: {},
    errorList: []
  });
});

// POST /claims/daily-rent-amount - Screen 21: Daily rent amount confirmation
router.post('/daily-rent-amount', (req, res) => {
  const { confirmation, manualDailyAmount } = req.body;
  const claim = claimService.getClaim(req.session);
  const rentDetails = claim?.rentDetails || {};
  const errors = {};
  const errorList = [];

  // Validation: Radio selection required
  if (!confirmation) {
    errors.confirmation = { text: 'Select whether the daily rent amount is correct' };
    errorList.push({ text: 'Select whether the daily rent amount is correct', href: '#confirmation' });
  }

  // Validation: Manual entry when "No" selected
  if (confirmation === 'no') {
    const amountError = validateManualDailyAmount(manualDailyAmount);
    if (amountError) {
      errors.manualDailyAmount = { text: amountError };
      errorList.push({ text: amountError, href: '#manualDailyAmount' });
    }
  }

  // If errors, re-render with preserved values
  if (errorList.length > 0) {
    return res.status(400).render('pages/claims/daily-rent-amount', {
      pageTitle: 'Daily rent amount',
      calculatedDailyAmount: rentDetails.calculatedDailyAmount,
      confirmation,
      manualDailyAmount: manualDailyAmount || '',
      errors,
      errorList
    });
  }

  // Store in session based on confirmation choice
  if (confirmation === 'yes') {
    rentDetails.dailyAmount = rentDetails.calculatedDailyAmount;
    rentDetails.dailyAmountConfirmed = true;
  } else {
    rentDetails.dailyAmount = parseFloat(manualDailyAmount);
    rentDetails.dailyAmountConfirmed = false;
  }

  claimService.updateClaim(req.session, 'rentDetails', rentDetails);

  // Redirect to next screen
  res.redirect('/claims/details-of-rent-arrears');
});

// GET /claims/details-of-rent-arrears - Screen 22: Details of rent arrears
router.get('/details-of-rent-arrears', (req, res) => {
  const claim = claimService.getClaim(req.session) || {};
  const rentArrears = claim.rentArrears || {};
  const paymentSources = rentArrears.paymentSources || {};

  // Format totalArrears to always show 2 decimal places if it's a number
  let formattedTotalArrears = '';
  if (rentArrears.totalArrears !== undefined && rentArrears.totalArrears !== null) {
    formattedTotalArrears = Number(rentArrears.totalArrears).toFixed(2);
  }

  res.render('pages/claims/details-of-rent-arrears', {
    pageTitle: 'Details of rent arrears',
    // Pre-populate from session
    totalArrears: formattedTotalArrears,
    thirdPartyPayments: rentArrears.thirdPartyPayments === true ? 'yes' : (rentArrears.thirdPartyPayments === false ? 'no' : ''),
    // Payment sources
    universalCredit: paymentSources.universalCredit || false,
    housingBenefit: paymentSources.housingBenefit || false,
    discretionaryHousingPayment: paymentSources.discretionaryHousingPayment || false,
    homelessPreventionFund: paymentSources.homelessPreventionFund || false,
    other: paymentSources.other || false,
    otherPaymentSource: paymentSources.otherDetails || '',
    // Documents (for future use)
    documents: rentArrears.documents || [],
    errors: {},
    errorList: []
  });
});

// POST /claims/details-of-rent-arrears - Screen 22: Details of rent arrears
router.post('/details-of-rent-arrears', (req, res) => {
  const { totalArrears, thirdPartyPayments, paymentSources, otherPaymentSource, action } = req.body;
  const claim = claimService.getClaim(req.session) || {};

  // Get existing documents
  let documents = claim.rentArrears?.documents || [];

  // Handle document actions (addNew, remove)
  if (action === 'addNew') {
    // Add a mock document
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    documents = [...documents, {
      fileName: `rent-statement-${documents.length + 1}.pdf`,
      uploadedAt: formattedDate
    }];
    // Save and re-render
    claimService.updateClaim(req.session, 'rentArrears', {
      ...claim.rentArrears,
      documents
    });
    return res.redirect('/claims/details-of-rent-arrears');
  }

  if (action && action.startsWith('remove-')) {
    const indexToRemove = parseInt(action.replace('remove-', ''), 10);
    if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < documents.length) {
      documents = documents.filter((_, i) => i !== indexToRemove);
      claimService.updateClaim(req.session, 'rentArrears', {
        ...claim.rentArrears,
        documents
      });
    }
    return res.redirect('/claims/details-of-rent-arrears');
  }

  // Convert payment sources array to object
  const sourcesArray = Array.isArray(paymentSources) ? paymentSources : (paymentSources ? [paymentSources] : []);
  const paymentSourcesObj = {
    universalCredit: sourcesArray.includes('universalCredit'),
    housingBenefit: sourcesArray.includes('housingBenefit'),
    discretionaryHousingPayment: sourcesArray.includes('discretionaryHousingPayment'),
    homelessPreventionFund: sourcesArray.includes('homelessPreventionFund'),
    other: sourcesArray.includes('other'),
    otherDetails: sourcesArray.includes('other') ? (otherPaymentSource || null) : null
  };

  // Build rent arrears object
  const rentArrears = {
    documents: documents,
    totalArrears: totalArrears ? parseFloat(totalArrears) : null,
    thirdPartyPayments: thirdPartyPayments === 'yes' ? true : (thirdPartyPayments === 'no' ? false : null),
    paymentSources: paymentSourcesObj
  };

  // Validation for Continue action
  const errors = {};
  const errorList = [];

  // AC-6: Validate total arrears
  if (!totalArrears || totalArrears.trim() === '') {
    errors.totalArrears = { text: 'Enter the total rent arrears as a number greater than 0' };
    errorList.push({ text: 'Enter the total rent arrears as a number greater than 0', href: '#totalArrears' });
  } else {
    const amount = parseFloat(totalArrears);
    if (isNaN(amount)) {
      errors.totalArrears = { text: 'Enter the total rent arrears as a number greater than 0' };
      errorList.push({ text: 'Enter the total rent arrears as a number greater than 0', href: '#totalArrears' });
    } else if (amount <= 0) {
      errors.totalArrears = { text: 'Enter the total rent arrears as a number greater than 0' };
      errorList.push({ text: 'Enter the total rent arrears as a number greater than 0', href: '#totalArrears' });
    } else if (amount > 1000000) {
      errors.totalArrears = { text: 'Enter the total rent arrears as a number greater than 0' };
      errorList.push({ text: 'Enter the total rent arrears as a number greater than 0', href: '#totalArrears' });
    } else {
      // Check decimal places
      const decimalPart = totalArrears.split('.')[1];
      if (decimalPart && decimalPart.length > 2) {
        errors.totalArrears = { text: 'Enter the total rent arrears as a number greater than 0' };
        errorList.push({ text: 'Enter the total rent arrears as a number greater than 0', href: '#totalArrears' });
      }
    }
  }

  // AC-8: Validate third-party payments selection
  if (!thirdPartyPayments) {
    errors.thirdPartyPayments = { text: 'Select whether any rent payments were made by someone other than the defendants' };
    errorList.push({ text: 'Select whether any rent payments were made by someone other than the defendants', href: '#thirdPartyPayments' });
  }

  // AC-10: Validate payment sources (only if Yes selected)
  if (thirdPartyPayments === 'yes') {
    const hasAnySource = sourcesArray.length > 0;
    if (!hasAnySource) {
      errors.paymentSources = { text: 'Select at least one payment source' };
      errorList.push({ text: 'Select at least one payment source', href: '#paymentSources' });
    }
  }

  // AC-12: Validate other details (only if Other selected)
  if (sourcesArray.includes('other') && (!otherPaymentSource || otherPaymentSource.trim() === '')) {
    errors.otherPaymentSource = { text: 'Enter the payment source' };
    errorList.push({ text: 'Enter the payment source', href: '#otherPaymentSource' });
  }

  // If validation errors, re-render with errors
  if (errorList.length > 0) {
    return res.status(200).render('pages/claims/details-of-rent-arrears', {
      pageTitle: 'Details of rent arrears',
      totalArrears: totalArrears || '',
      thirdPartyPayments: thirdPartyPayments || '',
      universalCredit: paymentSourcesObj.universalCredit,
      housingBenefit: paymentSourcesObj.housingBenefit,
      discretionaryHousingPayment: paymentSourcesObj.discretionaryHousingPayment,
      homelessPreventionFund: paymentSourcesObj.homelessPreventionFund,
      other: paymentSourcesObj.other,
      otherPaymentSource: otherPaymentSource || '',
      documents: documents,
      errors,
      errorList
    });
  }

  // Store in session
  claimService.updateClaim(req.session, 'rentArrears', rentArrears);

  // Redirect to next screen
  res.redirect('/claims/money-judgement');
});

// GET /claims/grounds-for-possession - Screen 14.1: General grounds selection (placeholder)
router.get('/grounds-for-possession', (req, res) => {
  res.render('pages/claims/grounds-general', {
    pageTitle: 'Grounds for possession',
  });
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

// GET /claims/claimant-ineligible-welsh
router.get('/claimant-ineligible-welsh', (req, res) => {
  // No session writes, just render the template
  res.render('pages/claims/claimant-ineligible-welsh', {
    pageTitle: 'You are not eligible to use the England possession claim service',
    showBackLink: false
  });
});

module.exports = router;
