/**
 * Document Upload Integration Stub
 * To be implemented in a future iteration
 */

const FEATURE_ENABLED = process.env.FEATURE_DOCUMENT_UPLOAD === 'true';

function isEnabled() {
  return FEATURE_ENABLED;
}

/**
 * Upload document (stub)
 * @param {object} file
 * @returns {Promise<object>}
 */
async function uploadDocument(file) {
  if (!FEATURE_ENABLED) {
    throw new Error('Document upload feature is not enabled');
  }

  // Stub implementation - would call Azure Blob Storage or similar
  return {
    documentId: 'STUB',
    filename: file.originalname,
    status: 'uploaded',
  };
}

module.exports = {
  isEnabled,
  uploadDocument,
};
