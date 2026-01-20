/**
 * Payments Integration Stub
 * To be implemented in a future iteration
 */

const FEATURE_ENABLED = process.env.FEATURE_PAYMENTS === 'true';

function isEnabled() {
  return FEATURE_ENABLED;
}

/**
 * Create payment request (stub)
 * @param {object} claimData
 * @returns {Promise<object>}
 */
async function createPayment(claimData) {
  if (!FEATURE_ENABLED) {
    throw new Error('Payments feature is not enabled');
  }

  // Stub implementation - would call GOV.UK Pay API
  return {
    paymentId: 'STUB',
    amount: 0,
    status: 'pending',
  };
}

module.exports = {
  isEnabled,
  createPayment,
};
