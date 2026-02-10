/**
 * Analytics Service
 * Tracks user activity using SQLite for storage
 * Uses the same database location as prototype-annotator
 */

const path = require('path');
const fs = require('fs');

// Lazy-load sql.js to avoid startup issues
let SQL = null;
let db = null;
let dbPath = null;

/**
 * Initialize the analytics database
 * @param {string} customDbPath - Optional custom database path
 */
async function initialize(customDbPath = null) {
  if (db) return; // Already initialized

  try {
    // Use sql.js (same as prototype-annotator)
    const initSqlJs = require('sql.js');
    SQL = await initSqlJs();

    // Determine database path
    dbPath = customDbPath || process.env.ANALYTICS_DB_PATH ||
      (process.env.NODE_ENV === 'production' ? '/home/data/analytics.sqlite' : './data/analytics.sqlite');

    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    // Create tables if they don't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        event_name TEXT NOT NULL,
        page_url TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        user_agent TEXT,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id)
    `);
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type)
    `);
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at)
    `);

    // Save to disk
    saveDatabase();

    console.log(`Analytics Service initialized`);
    console.log(`  Database: ${dbPath}`);
  } catch (error) {
    console.error('Failed to initialize Analytics Service:', error.message);
  }
}

/**
 * Save database to disk
 */
function saveDatabase() {
  if (!db || !dbPath) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.error('Failed to save analytics database:', error.message);
  }
}

/**
 * Track or update a session
 * @param {string} sessionId - Session identifier
 * @param {string} userAgent - Browser user agent
 */
function trackSession(sessionId, userAgent = null) {
  if (!db) return;

  try {
    // Insert or update session
    db.run(`
      INSERT INTO sessions (session_id, user_agent, last_activity)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(session_id) DO UPDATE SET last_activity = CURRENT_TIMESTAMP
    `, [sessionId, userAgent]);
    saveDatabase();
  } catch (error) {
    console.error('Failed to track session:', error.message);
  }
}

/**
 * Log an analytics event
 * @param {string} sessionId - Session identifier
 * @param {string} eventType - Type of event (page_view, form_submit, navigation, error)
 * @param {string} eventName - Name/description of the event
 * @param {string} pageUrl - URL where event occurred
 * @param {object} metadata - Additional event data
 */
function logEvent(sessionId, eventType, eventName, pageUrl = null, metadata = {}) {
  if (!db) return;

  try {
    db.run(`
      INSERT INTO events (session_id, event_type, event_name, page_url, metadata)
      VALUES (?, ?, ?, ?, ?)
    `, [sessionId, eventType, eventName, pageUrl, JSON.stringify(metadata)]);
    saveDatabase();
  } catch (error) {
    console.error('Failed to log event:', error.message);
  }
}

/**
 * Log a page view
 * @param {string} sessionId - Session identifier
 * @param {string} pageUrl - Page URL
 * @param {string} pageTitle - Page title
 */
function logPageView(sessionId, pageUrl, pageTitle = null) {
  logEvent(sessionId, 'page_view', pageTitle || pageUrl, pageUrl, { title: pageTitle });
}

/**
 * Log a form submission
 * @param {string} sessionId - Session identifier
 * @param {string} pageUrl - Page URL
 * @param {boolean} valid - Whether validation passed
 * @param {array} errors - Validation errors if any
 */
function logFormSubmit(sessionId, pageUrl, valid = true, errors = []) {
  logEvent(sessionId, 'form_submit', valid ? 'valid' : 'invalid', pageUrl, { valid, errors });
}

/**
 * Log navigation action (previous, continue, cancel)
 * @param {string} sessionId - Session identifier
 * @param {string} pageUrl - Current page URL
 * @param {string} action - Navigation action
 * @param {string} destination - Where user navigated to
 */
function logNavigation(sessionId, pageUrl, action, destination = null) {
  logEvent(sessionId, 'navigation', action, pageUrl, { action, destination });
}

/**
 * Log journey completion
 * @param {string} sessionId - Session identifier
 * @param {string} journeyName - Name of completed journey
 * @param {number} duration - Journey duration in seconds
 */
function logJourneyComplete(sessionId, journeyName, duration = null) {
  logEvent(sessionId, 'journey_complete', journeyName, null, { duration });
}

/**
 * Log journey abandonment
 * @param {string} sessionId - Session identifier
 * @param {string} lastPage - Last page visited
 */
function logJourneyAbandon(sessionId, lastPage) {
  logEvent(sessionId, 'journey_abandon', 'abandoned', lastPage, {});
}

// ============================================================================
// Query Functions for Dashboard
// ============================================================================

/**
 * Get summary statistics
 * @param {number} days - Number of days to include (default 7)
 */
function getSummaryStats(days = 7) {
  if (!db) return null;

  try {
    const dateFilter = `datetime('now', '-${days} days')`;

    const totalSessions = db.exec(`
      SELECT COUNT(DISTINCT session_id) as count FROM events WHERE created_at >= ${dateFilter}
    `)[0]?.values[0]?.[0] || 0;

    const totalPageViews = db.exec(`
      SELECT COUNT(*) as count FROM events WHERE event_type = 'page_view' AND created_at >= ${dateFilter}
    `)[0]?.values[0]?.[0] || 0;

    const totalFormSubmits = db.exec(`
      SELECT COUNT(*) as count FROM events WHERE event_type = 'form_submit' AND created_at >= ${dateFilter}
    `)[0]?.values[0]?.[0] || 0;

    const validSubmits = db.exec(`
      SELECT COUNT(*) as count FROM events
      WHERE event_type = 'form_submit' AND event_name = 'valid' AND created_at >= ${dateFilter}
    `)[0]?.values[0]?.[0] || 0;

    const journeyCompletions = db.exec(`
      SELECT COUNT(*) as count FROM events WHERE event_type = 'journey_complete' AND created_at >= ${dateFilter}
    `)[0]?.values[0]?.[0] || 0;

    return {
      totalSessions,
      totalPageViews,
      totalFormSubmits,
      validSubmits,
      invalidSubmits: totalFormSubmits - validSubmits,
      validationRate: totalFormSubmits > 0 ? ((validSubmits / totalFormSubmits) * 100).toFixed(1) : 0,
      journeyCompletions,
      avgPagesPerSession: totalSessions > 0 ? (totalPageViews / totalSessions).toFixed(1) : 0
    };
  } catch (error) {
    console.error('Failed to get summary stats:', error.message);
    return null;
  }
}

/**
 * Get page view counts by URL
 * @param {number} days - Number of days to include
 * @param {number} limit - Max results
 */
function getPageViewCounts(days = 7, limit = 20) {
  if (!db) return [];

  try {
    const results = db.exec(`
      SELECT page_url, COUNT(*) as views
      FROM events
      WHERE event_type = 'page_view' AND created_at >= datetime('now', '-${days} days')
      GROUP BY page_url
      ORDER BY views DESC
      LIMIT ${limit}
    `);

    if (!results[0]) return [];
    return results[0].values.map(([url, views]) => ({ url, views }));
  } catch (error) {
    console.error('Failed to get page view counts:', error.message);
    return [];
  }
}

/**
 * Get drop-off analysis (pages where users leave)
 * @param {number} days - Number of days to include
 */
function getDropOffAnalysis(days = 7) {
  if (!db) return [];

  try {
    // Get total sessions for rate calculation
    const totalSessionsResult = db.exec(`
      SELECT COUNT(DISTINCT session_id) FROM events WHERE created_at >= datetime('now', '-${days} days')
    `);
    const totalSessions = totalSessionsResult[0]?.values[0]?.[0] || 1;

    // Get the last page viewed in each session
    const results = db.exec(`
      SELECT page_url, COUNT(*) as drop_offs
      FROM (
        SELECT session_id, page_url,
          ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC) as rn
        FROM events
        WHERE event_type = 'page_view' AND created_at >= datetime('now', '-${days} days')
      )
      WHERE rn = 1
      GROUP BY page_url
      ORDER BY drop_offs DESC
      LIMIT 10
    `);

    if (!results[0]) return [];
    return results[0].values.map(([url, count]) => ({
      url,
      count,
      rate: ((count / totalSessions) * 100).toFixed(1)
    }));
  } catch (error) {
    console.error('Failed to get drop-off analysis:', error.message);
    return [];
  }
}

/**
 * Get validation error frequency by page and field
 * @param {number} days - Number of days to include
 */
function getValidationErrors(days = 7) {
  if (!db) return [];

  try {
    // Get all invalid form submissions with their error fields
    const results = db.exec(`
      SELECT page_url, metadata
      FROM events
      WHERE event_type = 'form_submit' AND event_name = 'invalid' AND created_at >= datetime('now', '-${days} days')
    `);

    if (!results[0]) return [];

    // Parse metadata and extract error fields
    const errorCounts = {};
    results[0].values.forEach(([url, metadata]) => {
      try {
        const data = JSON.parse(metadata || '{}');
        const errors = data.errors || [];
        errors.forEach(field => {
          const key = `${url}|${field}`;
          errorCounts[key] = (errorCounts[key] || 0) + 1;
        });
      } catch (e) {
        // Ignore parse errors
      }
    });

    // Convert to array and sort by count
    const errorList = Object.entries(errorCounts)
      .map(([key, count]) => {
        const [url, field] = key.split('|');
        return { url, field, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return errorList;
  } catch (error) {
    console.error('Failed to get validation errors:', error.message);
    return [];
  }
}

/**
 * Get navigation patterns (back button usage)
 * @param {number} days - Number of days to include
 */
function getNavigationPatterns(days = 7) {
  if (!db) return {};

  try {
    const results = db.exec(`
      SELECT event_name, COUNT(*) as count
      FROM events
      WHERE event_type = 'navigation' AND created_at >= datetime('now', '-${days} days')
      GROUP BY event_name
    `);

    if (!results[0]) return {};
    const patterns = {};
    results[0].values.forEach(([action, count]) => {
      patterns[action] = count;
    });
    return patterns;
  } catch (error) {
    console.error('Failed to get navigation patterns:', error.message);
    return {};
  }
}

/**
 * Get daily activity for charts
 * @param {number} days - Number of days to include
 */
function getDailyActivity(days = 7) {
  if (!db) return [];

  try {
    const results = db.exec(`
      SELECT DATE(created_at) as date,
        SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as page_views,
        SUM(CASE WHEN event_type = 'form_submit' THEN 1 ELSE 0 END) as form_submits,
        COUNT(DISTINCT session_id) as sessions
      FROM events
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    if (!results[0]) return [];
    return results[0].values.map(([date, pageViews, formSubmits, sessions]) => ({
      date,
      pageViews,
      formSubmits,
      sessions
    }));
  } catch (error) {
    console.error('Failed to get daily activity:', error.message);
    return [];
  }
}

/**
 * Get recent events for live view
 * @param {number} limit - Number of events to return
 */
function getRecentEvents(limit = 50) {
  if (!db) return [];

  try {
    const results = db.exec(`
      SELECT id, session_id, event_type, event_name, page_url, metadata, created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);

    if (!results[0]) return [];
    return results[0].values.map(([id, sessionId, eventType, eventName, pageUrl, metadata, createdAt]) => ({
      id,
      sessionId: sessionId.substring(0, 8) + '...',
      eventType,
      eventName,
      pageUrl,
      metadata: JSON.parse(metadata || '{}'),
      createdAt
    }));
  } catch (error) {
    console.error('Failed to get recent events:', error.message);
    return [];
  }
}

module.exports = {
  initialize,
  trackSession,
  logEvent,
  logPageView,
  logFormSubmit,
  logNavigation,
  logJourneyComplete,
  logJourneyAbandon,
  // Query functions
  getSummaryStats,
  getPageViewCounts,
  getDropOffAnalysis,
  getValidationErrors,
  getNavigationPatterns,
  getDailyActivity,
  getRecentEvents
};
