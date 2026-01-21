const express = require('express');
const router = express.Router();

// GET /select-user-type
router.get('/', (req, res) => {
  // Check if user has passed access gate
  if (!req.session.accessGranted) {
    return res.redirect('/access');
  }

  const errors = req.session.errors || [];

  // Transform errors to have 'text' property for error summary
  const transformedErrors = errors.map(error => ({
    ...error,
    text: error.message
  }));

  res.render('pages/select-user-type/index', {
    pageTitle: 'Select user type',
    errors: transformedErrors,
    selectedUserType: req.session.userType || null,
  });

  delete req.session.errors;
});

// POST /select-user-type
router.post('/', (req, res) => {
  const { userType } = req.body;
  const errors = [];

  // Validate user type selection
  if (!userType) {
    errors.push({
      field: 'userType',
      message: 'Select which type of user you are',
      href: '#userType',
    });
  }

  // Check if selected user type is available
  const availableUserTypes = ['professional'];
  if (userType && !availableUserTypes.includes(userType)) {
    errors.push({
      field: 'userType',
      message: 'This user type is not available yet',
      href: '#userType',
    });
  }

  if (errors.length > 0) {
    req.session.errors = errors;
    return res.redirect('/select-user-type');
  }

  // Store user type in session
  req.session.userType = userType;

  // Redirect to authentication
  res.redirect('/auth/sign-in');
});

module.exports = router;
