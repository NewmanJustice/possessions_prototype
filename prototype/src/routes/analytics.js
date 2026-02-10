/**
 * Analytics Dashboard Routes
 * View user activity data collected by the analytics service
 * Mounted at /__prototype-annotator/analytics
 */

const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

/**
 * GET / - Main dashboard (GA-style)
 */
router.get('/', (req, res) => {
  const days = parseInt(req.query.days) || 7;

  const stats = analyticsService.getSummaryStats(days);
  const pageViews = analyticsService.getPageViewCounts(days);
  const dropOffs = analyticsService.getDropOffAnalysis(days);
  const validationErrors = analyticsService.getValidationErrors(days);
  const navigation = analyticsService.getNavigationPatterns(days);
  const dailyActivity = analyticsService.getDailyActivity(days);

  res.render('pages/analytics/dashboard', {
    pageTitle: 'Analytics',
    days,
    stats,
    pageViews,
    dropOffs,
    validationErrors,
    navigation,
    dailyActivity,
    basePath: '/__prototype-annotator/analytics'
  });
});

/**
 * GET /realtime - Real-time event feed
 */
router.get('/realtime', (req, res) => {
  const events = analyticsService.getRecentEvents(100);

  res.render('pages/analytics/realtime', {
    pageTitle: 'Real-time',
    events,
    basePath: '/__prototype-annotator/analytics'
  });
});

/**
 * GET /pages - Page analytics
 */
router.get('/pages', (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const pageViews = analyticsService.getPageViewCounts(days, 50);
  const dropOffs = analyticsService.getDropOffAnalysis(days);

  res.render('pages/analytics/pages', {
    pageTitle: 'Pages',
    days,
    pageViews,
    dropOffs,
    basePath: '/__prototype-annotator/analytics'
  });
});

/**
 * GET /behaviour - User behaviour analytics
 */
router.get('/behaviour', (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const validationErrors = analyticsService.getValidationErrors(days);
  const navigation = analyticsService.getNavigationPatterns(days);
  const dropOffs = analyticsService.getDropOffAnalysis(days);

  res.render('pages/analytics/behaviour', {
    pageTitle: 'Behaviour',
    days,
    validationErrors,
    navigation,
    dropOffs,
    basePath: '/__prototype-annotator/analytics'
  });
});

/**
 * GET /api/stats - JSON API for stats
 */
router.get('/api/stats', (req, res) => {
  const days = parseInt(req.query.days) || 7;
  res.json({
    stats: analyticsService.getSummaryStats(days),
    pageViews: analyticsService.getPageViewCounts(days),
    dropOffs: analyticsService.getDropOffAnalysis(days),
    validationErrors: analyticsService.getValidationErrors(days),
    navigation: analyticsService.getNavigationPatterns(days),
    dailyActivity: analyticsService.getDailyActivity(days)
  });
});

/**
 * GET /api/events - JSON API for recent events
 */
router.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(analyticsService.getRecentEvents(limit));
});

module.exports = router;
