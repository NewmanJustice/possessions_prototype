/**
 * Tests for Screen 26d: Statement of Express Terms
 * Route: /claims/statement-of-express-terms
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToStatementOfExpressTerms
} = require('../helpers/sessionHelper');

describe('Screen 26d: Statement of Express Terms', () => {
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

  describe('GET /claims/statement-of-express-terms', () => {

    describe('AC-1: Display page heading and question', () => {

      it('should display page heading "Statement of express terms"', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/Statement of express terms/i);
      });

      it('should display question about serving statement', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/served.*defendants.*statement.*express terms/i);
      });

      it('should be accessible at /claims/statement-of-express-terms', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms');
        expect(response.status).toBe(200);
      });

    });

    describe('AC-2: Display radio options', () => {

      it('should display Yes radio option', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/i);
      });

      it('should display No radio option', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="no"/i);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/name="statementOfExpressTerms"/);
      });

    });

    describe('AC-8: Preserve selection on revisit', () => {

      it('should pre-select Yes option when previously selected', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No option when previously selected', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).not.toMatch(/name="statementOfExpressTerms"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/statement-of-express-terms', () => {

    describe('AC-5: Selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/Select yes if you have served/i);
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error message', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-message');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#statementOfExpressTerms"/);
      });

    });

    describe('AC-7: Persist selection and details', () => {

      it('should store Yes selection in session', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store No selection in session', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should store Yes and details in session', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({
            statementOfExpressTerms: 'yes',
            statementOfExpressTermsDetails: 'Served by hand on 1 Jan 2026'
          })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
        expect(response.text).toContain('Served by hand on 1 Jan 2026');
      });

      it('should update session when changing from Yes to No', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'yes' })
          .expect(302);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should update session when changing from No to Yes', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'no' })
          .expect(302);
        await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

    });

    describe('AC-9: Previous navigation', () => {

      it('should display Previous link to select-housing-act-demotion', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toContain('href="/claims/select-housing-act-demotion"');
        expect(response.text).toContain('Previous');
      });

    });

    describe('AC-10: Continue navigation', () => {

      it('should redirect to claiming-costs with Yes selection', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'yes' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should redirect to claiming-costs with No selection', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({ statementOfExpressTerms: 'no' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should redirect to claiming-costs with Yes and details', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({
            statementOfExpressTerms: 'yes',
            statementOfExpressTermsDetails: 'Details provided'
          })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

    });

    describe('AC-11: Cancel behaviour', () => {

      it('should display Cancel link to case-list', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toContain('href="/case-list"');
        expect(response.text).toContain('Cancel');
      });

    });

    describe('AC-12: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus management', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .post('/claims/statement-of-express-terms')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toContain('govuk-radios');
        expect(response.text).toMatch(/type="radio"/);
      });

      it('should have proper labels for radio options', async () => {
        await navigateToStatementOfExpressTerms(testSession);
        const response = await testSession
          .get('/claims/statement-of-express-terms')
          .expect(200);
        expect(response.text).toContain('govuk-radios__label');
      });

    });

  });

});
