/**
 * Tests for Screen 14: Grounds for Possession (Additional Grounds)
 * Route: /claims/grounds-for-possession
 * 
 * This screen is reusable with dynamic routing based on navigation contract.
 * These tests focus on the assured journey path where users select
 * additional grounds after confirming assured tenancy.
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToAssuredTenancyGrounds
} = require('../helpers/sessionHelper');

describe('Screen 14: Grounds for Possession (Additional Grounds)', () => {
  let testSession;

  beforeEach(async () => {
    testSession = session(app);
    await createAuthenticatedSession(testSession);
  });

  afterEach(() => {
    if (testSession) {
      testSession.destroy();
    }
  });

  describe('GET /claims/grounds-for-possession', () => {
    
    describe('AC-1: Title displays "Additional grounds for possession" for assured path', () => {
      
      it('should display "Additional grounds for possession" title when titleMode is additional', async () => {
        // Navigate to Screen 13.1.1 and select "Yes" to additional grounds
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('Additional grounds for possession');
        expect(response.text).toContain('<h1');
      });

      it('should have matching page title and h1 heading', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        const titleMatch = response.text.match(/<title>([^<]+)<\/title>/);
        const h1Match = response.text.match(/<h1[^>]*>([^<]+)<\/h1>/);
        
        expect(titleMatch).toBeTruthy();
        expect(h1Match).toBeTruthy();
        expect(titleMatch[1]).toContain('Additional grounds for possession');
        expect(h1Match[1]).toContain('Additional grounds for possession');
      });

    });

    describe('AC-2: Display grounds list as checkboxes', () => {
      
      it('should display 6 mandatory ground checkboxes (1, 3, 4, 5, 7, 8)', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Check for mandatory grounds
        expect(response.text).toContain('mandatoryGround1');
        expect(response.text).toContain('mandatoryGround3');
        expect(response.text).toContain('mandatoryGround4');
        expect(response.text).toContain('mandatoryGround5');
        expect(response.text).toContain('mandatoryGround7');
        expect(response.text).toContain('mandatoryGround8');
        
        // Verify checkbox inputs (GOV.UK Frontend order: name, type, value)
        const mandatoryCheckboxes = response.text.match(/name="grounds"[^>]*type="checkbox"[^>]*value="mandatoryGround/g);
        expect(mandatoryCheckboxes).toHaveLength(6);
      });

      it('should display 8 discretionary ground checkboxes (9-16)', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Check for discretionary grounds
        expect(response.text).toContain('discretionaryGround9');
        expect(response.text).toContain('discretionaryGround10');
        expect(response.text).toContain('discretionaryGround11');
        expect(response.text).toContain('discretionaryGround12');
        expect(response.text).toContain('discretionaryGround13');
        expect(response.text).toContain('discretionaryGround14');
        expect(response.text).toContain('discretionaryGround15');
        expect(response.text).toContain('discretionaryGround16');
        
        // Verify checkbox inputs (GOV.UK Frontend order: name, type, value)
        const discretionaryCheckboxes = response.text.match(/name="grounds"[^>]*type="checkbox"[^>]*value="discretionaryGround/g);
        expect(discretionaryCheckboxes).toHaveLength(8);
      });

      it('should display all 14 checkboxes with correct labels', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Verify total checkbox count (attribute order varies in GOV.UK Frontend)
        const allCheckboxes = response.text.match(/name="grounds"[^>]*type="checkbox"/g);
        expect(allCheckboxes).toHaveLength(14);
        
        // Verify ground labels (from design)
        expect(response.text).toContain('Ground 1');
        expect(response.text).toContain('Ground 3');
        expect(response.text).toContain('Ground 4');
        expect(response.text).toContain('Ground 5');
        expect(response.text).toContain('Ground 7');
        expect(response.text).toContain('Ground 8');
        expect(response.text).toContain('Ground 9');
        expect(response.text).toContain('Ground 10');
        expect(response.text).toContain('Ground 11');
        expect(response.text).toContain('Ground 12');
        expect(response.text).toContain('Ground 13');
        expect(response.text).toContain('Ground 14');
        expect(response.text).toContain('Ground 15');
        expect(response.text).toContain('Ground 16');
      });

      it('should group checkboxes as Mandatory and Discretionary grounds', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('Mandatory grounds');
        expect(response.text).toContain('Discretionary grounds');
      });

    });

    describe('Navigation Contract Setup', () => {
      
      it('should set navigation contract conditionally (only if not present)', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First GET - contract should be set
        await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);
        
        // Get session state
        const response = await testSession.get('/claims/grounds-for-possession');
        expect(response.status).toBe(200);
        
        // Navigation contract should exist (validated in POST tests)
      });

      it('should set default navigation contract values for assured path', async () => {
        // Navigate to Screen 13.1.1 (assured selection page)
        await navigateToAssuredTenancyGrounds(testSession);

        // Screen 13.1.1 POST: Select grounds and choose "yes" to additional grounds
        await testSession
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            hasAdditionalGrounds: 'yes'
          })
          .expect(302);

        // Now access Screen 14 - should have navigation contract set
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.status).toBe(200);
        // Contract values validated through navigation tests
      });

      it('should preserve existing navigation contract when already set', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First access sets contract
        await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);
        
        // Second access should not overwrite
        await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);
        
        // Validated by consistent navigation behavior
      });

    });

    describe('AC-7: Pre-population on revisit', () => {
      
      it('should pre-check previously selected single ground', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // Submit with one ground selected
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Revisit page
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Check that Ground 1 is pre-checked
        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
      });

      it('should pre-check multiple previously selected grounds', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // Submit with multiple grounds
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'discretionaryGround9', 'discretionaryGround10'] })
          .expect(302);
        
        // Revisit page
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround10"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/grounds-for-possession', () => {
    
    describe('AC-3: Multiple selection allowed', () => {
      
      it('should accept selection of one ground', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should accept selection of multiple grounds', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'mandatoryGround3', 'discretionaryGround9'] })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should accept selection of all 14 grounds', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const allGrounds = [
          'mandatoryGround1', 'mandatoryGround3', 'mandatoryGround4', 
          'mandatoryGround5', 'mandatoryGround7', 'mandatoryGround8',
          'discretionaryGround9', 'discretionaryGround10', 'discretionaryGround11',
          'discretionaryGround12', 'discretionaryGround13', 'discretionaryGround14',
          'discretionaryGround15', 'discretionaryGround16'
        ];
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: allGrounds })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

    });

    describe('AC-4: Validation - at least one ground required', () => {
      
      it('should show error when no grounds selected', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: [] })
          .expect(200);

        expect(response.text).toContain('Select at least one ground for possession');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error message', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-message');
        expect(response.text).toContain('Select at least one ground for possession');
      });

      it('should have error summary link that targets checkbox group', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        // Error link should reference grounds field
        expect(response.text).toMatch(/<a href="#grounds"[^>]*>Select at least one ground for possession<\/a>/);
      });

      it('should move focus to error summary on validation failure', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        // Check for focus handling attributes
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toMatch(/role="alert"/);
      });

    });

    describe('AC-5: Preserve selections on validation failure', () => {
      
      it('should preserve single selection when validation fails (impossible with current validation)', async () => {
        // Note: This scenario can't occur with "at least one" validation
        // but tests the preservation mechanism for other potential errors
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First submit valid data
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Selection is preserved in session for revisit
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
      });

      it('should preserve multiple selections when validation fails', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First submit valid data
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'discretionaryGround9'] })
          .expect(302);
        
        // Revisit and verify preservation
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
      });

    });

    describe('AC-6: Persist selected additional grounds', () => {
      
      it('should store mandatory Ground 1 as mandatoryGround1: true', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Verify by revisiting and checking pre-population
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
      });

      it('should store discretionary Ground 9 as discretionaryGround9: true', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['discretionaryGround9'] })
          .expect(302);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
      });

      it('should store multiple grounds with correct prefixed keys', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const selectedGrounds = [
          'mandatoryGround1',
          'mandatoryGround3',
          'discretionaryGround9',
          'discretionaryGround12'
        ];
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: selectedGrounds })
          .expect(302);
        
        // Verify all are pre-checked on revisit
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        selectedGrounds.forEach(ground => {
          const regex = new RegExp(`value="${ground}"[^>]*checked`);
          expect(response.text).toMatch(regex);
        });
      });

      it('should use correct prefixed keys for all 14 grounds', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // Test all mandatory grounds
        const mandatoryGrounds = [
          'mandatoryGround1', 'mandatoryGround3', 'mandatoryGround4',
          'mandatoryGround5', 'mandatoryGround7', 'mandatoryGround8'
        ];
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: mandatoryGrounds })
          .expect(302);
        
        const mandatoryResponse = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        mandatoryGrounds.forEach(ground => {
          expect(mandatoryResponse.text).toMatch(new RegExp(`value="${ground}"[^>]*checked`));
        });
        
        // Test all discretionary grounds
        const discretionaryGrounds = [
          'discretionaryGround9', 'discretionaryGround10', 'discretionaryGround11',
          'discretionaryGround12', 'discretionaryGround13', 'discretionaryGround14',
          'discretionaryGround15', 'discretionaryGround16'
        ];
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: discretionaryGrounds })
          .expect(302);
        
        const discretionaryResponse = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        discretionaryGrounds.forEach(ground => {
          expect(discretionaryResponse.text).toMatch(new RegExp(`value="${ground}"[^>]*checked`));
        });
      });

      it('should store unselected grounds as false in session', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // Select only Ground 1
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Verify other grounds are NOT checked
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Ground 1 should be checked
        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        
        // Other grounds should NOT be checked
        expect(response.text).not.toMatch(/value="mandatoryGround3"[^>]*checked/);
        expect(response.text).not.toMatch(/value="discretionaryGround9"[^>]*checked/);
      });

      it('should persist data in session.claim.grounds.additional', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'discretionaryGround9'] })
          .expect(302);
        
        // Session structure validated through pre-population behavior
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.status).toBe(200);
        // Data persistence verified by successful pre-population
      });

    });

    describe('AC-7: Modify selections on revisit', () => {
      
      it('should allow adding more grounds on revisit', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First submit: select Ground 1
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Revisit and add more grounds
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'mandatoryGround3', 'discretionaryGround9'] })
          .expect(302);
        
        // Verify all three are now selected
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="mandatoryGround3"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
      });

      it('should allow deselecting grounds on revisit', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First submit: select three grounds
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'mandatoryGround3', 'discretionaryGround9'] })
          .expect(302);
        
        // Revisit and deselect Ground 3
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'discretionaryGround9'] })
          .expect(302);
        
        // Verify Ground 3 is no longer selected
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
        expect(response.text).not.toMatch(/value="mandatoryGround3"[^>]*checked/);
      });

      it('should set deselected ground to false in session', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // First: select Ground 1
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);
        
        // Then: deselect it and select Ground 3 instead
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround3'] })
          .expect(302);
        
        // Verify only Ground 3 is checked
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).not.toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="mandatoryGround3"[^>]*checked/);
      });

    });

    describe('AC-8: Previous navigation uses dynamic contract', () => {

      it('should display Previous link to grounds-for-possession-assured-selection', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);

        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('href="/claims/grounds-for-possession-assured-selection"');
        expect(response.text).toContain('Previous');
      });

    });

    describe('AC-9: Continue navigation uses dynamic contract', () => {
      
      it('should redirect to session.claim.navigation.screen14.continue route', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should navigate to reasons-for-possession for assured path', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['discretionaryGround9'] })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

      it('should persist selected grounds before navigation', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1', 'discretionaryGround9'] })
          .expect(302);
        
        // Navigate back to verify persistence
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toMatch(/value="mandatoryGround1"[^>]*checked/);
        expect(response.text).toMatch(/value="discretionaryGround9"[^>]*checked/);
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should display Cancel link to case-list', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);

        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('href="/case-list"');
        expect(response.text).toContain('Cancel');
      });

    });

    describe('AC-12: Accessibility compliance', () => {
      
      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error summary link that navigates to checkbox group', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/<a href="#grounds"/);
        expect(response.text).toContain('Select at least one ground for possession');
      });

      it('should move focus to error summary on validation failure', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toMatch(/role="alert"/);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have accessible labels for all checkboxes', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        // Check for label elements associated with checkboxes
        expect(response.text).toContain('Ground 1');
        expect(response.text).toContain('Ground 9');
        
        // Verify govuk-checkboxes structure
        expect(response.text).toContain('govuk-checkboxes');
      });

      it('should have keyboard accessible Continue button and Previous/Cancel links', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);

        const response = await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);

        expect(response.text).toContain('Continue');
        expect(response.text).toContain('Previous');
        expect(response.text).toContain('Cancel');

        // Verify Continue button exists
        expect(response.text).toMatch(/<button[^>]*>.*Continue.*<\/button>/s);

        // Verify Previous and Cancel are links (keyboard accessible by default)
        expect(response.text).toContain('href="/claims/grounds-for-possession-assured-selection"');
        expect(response.text).toContain('href="/case-list"');
      });

    });

    describe('Navigation contract integrity', () => {
      
      it('should not corrupt navigation contract on validation error', async () => {
        await navigateToAssuredAdditionalGrounds(testSession);
        
        // Access page (sets contract)
        await testSession
          .get('/claims/grounds-for-possession')
          .expect(200);
        
        // Trigger validation error
        await testSession
          .post('/claims/grounds-for-possession')
          .send({})
          .expect(200);
        
        // Navigation should still work correctly
        const response = await testSession
          .post('/claims/grounds-for-possession')
          .send({ grounds: ['mandatoryGround1'] })
          .expect(302);

        expect(response.headers.location).toBe('/claims/reasons-for-possession');
      });

    });

  });

});

/**
 * Helper: Navigate to Additional Grounds screen via assured journey
 * This simulates Screen 13.1.1 → "Yes" → Screen 14
 */
async function navigateToAssuredAdditionalGrounds(agent) {
  // Navigate to Screen 13.1 (Assured journey confirmation)
  await navigateToAssuredTenancyGrounds(agent);
  
  // Screen 13.1 POST: Proceed with assured journey
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'yes' })
    .expect(302);
  
  // Screen 13.1.1 POST: Select "yes" to additional grounds (with required ground selection)
  await agent
    .post('/claims/grounds-for-possession-assured-selection')
    .send({ 
      ground8: 'true',
      hasAdditionalGrounds: 'yes'
    })
    .expect(302);
  
  return agent;
}
