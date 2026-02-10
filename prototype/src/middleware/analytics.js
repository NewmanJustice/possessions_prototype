/**
 * Analytics Middleware
 * Automatically tracks page views and form submissions
 */

const analyticsService = require('../services/analyticsService');

/**
 * Generate or retrieve session ID for analytics
 * Uses a separate ID from the express session to track across session resets
 */
function getAnalyticsSessionId(req) {
  if (!req.session) return 'anonymous';

  // Create analytics session ID if not exists
  if (!req.session.analyticsId) {
    req.session.analyticsId = 'a' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }
  return req.session.analyticsId;
}

/**
 * Middleware to track page views (GET requests to HTML pages)
 */
function trackPageViews(req, res, next) {
  // Only track GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Skip static assets and API routes
  if (req.path.startsWith('/public') ||
      req.path.startsWith('/govuk') ||
      req.path.startsWith('/assets') ||
      req.path.startsWith('/__') ||
      req.path.startsWith('/health') ||
      req.path.includes('.')) {
    return next();
  }

  // Only track after user has accessed the prototype
  if (!req.session?.accessGranted) {
    return next();
  }

  const sessionId = getAnalyticsSessionId(req);
  const userAgent = req.get('User-Agent');

  // Track session
  analyticsService.trackSession(sessionId, userAgent);

  // Track page view after response is sent
  res.on('finish', () => {
    // Only track successful HTML responses
    if (res.statusCode >= 200 && res.statusCode < 400) {
      analyticsService.logPageView(sessionId, req.path, req.path);
    }
  });

  next();
}

/**
 * Middleware to track form submissions (POST requests)
 */
function trackFormSubmissions(req, res, next) {
  // Only track POST requests
  if (req.method !== 'POST') {
    return next();
  }

  // Skip API routes
  if (req.path.startsWith('/__') || req.path.startsWith('/api')) {
    return next();
  }

  // Only track after user has accessed the prototype
  if (!req.session?.accessGranted) {
    return next();
  }

  const sessionId = getAnalyticsSessionId(req);
  const action = req.body?.action;

  // Track navigation actions
  if (action === 'previous' || action === 'cancel') {
    analyticsService.logNavigation(sessionId, req.path, action);
  }

  // Intercept the response to check for validation errors
  const originalRender = res.render.bind(res);
  const originalRedirect = res.redirect.bind(res);

  res.render = function(view, options, callback) {
    // If re-rendering with errors, it's a validation failure
    const hasErrors = options?.errors && Object.keys(options.errors).length > 0;
    const errorList = options?.errorList || [];

    if (hasErrors || errorList.length > 0) {
      const errorFields = errorList.map(e => e.href?.replace('#', '') || 'unknown');
      analyticsService.logFormSubmit(sessionId, req.path, false, errorFields);
    }

    return originalRender(view, options, callback);
  };

  res.redirect = function(url) {
    // Successful redirect usually means valid submission
    if (action !== 'previous' && action !== 'cancel') {
      analyticsService.logFormSubmit(sessionId, req.path, true);

      // Track continue navigation
      if (action === 'continue' || !action) {
        analyticsService.logNavigation(sessionId, req.path, 'continue', url);
      }
    }

    return originalRedirect(url);
  };

  next();
}

/**
 * Combined middleware for easy use
 */
function analyticsMiddleware(req, res, next) {
  trackPageViews(req, res, () => {
    trackFormSubmissions(req, res, next);
  });
}

module.exports = {
  trackPageViews,
  trackFormSubmissions,
  analyticsMiddleware,
  getAnalyticsSessionId
};
