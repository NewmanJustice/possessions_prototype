/**
 * Unit Tests for Journey Map Service
 * Service: src/services/journeyMapService.js
 *
 * Tests zone/station definitions and status calculation logic.
 */

// Service will be created by developer - tests define expected API
let journeyMapService;

beforeAll(() => {
  try {
    journeyMapService = require('../../src/services/journeyMapService');
  } catch (e) {
    // Service not yet implemented - tests will fail with helpful message
    journeyMapService = null;
  }
});

describe('journeyMapService', () => {

  describe('Service exports', () => {

    it('should export getJourneyZones function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getJourneyZones).toBe('function');
    });

    it('should export getCurrentStationId function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getCurrentStationId).toBe('function');
    });

    it('should export getStationStatus function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getStationStatus).toBe('function');
    });

    it('should export getCompletedStationIds function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getCompletedStationIds).toBe('function');
    });

    it('should export getSelectedBranch function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getSelectedBranch).toBe('function');
    });

    it('should export getJourneyMapData function', () => {
      expect(journeyMapService).not.toBeNull();
      expect(typeof journeyMapService.getJourneyMapData).toBe('function');
    });

  });

  describe('getJourneyZones - Zone Definitions', () => {

    it('should return an array', () => {
      const zones = journeyMapService.getJourneyZones();
      expect(Array.isArray(zones)).toBe(true);
    });

    it('should return exactly 12 zones', () => {
      const zones = journeyMapService.getJourneyZones();
      expect(zones).toHaveLength(12);
    });

    it('should have zones in correct order', () => {
      const zones = journeyMapService.getJourneyZones();
      const expectedOrder = [
        'Eligibility',
        'Claim Type',
        'Claimant Details',
        'Defendant Details',
        'Property & Tenancy',
        'Grounds for Possession',
        'Pre-action & Notice',
        'Rent & Arrears',
        'Money Judgment',
        'Alternatives',
        'Additional Info',
        'Submit'
      ];
      const actualOrder = zones.map(z => z.name);
      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should have correct zone colours', () => {
      const zones = journeyMapService.getJourneyZones();
      const expectedColours = {
        'Eligibility': 'green',
        'Claim Type': 'green',
        'Claimant Details': 'blue',
        'Defendant Details': 'blue',
        'Property & Tenancy': 'purple',
        'Grounds for Possession': 'orange',
        'Pre-action & Notice': 'orange',
        'Rent & Arrears': 'red',
        'Money Judgment': 'red',
        'Alternatives': 'yellow',
        'Additional Info': 'grey',
        'Submit': 'black'
      };

      zones.forEach(zone => {
        expect(zone.colour).toBe(expectedColours[zone.name]);
      });
    });

    describe('Zone structure', () => {

      it('should have id property on each zone', () => {
        const zones = journeyMapService.getJourneyZones();
        zones.forEach(zone => {
          expect(zone).toHaveProperty('id');
          expect(typeof zone.id).toBe('string');
          expect(zone.id.length).toBeGreaterThan(0);
        });
      });

      it('should have name property on each zone', () => {
        const zones = journeyMapService.getJourneyZones();
        zones.forEach(zone => {
          expect(zone).toHaveProperty('name');
          expect(typeof zone.name).toBe('string');
        });
      });

      it('should have colour property on each zone', () => {
        const zones = journeyMapService.getJourneyZones();
        zones.forEach(zone => {
          expect(zone).toHaveProperty('colour');
          expect(typeof zone.colour).toBe('string');
        });
      });

      it('should have stations array on each zone', () => {
        const zones = journeyMapService.getJourneyZones();
        zones.forEach(zone => {
          expect(zone).toHaveProperty('stations');
          expect(Array.isArray(zone.stations)).toBe(true);
          expect(zone.stations.length).toBeGreaterThan(0);
        });
      });

    });

  });

  describe('getJourneyZones - Station Definitions', () => {

    it('should have required properties on each station', () => {
      const zones = journeyMapService.getJourneyZones();
      zones.forEach(zone => {
        zone.stations.forEach(station => {
          expect(station).toHaveProperty('id');
          expect(station).toHaveProperty('title');
          expect(station).toHaveProperty('url');
          expect(station).toHaveProperty('question');
          expect(station).toHaveProperty('requirements');
        });
      });
    });

    it('should have station id as string', () => {
      const zones = journeyMapService.getJourneyZones();
      zones.forEach(zone => {
        zone.stations.forEach(station => {
          expect(typeof station.id).toBe('string');
          expect(station.id.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have station url starting with /claims/', () => {
      const zones = journeyMapService.getJourneyZones();
      zones.forEach(zone => {
        zone.stations.forEach(station => {
          expect(station.url).toMatch(/^\/claims\//);
        });
      });
    });

    it('should have station requirements as array', () => {
      const zones = journeyMapService.getJourneyZones();
      zones.forEach(zone => {
        zone.stations.forEach(station => {
          expect(Array.isArray(station.requirements)).toBe(true);
        });
      });
    });

    it('should have unique station IDs across all zones', () => {
      const zones = journeyMapService.getJourneyZones();
      const allIds = [];
      zones.forEach(zone => {
        zone.stations.forEach(station => {
          allIds.push(station.id);
        });
      });
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

  });

  describe('getCurrentStationId', () => {

    it('should return station ID for valid claims URL', () => {
      const stationId = journeyMapService.getCurrentStationId('/claims/eligibility');
      expect(typeof stationId).toBe('string');
      expect(stationId.length).toBeGreaterThan(0);
    });

    it('should return null for non-claims URL', () => {
      const stationId = journeyMapService.getCurrentStationId('/case-list');
      expect(stationId).toBeNull();
    });

    it('should return null for invalid URL', () => {
      const stationId = journeyMapService.getCurrentStationId('/claims/nonexistent-page');
      expect(stationId).toBeNull();
    });

    it('should handle URL with query string', () => {
      const stationId = journeyMapService.getCurrentStationId('/claims/eligibility?lang=cy');
      expect(stationId).not.toBeNull();
    });

  });

  describe('getStationStatus', () => {

    const emptySession = { claimDraft: {} };

    it('should return "upcoming" for unvisited station not current', () => {
      const status = journeyMapService.getStationStatus(
        emptySession,
        'defendant-details',
        '/claims/eligibility'
      );
      expect(status).toBe('upcoming');
    });

    it('should return "current" when URL matches station', () => {
      const status = journeyMapService.getStationStatus(
        emptySession,
        'check-eligibility',
        '/claims/eligibility'
      );
      expect(status).toBe('current');
    });

    it('should return "completed" when session field has value', () => {
      const sessionWithData = {
        claimDraft: {
          eligibilityConfirmed: true
        }
      };
      const status = journeyMapService.getStationStatus(
        sessionWithData,
        'check-eligibility',
        '/claims/defendant-details'
      );
      expect(status).toBe('completed');
    });

    it('should prioritise "current" over "completed"', () => {
      const sessionWithData = {
        claimDraft: {
          eligibilityConfirmed: true
        }
      };
      const status = journeyMapService.getStationStatus(
        sessionWithData,
        'check-eligibility',
        '/claims/eligibility'
      );
      expect(status).toBe('current');
    });

  });

  describe('getCompletedStationIds', () => {

    it('should return empty array for empty session', () => {
      const emptySession = { claimDraft: {} };
      const completed = journeyMapService.getCompletedStationIds(emptySession);
      expect(Array.isArray(completed)).toBe(true);
      expect(completed).toHaveLength(0);
    });

    it('should return array of completed station IDs', () => {
      const sessionWithData = {
        claimDraft: {
          eligibilityConfirmed: true,
          propertyLocation: 'england'
        }
      };
      const completed = journeyMapService.getCompletedStationIds(sessionWithData);
      expect(Array.isArray(completed)).toBe(true);
      expect(completed.length).toBeGreaterThan(0);
    });

    it('should return station IDs as strings', () => {
      const sessionWithData = {
        claimDraft: {
          eligibilityConfirmed: true
        }
      };
      const completed = journeyMapService.getCompletedStationIds(sessionWithData);
      completed.forEach(id => {
        expect(typeof id).toBe('string');
      });
    });

  });

  describe('getSelectedBranch', () => {

    it('should return null when tenancy type not selected', () => {
      const session = { claimDraft: {} };
      const branch = journeyMapService.getSelectedBranch(session);
      expect(branch).toBeNull();
    });

    it('should return "assured" for assured tenancy', () => {
      const session = {
        claimDraft: {
          tenancy: { type: 'assured-tenancy' }
        }
      };
      const branch = journeyMapService.getSelectedBranch(session);
      expect(branch).toBe('assured');
    });

    it('should return "secure" for secure tenancy', () => {
      const session = {
        claimDraft: {
          tenancy: { type: 'secure-tenancy' }
        }
      };
      const branch = journeyMapService.getSelectedBranch(session);
      expect(branch).toBe('secure');
    });

    it('should return "flexible" for flexible tenancy', () => {
      const session = {
        claimDraft: {
          tenancy: { type: 'flexible-tenancy' }
        }
      };
      const branch = journeyMapService.getSelectedBranch(session);
      expect(branch).toBe('flexible');
    });

  });

  describe('getJourneyMapData', () => {

    it('should return object with zones array', () => {
      const session = { claimDraft: {} };
      const data = journeyMapService.getJourneyMapData(session, '/claims/eligibility');
      expect(data).toHaveProperty('zones');
      expect(Array.isArray(data.zones)).toBe(true);
    });

    it('should return object with currentStationId', () => {
      const session = { claimDraft: {} };
      const data = journeyMapService.getJourneyMapData(session, '/claims/eligibility');
      expect(data).toHaveProperty('currentStationId');
    });

    it('should return object with selectedBranch', () => {
      const session = { claimDraft: {} };
      const data = journeyMapService.getJourneyMapData(session, '/claims/eligibility');
      expect(data).toHaveProperty('selectedBranch');
    });

    it('should include status on each station', () => {
      const session = { claimDraft: {} };
      const data = journeyMapService.getJourneyMapData(session, '/claims/eligibility');
      data.zones.forEach(zone => {
        zone.stations.forEach(station => {
          expect(station).toHaveProperty('status');
          expect(['completed', 'current', 'upcoming']).toContain(station.status);
        });
      });
    });

    it('should mark exactly one station as current', () => {
      const session = { claimDraft: {} };
      const data = journeyMapService.getJourneyMapData(session, '/claims/eligibility');
      let currentCount = 0;
      data.zones.forEach(zone => {
        zone.stations.forEach(station => {
          if (station.status === 'current') {
            currentCount++;
          }
        });
      });
      expect(currentCount).toBe(1);
    });

  });

});
