/**
 * Address Lookup Integration Stub
 * To be implemented in a future iteration
 */

const FEATURE_ENABLED = process.env.FEATURE_ADDRESS_LOOKUP === 'true';

function isEnabled() {
  return FEATURE_ENABLED;
}

/**
 * Lookup addresses by postcode (stub)
 * @param {string} postcode
 * @returns {Promise<Array>}
 */
async function lookupByPostcode(postcode) {
  if (!FEATURE_ENABLED) {
    throw new Error('Address lookup feature is not enabled');
  }

  // Stub implementation - would call OS Places API or similar
  return [];
}

module.exports = {
  isEnabled,
  lookupByPostcode,
};
