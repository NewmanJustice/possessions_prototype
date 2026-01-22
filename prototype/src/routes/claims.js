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
  const { propertyLocation } = req.body;
  const errors = [];

  // Validate property location selection
  if (!propertyLocation) {
    errors.push({
      field: 'propertyLocation',
      message: 'Select whether the property is in England or Wales',
      href: '#propertyLocation',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/claims/border-postcode');
  }

  // Store property location in claim
  claimService.updateClaim(req.session, 'propertyLocation', propertyLocation);
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

  // Route based on claimant type
  if (claimantType === 'registered-provider') {
    res.redirect('/claims/claim-type');
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

  claimService.updateClaim(req.session, 'tenancy', tenancy);
  res.redirect('/claims/grounds');
});

// POST /claims/tenancy/remove-document
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

// GET /claims/grounds - Screen 13.1: Rent arrears branch point
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
