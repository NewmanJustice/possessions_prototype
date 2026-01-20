/**
 * Authentication and authorization middleware
 */

/**
 * Check if user has passed the access code gate
 */
function requireAccessCode(req, res, next) {
  if (!req.session.accessGranted) {
    return res.redirect('/access');
  }
  next();
}

/**
 * Check if user is authenticated (signed in)
 */
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }
  next();
}

/**
 * Check if user has a specific role
 * @param {string} role - Required role (e.g., 'SOLICITOR')
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in');
    }

    if (req.session.user.role !== role) {
      return res.status(403).render('pages/error', {
        pageTitle: 'Access denied',
        heading: 'Access denied',
        message: 'You do not have permission to access this page.',
      });
    }

    next();
  };
}

module.exports = {
  requireAccessCode,
  requireAuth,
  requireRole,
};
