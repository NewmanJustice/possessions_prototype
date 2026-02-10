/**
 * Claim Service
 * Handles creation, update, validation, and submission of possession claims
 */

/**
 * Initialize a new claim draft in session
 * @param {object} session - Express session object
 */
function initializeClaim(session) {
  if (!session.claimDraft) {
    session.claimDraft = {
      claimType: null,
      property: {},
      claimant: {},
      defendant: {},
      grounds: [],
      keyDates: {},
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return session.claimDraft;
}

/**
 * Get the current claim draft
 * @param {object} session - Express session object
 */
function getClaim(session) {
  return session.claimDraft || null;
}

/**
 * Update claim draft with new data
 * @param {object} session - Express session object
 * @param {string} section - Section to update (e.g., 'property', 'claimant')
 * @param {object} data - Data to merge into the section
 */
function updateClaim(session, section, data) {
  const claim = initializeClaim(session);

  // Handle primitive values (strings, booleans, numbers) directly
  // Only merge objects when data is a plain object
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    claim[section] = { ...claim[section], ...data };
  } else {
    claim[section] = data;
  }

  claim.updatedAt = new Date().toISOString();
  session.claimDraft = claim;

  return claim;
}

/**
 * Validate claim data for a specific step
 * @param {string} step - The step to validate
 * @param {object} data - Data to validate
 * @returns {array} Array of error objects
 */
function validateStep(step, data) {
  const errors = [];

  switch (step) {
    case 'claimType':
      if (!data.claimType) {
        errors.push({
          field: 'claimType',
          message: 'Select the type of claim',
          href: '#claimType',
        });
      }
      break;

    case 'property':
      if (!data.addressLine1 || data.addressLine1.trim() === '') {
        errors.push({
          field: 'addressLine1',
          message: 'Enter address line 1',
          href: '#addressLine1',
        });
      }
      if (!data.town || data.town.trim() === '') {
        errors.push({
          field: 'town',
          message: 'Enter town or city',
          href: '#town',
        });
      }
      if (!data.postcode || data.postcode.trim() === '') {
        errors.push({
          field: 'postcode',
          message: 'Enter postcode',
          href: '#postcode',
        });
      }
      break;

    case 'claimant':
      if (!data.organisationName || data.organisationName.trim() === '') {
        errors.push({
          field: 'organisationName',
          message: 'Enter organisation name',
          href: '#organisationName',
        });
      }
      if (!data.reference || data.reference.trim() === '') {
        errors.push({
          field: 'reference',
          message: 'Enter your reference',
          href: '#reference',
        });
      }
      if (!data.contactName || data.contactName.trim() === '') {
        errors.push({
          field: 'contactName',
          message: 'Enter contact name',
          href: '#contactName',
        });
      }
      if (!data.email || data.email.trim() === '') {
        errors.push({
          field: 'email',
          message: 'Enter email address',
          href: '#email',
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push({
          field: 'email',
          message: 'Enter an email address in the correct format, like name@example.com',
          href: '#email',
        });
      }
      break;

    case 'defendant':
      if (!data.fullName || data.fullName.trim() === '') {
        errors.push({
          field: 'fullName',
          message: 'Enter defendant full name',
          href: '#fullName',
        });
      }
      if (!data.addressLine1 || data.addressLine1.trim() === '') {
        errors.push({
          field: 'addressLine1',
          message: 'Enter address line 1',
          href: '#addressLine1',
        });
      }
      if (!data.town || data.town.trim() === '') {
        errors.push({
          field: 'town',
          message: 'Enter town or city',
          href: '#town',
        });
      }
      if (!data.postcode || data.postcode.trim() === '') {
        errors.push({
          field: 'postcode',
          message: 'Enter postcode',
          href: '#postcode',
        });
      }
      break;

    case 'grounds':
      if (!data.grounds || data.grounds.length === 0) {
        errors.push({
          field: 'grounds',
          message: 'Select at least one ground for possession',
          href: '#grounds',
        });
      }
      break;

    case 'keyDates':
      // Validate tenancy start date (GOV.UK Frontend uses hyphenated names)
      if (!data['tenancyStart-Day'] || !data['tenancyStart-Month'] || !data['tenancyStart-Year']) {
        errors.push({
          field: 'tenancyStart',
          message: 'Enter tenancy start date',
          href: '#tenancyStart',
        });
      } else if (!isValidDate(data['tenancyStart-Day'], data['tenancyStart-Month'], data['tenancyStart-Year'])) {
        errors.push({
          field: 'tenancyStart',
          message: 'Tenancy start date must be a real date',
          href: '#tenancyStart',
        });
      }

      // Validate notice served date
      if (!data['noticeServed-Day'] || !data['noticeServed-Month'] || !data['noticeServed-Year']) {
        errors.push({
          field: 'noticeServed',
          message: 'Enter notice served date',
          href: '#noticeServed',
        });
      } else if (!isValidDate(data['noticeServed-Day'], data['noticeServed-Month'], data['noticeServed-Year'])) {
        errors.push({
          field: 'noticeServed',
          message: 'Notice served date must be a real date',
          href: '#noticeServed',
        });
      }

      // Validate notice expiry date
      if (!data['noticeExpiry-Day'] || !data['noticeExpiry-Month'] || !data['noticeExpiry-Year']) {
        errors.push({
          field: 'noticeExpiry',
          message: 'Enter notice expiry date',
          href: '#noticeExpiry',
        });
      } else if (!isValidDate(data['noticeExpiry-Day'], data['noticeExpiry-Month'], data['noticeExpiry-Year'])) {
        errors.push({
          field: 'noticeExpiry',
          message: 'Notice expiry date must be a real date',
          href: '#noticeExpiry',
        });
      }
      break;

    case 'statement-of-truth': {
      if (!data.completedBy) {
        errors.push({
          field: 'completedBy',
          message: 'Select who completed this statement',
          href: '#completedBy'
        });
      }
      break;
    }

    default:
      break;
  }

  return errors;
}

/**
 * Helper function to validate date
 */
function isValidDate(day, month, year) {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) {
    return false;
  }

  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/**
 * Submit the claim (generate reference and mark as submitted)
 * @param {object} session - Express session object
 */
function submitClaim(session) {
  const claim = getClaim(session);

  if (!claim) {
    throw new Error('No claim draft found');
  }

  // Generate reference number
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  claim.reference = `PCS-ENG-${timestamp}${random}`;
  claim.status = 'submitted';
  claim.submittedAt = new Date().toISOString();

  session.claimDraft = claim;

  return claim;
}

/**
 * Clear the claim draft from session
 * @param {object} session - Express session object
 */
function clearClaim(session) {
  delete session.claimDraft;
}

module.exports = {
  initializeClaim,
  getClaim,
  updateClaim,
  validateStep,
  submitClaim,
  clearClaim,
};
