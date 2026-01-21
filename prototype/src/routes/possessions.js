const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// All possessions routes require authentication
router.use(requireAuth);

// GET /possessions - Service landing page
router.get('/', (req, res) => {
  const userType = req.session.user.userType || 'professional';

  res.render('pages/possessions/index', {
    pageTitle: 'Possessions',
    userEmail: req.session.user.email,
    userType: userType,
  });
});

module.exports = router;
