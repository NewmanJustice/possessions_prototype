/**
 * Tests for Screen 25: Defendant's Circumstances
 * Route: /claims/defendants-circumstances
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToDefendantsCircumstances
} = require('../helpers/sessionHelper');

describe('Screen 25: Defendant\'s Circumstances', () => {
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

  describe('GET /claims/defendants-circumstances', () => {

    describe('AC-1: Display defendants\' circumstances question', () => {

      it('should display question about providing defendants\' circumstances', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toContain('defendants');
        expect(response.text).toContain('circumstances');
      });

      it('should display Yes radio option', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/name="provideDefendantCircumstances"/);
      });

      it('should display guidance about financial or personal situation', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/financial|personal|situation/i);
      });

    });

    describe('AC-3: Conditional details field', () => {

      it('should include details textarea in conditional reveal', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/name="defendantDetails"/);
      });

      it('should include character count guidance', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toContain('950 characters');
      });

    });

    describe('AC-7: Pre-population on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: 'Test' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should pre-populate details text when revisiting', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: 'Known financial difficulties' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toContain('Known financial difficulties');
      });

    });

  });

  describe('POST /claims/defendants-circumstances', () => {

    describe('AC-2: Selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select whether you want to provide information about the defendants');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#provideDefendantCircumstances"/);
      });

    });

    describe('AC-4: Details are optional when revealed', () => {

      it('should accept Yes with empty details', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: '' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

      it('should accept Yes with whitespace-only details', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: '   ' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-5: Character limit enforced', () => {

      it('should show error when details exceed 950 characters', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const longText = 'a'.repeat(951);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: longText })
          .expect(200);
        expect(response.text).toContain('Enter 950 characters or fewer');
      });

      it('should accept exactly 950 characters', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const exactText = 'a'.repeat(950);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: exactText })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-6: Persist defendants\' circumstances', () => {

      it('should store provided: true when Yes selected', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: 'Details' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store provided: false when No selected', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should store details when Yes selected with text', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: 'Financial difficulties' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toContain('Financial difficulties');
      });

      it('should clear details when changing from Yes to No', async () => {
        await navigateToDefendantsCircumstances(testSession);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes', defendantDetails: 'Some details' })
          .expect(302);
        await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).not.toContain('Some details');
      });

    });

    describe('AC-8: Previous navigation', () => {

      it('should redirect to claimants-circumstances when Previous clicked', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claimants-circumstances');
      });

    });

    describe('AC-9: Continue navigation', () => {

      it('should redirect to alternative-to-possession when Continue with Yes', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'yes' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

      it('should redirect to alternative-to-possession when Continue with No', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ provideDefendantCircumstances: 'no' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-11: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .post('/claims/defendants-circumstances')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToDefendantsCircumstances(testSession);
        const response = await testSession
          .get('/claims/defendants-circumstances')
          .expect(200);
        expect(response.text).toContain('govuk-radios');
        expect(response.text).toMatch(/type="radio"/);
      });

    });

  });

});
