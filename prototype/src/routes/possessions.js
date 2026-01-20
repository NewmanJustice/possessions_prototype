const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');

// All possessions routes require authentication
router.use(requireAuth);
router.use(requireRole('SOLICITOR'));

// GET /possessions - Service landing page
router.get('/', (req, res) => {
  res.render('pages/possessions/index', {
    pageTitle: 'Possessions',
    userEmail: req.session.user.email,
  });
});

module.exports = router;
