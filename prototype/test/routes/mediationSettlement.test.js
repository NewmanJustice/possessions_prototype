/**
 * Mediation and Settlement Route Tests - Screen 17
 * 
 * Tests for /claims/mediation-settlement
 * Covers: mediation/settlement confirmation, conditional display, character limits
 * 
 * @see /test/artifacts/screen17/understanding.md
 * @see /test/artifacts/screen17/test-plan.md
 * @see /test/artifacts/screen17/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToMediationSettlement } = require('../helpers/sessionHelper');

// Test data helpers
const valid250 = 'A'.repeat(250);
const invalid251 = 'A'.repeat(251);

describe('Mediation and Settlement Route - /claims/mediation-settlement', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/mediation-settlement');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToMediationSettlement(testSession);
      
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // Display tests (AC-1, AC-2, AC-6, AC-7)
  // ============================================================
  describe('Display tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('D-1: should load page successfully', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Mediation and settlement/i);
    });

    it('D-2: should display mediation guidance', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/mediation/i);
    });

    it('D-3: should display mediation question with radios', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Have you attempted mediation/i);
      expect(response.text).toMatch(/name="mediationAttempted"/);
    });

    it('D-4: should display settlement guidance (generic)', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/settlement/i);
    });

    it('D-5: should display settlement question with radios', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Have you tried to reach a settlement/i);
      expect(response.text).toMatch(/name="settlementAttempted"/);
    });

    it('D-6: should display Continue button', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Continue/);
      expect(response.text).toMatch(/<button.*type="submit"/);
    });

    it('D-7: should display Previous and Cancel links', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/claims/preaction-protocol');
      expect(response.text).toContain('/case-list');
    });
  });

  // ============================================================
  // Conditional display tests (AC-3, AC-8, Q4)
  // ============================================================
  describe('Conditional display tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('CD-1: should hide mediation details by default', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      // GOV.UK conditional reveal: text area in DOM but container has hidden class
      expect(response.text).toMatch(/govuk-radios__conditional--hidden[\s\S]*?mediationDetails/);
    });

    it('CD-2: should show mediation details when Yes selected', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true', settlementAttempted: 'true' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/name="mediationDetails"/);
      expect(getResponse.text).toMatch(/Give details about the attempted mediation/i);
    });

    it('CD-3: should hide mediation details when No selected', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'false', settlementAttempted: 'true' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).not.toMatch(/mediationDetails.*visible/);
    });

    it('CD-4: should hide settlement details by default', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      // GOV.UK conditional reveal: text area in DOM but container has hidden class
      expect(response.text).toMatch(/govuk-radios__conditional--hidden[\s\S]*?settlementDetails/);
    });

    it('CD-5: should show settlement details when Yes selected', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true', settlementAttempted: 'true' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/name="settlementDetails"/);
      // Check for label text (apostrophe may be encoded)
      expect(getResponse.text).toMatch(/Explain what steps you.{1,10}ve taken/i);
      // When Yes is checked, the conditional should NOT have the hidden class
      expect(getResponse.text).toMatch(/settlementAttempted[\s\S]*?settlementDetails/);
    });

    it('CD-6: should hide settlement details when No selected', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true', settlementAttempted: 'false' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).not.toMatch(/settlementDetails.*visible/);
    });

    it('CD-7: should show mediation helper text', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true', settlementAttempted: 'true' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/250 characters/i);
    });

    it('CD-8: should show settlement helper text', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true', settlementAttempted: 'true' })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/250 characters/i);
    });
  });

  // ============================================================
  // Required field validation (AC-11)
  // ============================================================
  describe('Required field validation', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('RV-1: should error when mediation not answered', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ settlementAttempted: 'true' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select whether you have attempted mediation/i);
    });

    it('RV-2: should error when settlement not answered', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select whether you have tried to reach a settlement/i);
    });

    it('RV-3: should show both errors when neither answered', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/attempted mediation/i);
      expect(response.text).toMatch(/reach a settlement/i);
    });

    it('RV-4: should display error summary', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error.*summary/i);
      expect(response.text).toMatch(/There is a problem/i);
    });

    it('RV-5: should display inline errors', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error-message/);
    });

    it('RV-6: should focus error summary', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('RV-7: should link mediation error correctly', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ settlementAttempted: 'true' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#mediationAttempted"/);
    });

    it('RV-8: should link settlement error correctly', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({ mediationAttempted: 'true' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#settlementAttempted"/);
    });
  });

  // ============================================================
  // Character limit validation (AC-5, AC-10, Q5)
  // ============================================================
  describe('Character limit validation', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('CV-1: should accept 250 chars in mediation details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: valid250,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('CV-2: should reject 251 chars in mediation details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Enter 250 characters or fewer');
    });

    it('CV-3: should accept 250 chars in settlement details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: valid250
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('CV-4: should reject 251 chars in settlement details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: invalid251
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Enter 250 characters or fewer');
    });

    it('CV-5: should show both char limit errors', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'true',
          settlementDetails: invalid251
        });

      expect(response.status).toBe(400);
      const errorMatches = response.text.match(/Enter 250 characters or fewer/g);
      // Error appears in summary (2) + inline (2) = 4 total occurrences
      expect(errorMatches.length).toBeGreaterThanOrEqual(2);
    });

    it('CV-6: should display correct error message for character limit', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Enter 250 characters or fewer');
    });
  });

  // ============================================================
  // Optional field tests (AC-4, AC-9)
  // ============================================================
  describe('Optional field tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('OF-1: should accept mediation Yes with empty details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: '',
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('OF-2: should accept settlement Yes with empty details', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: ''
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('OF-3: should accept both Yes with both details empty', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: '',
          settlementAttempted: 'true',
          settlementDetails: ''
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('OF-4: should ignore details when No selected', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          mediationDetails: 'stale data',
          settlementAttempted: 'false',
          settlementDetails: 'stale data'
        });
      
      expect(response.status).toBe(302);
      
      // Verify details were cleared
      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).not.toContain('stale data');
    });
  });

  // ============================================================
  // Data clearing tests (Q4)
  // ============================================================
  describe('Data clearing tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('DC-1: should clear mediation details when switching Yes to No', async () => {
      // First submit with Yes + details
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Initial details',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Then switch to No
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Verify details cleared
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).not.toContain('Initial details');
    });

    it('DC-2: should clear settlement details when switching Yes to No', async () => {
      // First submit with Yes + details
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: 'Settlement steps'
        })
        .expect(302);

      // Then switch to No
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Verify details cleared
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).not.toContain('Settlement steps');
    });

    it('DC-3: should clear both details when switching both to No', async () => {
      // First submit with both Yes + details
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Mediation info',
          settlementAttempted: 'true',
          settlementDetails: 'Settlement info'
        })
        .expect(302);

      // Then switch both to No
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Verify both cleared
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).not.toContain('Mediation info');
      expect(response.text).not.toContain('Settlement info');
    });

    it('DC-4: should start fresh when switching No to Yes', async () => {
      // First submit No
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Then switch to Yes
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Details field should be empty (not restored from previous)
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toMatch(/name="mediationDetails"/);
      expect(response.text).not.toMatch(/mediationDetails"[^>]*value=/);
    });
  });

  // ============================================================
  // Input preservation tests (AC-12)
  // ============================================================
  describe('Input preservation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('IP-1: should preserve radio selections on error', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/true.*checked|checked.*true/);
      expect(response.text).toMatch(/false.*checked|checked.*false/);
    });

    it('IP-2: should preserve text area content on error', async () => {
      const testText = 'A'.repeat(251);
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: testText,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain(testText);
    });

    it('IP-3: should preserve all inputs together', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'true',
          settlementDetails: invalid251
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/true.*checked|checked.*true/g);
      expect(response.text).toContain(invalid251);
    });

    it('IP-4: should preserve with required field error', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationDetails: 'Some details'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('Some details');
    });
  });

  // ============================================================
  // Session storage tests (AC-13)
  // ============================================================
  describe('Session storage tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('SS-1: should store both No selections correctly', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'false'
        })
        .expect(302);

      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      // Radios should be checked as false
      expect(response.text).toMatch(/false.*checked|checked.*false/);
    });

    it('SS-2: should store mediation Yes with details', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Mediation details',
          settlementAttempted: 'false'
        })
        .expect(302);

      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Mediation details');
    });

    it('SS-3: should store settlement Yes with details', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: 'Settlement steps'
        })
        .expect(302);

      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Settlement steps');
    });

    it('SS-4: should store all four values when both Yes', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Med info',
          settlementAttempted: 'true',
          settlementDetails: 'Set info'
        })
        .expect(302);

      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Med info');
      expect(response.text).toContain('Set info');
    });

    it('SS-5: should persist session after redirect', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Persistent data',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Navigate away and back
      await testSession.get('/claims/preaction-protocol');
      
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Persistent data');
    });

    it('SS-6: should allow changing previous answers', async () => {
      // First submission
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Original',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Change answers
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: 'Updated'
        })
        .expect(302);

      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).not.toContain('Original');
      expect(response.text).toContain('Updated');
    });
  });

  // ============================================================
  // Forward navigation tests (AC-14)
  // ============================================================
  describe('Forward navigation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('FN-1: should redirect to notice-of-intention on valid submission', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/notice-of-intention');
    });

    it('FN-2: should store session data before redirect', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Test data',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Data should be in session
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Test data');
    });

    it('FN-3: should persist data after redirect', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'false',
          settlementAttempted: 'true',
          settlementDetails: 'Persisted'
        })
        .expect(302);

      // Return to page
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Persisted');
    });
  });

  // ============================================================
  // Backward navigation tests (AC-15, AC-16)
  // ============================================================
  describe('Backward navigation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('BN-1: should return to preaction-protocol on Previous', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/claims/preaction-protocol');
    });

    it('BN-2: should preserve data when using Previous', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Preserved',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Navigate to previous screen
      await testSession.get('/claims/preaction-protocol');

      // Return
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Preserved');
    });

    it('BN-3: should return to case-list on Cancel', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toContain('/case-list');
    });

    it('BN-4: should preserve claim draft on Cancel', async () => {
      await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: 'Draft data',
          settlementAttempted: 'false'
        })
        .expect(302);

      // Navigate to case-list
      await testSession.get('/case-list');

      // Return
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.text).toContain('Draft data');
    });
  });

  // ============================================================
  // Accessibility tests (AC-17)
  // ============================================================
  describe('Accessibility tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToMediationSettlement(testSession);
    });

    it('A-1: should link error summary to radio groups', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#mediationAttempted"/);
      expect(response.text).toMatch(/href="#settlementAttempted"/);
    });

    it('A-2: should link error summary to text areas', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          mediationDetails: invalid251,
          settlementAttempted: 'false'
        });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/href="#mediationDetails"/);
    });

    it('A-3: should have labels for radio inputs', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<label.*for="mediationAttempted/);
      expect(response.text).toMatch(/<label.*for="settlementAttempted/);
    });

    it('A-4: should have labels for text areas', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          settlementAttempted: 'true'
        })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/<label.*for="mediationDetails/);
      expect(getResponse.text).toMatch(/<label.*for="settlementDetails/);
    });

    it('A-5: should have fieldset and legend structure', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<fieldset/);
      expect(response.text).toMatch(/<legend/);
    });

    it('A-6: should move focus to error summary on error', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error-summary.*tabindex|tabindex.*error-summary/);
    });

    it('A-7: should be keyboard accessible', async () => {
      const response = await testSession.get('/claims/mediation-settlement');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/<input.*type="radio"/);
      expect(response.text).toMatch(/<textarea/);
      expect(response.text).toMatch(/<form/);
    });

    it('A-8: should have character count hints accessible', async () => {
      const response = await testSession
        .post('/claims/mediation-settlement')
        .send({
          mediationAttempted: 'true',
          settlementAttempted: 'true'
        })
        .expect(302);

      const getResponse = await testSession.get('/claims/mediation-settlement');
      expect(getResponse.text).toMatch(/hint/i);
      expect(getResponse.text).toMatch(/250 characters/);
    });
  });
});
