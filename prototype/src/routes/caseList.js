const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// All case list routes require authentication
router.use(requireAuth);

// GET /case-list - Case list dashboard
router.get('/', (req, res) => {
  res.render('pages/case-list/index', {
    pageTitle: 'Case list',
    userEmail: req.session.user.email,
  });
});

module.exports = router;
