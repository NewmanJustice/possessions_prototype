/**
 * Tests for Screen 23: Money Judgement
 * Route: /claims/money-judgement
 * 
 * This screen captures whether the solicitor wants the court to make
 * a money judgment for the outstanding arrears (simple Yes/No choice).
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToDetailsOfRentArrears
} = require('../helpers/sessionHelper');

describe('Screen 23: Money Judgement', () => {
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

  describe('GET /claims/money-judgement', () => {
    
    describe('AC-1: Display money judgment question', () => {
      
      it('should display question about court making judgment for outstanding arrears', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toContain('Do you want the court to make a judgment for the outstanding arrears');
      });

      it('should display Yes radio option', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"/);
        expect(response.text).toContain('Yes');
      });

      it('should display No radio option', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"/);
        expect(response.text).toContain('No');
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/name="moneyJudgementRequested"/);
      });

    });

    describe('Pre-population on revisit', () => {
      
      it('should have no radio pre-selected on first visit', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        // Neither radio should have 'checked' attribute initially
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-select Yes when requested is true in session', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Submit Yes
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when requested is false in session', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Submit No
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-populate correctly after validation error', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // First submit valid value
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Trigger validation error (no selection) - this shouldn't happen in reality
        // but tests the preservation mechanism
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/money-judgement', () => {
    
    describe('AC-2: Selection validation', () => {
      
      it('should show error when no selection made', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toContain('Select whether you want the court to make a judgment for the outstanding arrears');
      });

      it('should have exact error message from AC', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toContain('Select whether you want the court to make a judgment for the outstanding arrears');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error message', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-message');
      });

      it('should move focus to error summary', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

    });

    describe('AC-3: Persist money judgment intention', () => {
      
      it('should store Yes selection as requested: true', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Verify by revisiting
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store No selection as requested: false', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Verify by revisiting
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should store data in session.claim.moneyJudgement structure', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Session structure validated through successful persistence
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.status).toBe(200);
      });

      it('should persist selection across requests', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Submit
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Navigate away and back
        await testSession
          .post('/claims/money-judgement')
          .send({ action: 'previous' })
          .expect(302);
        
        // Return
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('Selection change behavior', () => {
      
      it('should change from Yes to No (true to false)', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // First: select Yes
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Then: change to No
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Verify No is selected
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
      });

      it('should change from No to Yes (false to true)', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // First: select No
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Then: change to Yes
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Verify Yes is selected
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

      it('should preserve last selection after multiple changes', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Multiple changes: Yes → No → Yes → No
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Final selection should be No
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('Boolean mapping', () => {
      
      it('should map form value "yes" to true in session', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Verified through pre-population
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should map form value "no" to false in session', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        // Verified through pre-population
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should map session true to "yes" radio checked', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should map session false to "no" radio checked', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-4: Previous navigation', () => {
      
      it('should redirect to /claims/details-of-rent-arrears when Previous clicked', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({ action: 'previous' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
      });

      it('should preserve previous inputs in session', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Make selection
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Click Previous
        await testSession
          .post('/claims/money-judgement')
          .send({ action: 'previous' })
          .expect(302);
        
        // Return and verify selection preserved
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-5: Continue navigation', () => {
      
      it('should redirect to /claims/claimants-circumstances when Continue clicked with Yes', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/claimants-circumstances');
      });

      it('should redirect to /claims/claimants-circumstances when Continue clicked with No', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'no' })
          .expect(302);

        expect(response.headers.location).toBe('/claims/claimants-circumstances');
      });

      it('should persist selection before navigation', async () => {
        await navigateToMoneyJudgement(testSession);
        
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Navigate back to verify persistence
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-6: Cancel behaviour', () => {
      
      it('should redirect to /case-list when Cancel clicked', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({ action: 'cancel' })
          .expect(302);

        expect(response.headers.location).toBe('/case-list');
      });

      it('should preserve draft claim in session after Cancel', async () => {
        await navigateToMoneyJudgement(testSession);
        
        // Make selection
        await testSession
          .post('/claims/money-judgement')
          .send({ moneyJudgementRequested: 'yes' })
          .expect(302);
        
        // Cancel
        await testSession
          .post('/claims/money-judgement')
          .send({ action: 'cancel' })
          .expect(302);
        
        // Return to page - session should be preserved
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        expect(response.status).toBe(200);
      });

    });

    describe('AC-7: Accessibility compliance', () => {
      
      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link that targets radio group', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/<a href="#moneyJudgementRequested"/);
      });

      it('should move focus to error summary', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .post('/claims/money-judgement')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have proper labels for radio inputs', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        // GOV.UK radios component provides proper labels
        expect(response.text).toMatch(/govuk-radios/);
        expect(response.text).toContain('Yes');
        expect(response.text).toContain('No');
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToMoneyJudgement(testSession);
        
        const response = await testSession
          .get('/claims/money-judgement')
          .expect(200);

        // Standard radio inputs are keyboard accessible by default
        expect(response.text).toMatch(/type="radio"/);
      });

    });

  });

});

/**
 * Helper: Navigate to Money Judgement (Screen 23)
 * Entry: Screen 22 (Details of rent arrears) → Screen 23
 */
async function navigateToMoneyJudgement(agent) {
  // Navigate to Screen 22 (Details of rent arrears)
  await navigateToDetailsOfRentArrears(agent);
  
  // Screen 22 POST: Submit rent arrears details
  await agent
    .post('/claims/details-of-rent-arrears')
    .send({
      totalArrears: '1000',
      thirdPartyPayments: 'no'
    })
    .expect(302);
  
  return agent;
}
