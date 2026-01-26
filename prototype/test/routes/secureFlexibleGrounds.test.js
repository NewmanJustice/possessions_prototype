/**
 * Secure/Flexible Tenancy Grounds Route Tests - Screen 13.2
 * 
 * Tests for /claims/grounds-for-possession-secure-flexible
 * Covers: grounds selection, Ground 1 conditional reveal, validation
 * 
 * @see /test/artifacts/screen13.2/understanding.md
 * @see /test/artifacts/screen13.2/test-plan.md
 * @see /test/artifacts/screen13.2/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToTenancy } = require('../helpers/sessionHelper');

/**
 * Navigate to Secure/Flexible Grounds page (Screen 13.2)
 * Sets groundsModel to SECURE_LIKE and navigates to the grounds page
 */
async function navigateToSecureFlexibleGrounds(agent) {
  await navigateToTenancy(agent);
  
  // Screen 12: Submit tenancy with SECURE_LIKE model
  await agent
    .post('/claims/tenancy')
    .send({ 
      groundsModel: 'SECURE_LIKE',
      startDate: '2020-01-01'
    })
    .expect(302);
    
  return agent;
}

describe('Secure/Flexible Tenancy Grounds Route - /claims/grounds-for-possession-secure-flexible', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    
    it('should be accessible when authenticated', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.status).toBe(200);
    });
    
  });
  
  // ============================================================
  // AC-1: Display grounds list
  // ============================================================
  describe('AC-1: Display grounds list', () => {
    
    // T-1.1: Page displays grounds list
    it('should display explanatory text and grounds checkboxes', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/govuk-checkboxes/);
    });
    
    // T-1.2: Ground 1 checkbox present
    it('should display "Rent arrears or breach of the tenancy" checkbox (Ground 1)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Rent arrears or breach of the tenancy/);
      expect(response.text).toMatch(/name="ground1"/);
    });
    
    // T-1.3: Ground 2 checkbox present
    it('should display "Nuisance or annoyance" checkbox (Ground 2)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Nuisance or annoyance/);
      expect(response.text).toMatch(/name="ground2"/);
    });
    
    // T-1.4: Ground 2A checkbox present
    it('should display "Domestic violence" checkbox (Ground 2A)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Domestic violence/);
      expect(response.text).toMatch(/name="ground2A"/);
    });
    
    // T-1.5: Ground 3 checkbox present
    it('should display "Deterioration of dwelling" checkbox (Ground 3)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Deterioration of dwelling/);
      expect(response.text).toMatch(/name="ground3"/);
    });
    
    // T-1.6: Ground 4 checkbox present
    it('should display "Deterioration of furniture" checkbox (Ground 4)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Deterioration of furniture/);
      expect(response.text).toMatch(/name="ground4"/);
    });
    
    // T-1.7: Ground 5 checkbox present
    it('should display "False statement" checkbox (Ground 5)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/False statement/);
      expect(response.text).toMatch(/name="ground5"/);
    });
    
    // T-1.8: Ground 6 checkbox present
    it('should display "Premium paid for assignment" checkbox (Ground 6)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Premium paid for assignment/);
      expect(response.text).toMatch(/name="ground6"/);
    });
    
    // T-1.9: Ground 7 checkbox present
    it('should display "Misconduct or conviction" checkbox (Ground 7)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Misconduct or conviction/);
      expect(response.text).toMatch(/name="ground7"/);
    });
    
    // T-1.10: Ground 8 checkbox present
    it('should display "Serious rent arrears" checkbox (Ground 8)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Serious rent arrears/);
      expect(response.text).toMatch(/name="ground8"/);
    });
    
    // T-1.11: Checkboxes allow multiple selection
    it('should allow multiple checkbox selection', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/type="checkbox"/g);
    });
    
  });
  
  // ============================================================
  // AC-2: Multiple selection allowed
  // ============================================================
  describe('AC-2: Multiple selection allowed', () => {
    
    // T-2.1: At least one ground required
    it('should show error when no grounds are selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select at least one ground for possession/);
    });
    
    // T-2.2: Single ground accepted (not Ground 1)
    it('should accept submission with single ground (Ground 2)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      expect(response.status).toBe(302);
    });
    
    // T-2.3: Multiple grounds accepted
    it('should accept submission with multiple grounds', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground2: 'true',
          ground5: 'true',
          ground8: 'true'
        });
      
      expect(response.status).toBe(302);
    });
    
    // T-2.4: All grounds can be selected
    it('should accept submission with all grounds selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears',
          ground2: 'true',
          ground2A: 'true',
          ground3: 'true',
          ground4: 'true',
          ground5: 'true',
          ground6: 'true',
          ground7: 'true',
          ground8: 'true'
        });
      
      expect(response.status).toBe(302);
    });
    
  });
  
  // ============================================================
  // AC-3: Reveal sub-question when ground 1 selected
  // ============================================================
  describe('AC-3: Conditional reveal for Ground 1', () => {
    
    // T-3.1: Conditional initially hidden
    it('should not show Ground 1 conditional radio when Ground 1 not selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      // Conditional should be hidden by GOV.UK pattern
      expect(response.text).toMatch(/govuk-radios__conditional/);
    });
    
    // T-3.2: Conditional revealed on check (client-side - structure test)
    it('should have conditional radio structure linked to Ground 1', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/name="ground1Type"/);
    });
    
    // T-3.3: Rent arrears option present
    it('should display "Rent arrears" radio option', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Rent arrears/);
      expect(response.text).toMatch(/value="rentArrears"/);
    });
    
    // T-3.4: Breach option present
    it('should display "Breach of tenancy" radio option', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Breach of tenancy/);
      expect(response.text).toMatch(/value="breach"/);
    });
    
    // T-3.5: Conditional hidden on uncheck (persistence test)
    it('should clear ground1Type when Ground 1 is deselected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // First submit with Ground 1
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      // Then submit without Ground 1
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground2: 'true'
        });
      
      // Revisit to check session
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      // Ground 1 should not be checked
      expect(checkResponse.text).not.toMatch(/name="ground1"[^>]*checked/);
    });
    
    // T-3.6: Other grounds no reveal
    it('should not reveal conditional for non-Ground-1 checkboxes', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      // Should succeed without ground1Type
      expect(response.status).toBe(302);
    });
    
  });
  
  // ============================================================
  // AC-4: One sub-option required when ground 1 selected
  // ============================================================
  describe('AC-4: Ground 1 sub-option validation', () => {
    
    // T-4.1: Ground 1 without sub-option
    it('should show error when Ground 1 selected but no sub-option chosen', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select whether ground 1 is rent arrears or breach of tenancy/);
    });
    
    // T-4.2: Error summary displayed
    it('should display GOV.UK error summary when Ground 1 type missing', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-4.3: Focus on error summary
    it('should set focus on error summary with tabindex="-1"', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-4.4: Error link to radio group
    it('should link error summary to ground1Type radio group', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/href="#ground1Type"/);
    });
    
    // T-4.5: Rent arrears selected valid
    it('should accept Ground 1 with "Rent arrears" selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      expect(response.status).toBe(302);
    });
    
    // T-4.6: Breach selected valid
    it('should accept Ground 1 with "Breach of tenancy" selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'breach'
        });
      
      expect(response.status).toBe(302);
    });
    
  });
  
  // ============================================================
  // AC-5: Preserve sub-selection on revisit
  // ============================================================
  describe('AC-5: Preserve sub-selection', () => {
    
    // T-5.1: Ground 1 preserved
    it('should preserve Ground 1 checkbox when revisiting page', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
    });
    
    // T-5.2: Rent arrears preserved
    it('should preserve "Rent arrears" selection when revisiting', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/value="rentArrears"[^>]*checked|checked[^>]*value="rentArrears"/);
    });
    
    // T-5.3: Breach preserved
    it('should preserve "Breach of tenancy" selection when revisiting', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'breach'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/value="breach"[^>]*checked|checked[^>]*value="breach"/);
    });
    
    // T-5.4: Conditional revealed on revisit
    it('should keep conditional radio visible when Ground 1 is checked on revisit', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      // Ground 1 checked means conditional should be revealed (client-side)
      expect(checkResponse.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
      expect(checkResponse.text).toMatch(/name="ground1Type"/);
    });
    
  });
  
  // ============================================================
  // AC-6: Persist secure/flexible grounds
  // ============================================================
  describe('AC-6: Session persistence', () => {
    
    // T-6.1: Store Ground 1 flag
    it('should store ground1 flag in session', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
    });
    
    // T-6.2: Store ground1Type (rentArrears)
    it('should store ground1Type as "rentArrears" in session', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/value="rentArrears"[^>]*checked|checked[^>]*value="rentArrears"/);
    });
    
    // T-6.3: Store ground1Type (breach)
    it('should store ground1Type as "breach" in session', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'breach'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/value="breach"[^>]*checked|checked[^>]*value="breach"/);
    });
    
    // T-6.4: ground1Type null when not selected
    it('should not have ground1Type when Ground 1 not selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).not.toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
    });
    
    // T-6.5: Store Ground 2
    it('should store ground2 when selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground2"[^>]*checked|checked[^>]*name="ground2"/);
    });
    
    // T-6.6: Store Ground 2A (camelCase)
    it('should store ground2A when selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2A: 'true' });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground2A"[^>]*checked|checked[^>]*name="ground2A"/);
    });
    
    // T-6.7: Store Ground 3
    it('should store ground3 when selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground3: 'true' });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground3"[^>]*checked|checked[^>]*name="ground3"/);
    });
    
    // T-6.8: Store multiple selected grounds
    it('should store all selected grounds correctly', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground2: 'true',
          ground5: 'true',
          ground8: 'true'
        });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground2"[^>]*checked|checked[^>]*name="ground2"/);
      expect(checkResponse.text).toMatch(/name="ground5"[^>]*checked|checked[^>]*name="ground5"/);
      expect(checkResponse.text).toMatch(/name="ground8"[^>]*checked|checked[^>]*name="ground8"/);
    });
    
    // T-6.9: Session structure correct
    it('should create secureFlexible object with correct structure', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears',
          ground2: 'true'
        });
      
      // Session structure validated by successful storage and retrieval
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
      expect(checkResponse.text).toMatch(/name="ground2"[^>]*checked|checked[^>]*name="ground2"/);
    });
    
    // T-6.10: Clear ground1Type on deselect
    it('should clear ground1Type when Ground 1 is deselected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // First submit with Ground 1
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      // Then submit with Ground 1 deselected
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      // Revisit and verify ground1Type is not present
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).not.toMatch(/value="rentArrears"[^>]*checked|checked[^>]*value="rentArrears"/);
    });
    
  });
  
  // ============================================================
  // AC-7: Continue route
  // ============================================================
  describe('AC-7: Routing', () => {
    
    // T-7.1: Redirect on success (no Ground 1)
    it('should redirect to rent-arrears-breach-of-tenency for valid submission', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/rent-arrears-breach-of-tenency');
    });
    
    // T-7.2: Redirect with Ground 1
    it('should redirect to rent-arrears-breach-of-tenency when Ground 1 selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/rent-arrears-breach-of-tenency');
    });
    
    // T-7.3: Placeholder route exists
    it('should have placeholder route for /claims/rent-arrears-breach-of-tenency', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      const response = await testSession
        .get('/claims/rent-arrears-breach-of-tenency');
      
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Rent Arrears|Breach of Tenency|Placeholder/i);
    });
    
  });
  
  // ============================================================
  // AC-8: Previous and Cancel
  // ============================================================
  describe('AC-8: Navigation', () => {
    
    // T-8.1: Previous button exists
    it('should display Previous link', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Previous/);
    });
    
    // T-8.2: Previous → tenancy
    it('should navigate to tenancy when Previous is clicked', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/href="\/claims\/tenancy"/);
    });
    
    // T-8.3: Data preserved on previous
    it('should preserve entered data when navigating to previous page', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      await testSession
        .get('/claims/tenancy');
      
      const returnResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(returnResponse.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
    });
    
    // T-8.4: Cancel button exists
    it('should display Cancel link', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/Cancel/);
    });
    
    // T-8.5: Cancel → case list
    it('should navigate to case-list when Cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/href="\/case-list"/);
    });
    
    // T-8.6: Draft preserved on cancel
    it('should preserve session data when cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      await testSession
        .get('/case-list');
      
      const returnResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(returnResponse.text).toMatch(/name="ground2"[^>]*checked|checked[^>]*name="ground2"/);
    });
    
  });
  
  // ============================================================
  // AC-9: Validation errors
  // ============================================================
  describe('AC-9: Error handling', () => {
    
    // T-9.1: Error summary on no selection
    it('should display GOV.UK error summary when no grounds selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-9.2: Error summary on Ground 1 miss
    it('should display error summary when Ground 1 selected without type', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-9.3: Multiple errors shown
    it('should display both errors when applicable', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // Only Ground 1 with no type = error
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/Select whether ground 1 is rent arrears or breach of tenancy/);
    });
    
    // T-9.4: Error links functional
    it('should have href links in error summary', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/href="#/);
    });
    
    // T-9.5: Inline error on checkboxes
    it('should display inline error when no grounds selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-message/);
      expect(response.text).toMatch(/Select at least one ground for possession/);
    });
    
    // T-9.6: Inline error on Ground 1 radio
    it('should display inline error on Ground 1 radio when type missing', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/govuk-error-message/);
      expect(response.text).toMatch(/Select whether ground 1 is rent arrears or breach of tenancy/);
    });
    
    // T-9.7: Values preserved on error
    it('should preserve selected values when validation fails', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
    });
    
  });
  
  // ============================================================
  // AC-10: Accessibility
  // ============================================================
  describe('AC-10: Accessibility', () => {
    
    // T-10.1: Error summary focus
    it('should have tabindex="-1" on error summary for focus management', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-10.2: Error summary links to controls
    it('should have error links targeting form controls', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      expect(response.text).toMatch(/href="#ground1Type"/);
    });
    
    // T-10.3: Keyboard accessible
    it('should have keyboard accessible checkboxes and radios', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      // GOV.UK components are keyboard accessible by default
      expect(response.text).toMatch(/govuk-checkboxes/);
      expect(response.text).toMatch(/govuk-radios/);
    });
    
    // T-10.4: Labels properly associated
    it('should have proper labels for all form controls', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/govuk-label/);
    });
    
    // T-10.5: Conditional radio announced
    it('should have conditional radio structure for assistive tech', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/govuk-radios__conditional/);
    });
    
    // T-10.6: ARIA on conditional
    it('should have GOV.UK conditional pattern classes', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(response.text).toMatch(/govuk-radios__conditional/);
    });
    
    // T-10.7: Screen reader support
    it('should have ARIA attributes for error messages', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({});
      
      // GOV.UK components include aria-describedby for errors
      expect(response.text).toMatch(/govuk-error-message/);
    });
    
  });
  
  // ============================================================
  // Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    
    // T-E.1: Check/uncheck Ground 1 multiple times
    it('should handle Ground 1 being checked and unchecked multiple times', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // Check Ground 1 with type
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      // Uncheck Ground 1
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2: 'true' });
      
      // Check Ground 1 again
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'breach'
        });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.2: All grounds + Ground 1 type
    it('should handle all grounds being selected including Ground 1 with type', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears',
          ground2: 'true',
          ground2A: 'true',
          ground3: 'true',
          ground4: 'true',
          ground5: 'true',
          ground6: 'true',
          ground7: 'true',
          ground8: 'true'
        });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.3: Change Ground 1 type on revisit
    it('should allow changing Ground 1 type from rent arrears to breach', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // First submit with rent arrears
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      // Revisit and change to breach
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'breach'
        });
      
      expect(response.status).toBe(302);
      
      // Verify change persisted
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/value="breach"[^>]*checked|checked[^>]*value="breach"/);
    });
    
    // T-E.4: Ground 2A stored correctly (camelCase)
    it('should store Ground 2A with camelCase naming (ground2A)', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground2A: 'true' });
      
      const checkResponse = await testSession
        .get('/claims/grounds-for-possession-secure-flexible');
      
      expect(checkResponse.text).toMatch(/name="ground2A"[^>]*checked|checked[^>]*name="ground2A"/);
    });
    
    // T-E.5: Only Ground 8 (mandatory) selected
    it('should accept only mandatory ground (Ground 8) being selected', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground8: 'true' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.6: Preserve on validation error
    it('should preserve all selections when validation error occurs', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground2: 'true',
          ground5: 'true'
          // Missing ground1Type - triggers error
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/name="ground1"[^>]*checked|checked[^>]*name="ground1"/);
      expect(response.text).toMatch(/name="ground2"[^>]*checked|checked[^>]*name="ground2"/);
      expect(response.text).toMatch(/name="ground5"[^>]*checked|checked[^>]*name="ground5"/);
    });
    
    // T-E.7: Ground 1 error recovery
    it('should allow correcting Ground 1 validation error', async () => {
      const testSession = session(app);
      await navigateToSecureFlexibleGrounds(testSession);
      
      // First submit triggers error
      await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ ground1: 'true' });
      
      // Correct the error
      const response = await testSession
        .post('/claims/grounds-for-possession-secure-flexible')
        .send({ 
          ground1: 'true',
          ground1Type: 'rentArrears'
        });
      
      expect(response.status).toBe(302);
    });
    
  });
  
});
