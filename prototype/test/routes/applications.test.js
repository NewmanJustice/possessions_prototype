/**
 * Tests for Screen 34: Applications
 * Route: /claims/applications
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToUnderlesseeMortgageeForfeitureRelief,
  navigateToUploadAdditionalDocument
} = require('../helpers/sessionHelper');

describe('Screen 34: Applications', () => {
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

  /**
   * Helper to navigate to Screen 34 via the "No documents" path (Screen 32 No → Screen 34)
   */
  async function navigateToApplicationsViaNoDocuments(agent) {
    await navigateToUnderlesseeMortgageeForfeitureRelief(agent);
    await agent
      .post('/claims/underlessee-mortgagee-forfeiture-relief')
      .send({ hasUnderlesseeOrMortgageeForRelief: 'no' })
      .expect(302);
  }

  /**
   * Helper to navigate to Screen 34 via the "With documents" path (Screen 33 → Screen 34)
   */
  async function navigateToApplicationsViaDocuments(agent) {
    await navigateToUploadAdditionalDocument(agent);
    await agent
      .post('/claims/upload-additional-document')
      .send({
        'documents[0][documentType]': 'contact-log',
        'documents[0][description]': 'Test document'
      })
      .expect(302);
  }

  describe('GET /claims/applications', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('should display page heading "Applications"', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toContain('Applications');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display explanatory content', () => {

      it('should display introductory text about applications', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toContain('need to ask the court');
      });

      it('should display bullet list of application examples', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toContain('permission to make your claim');
      });

    });

    describe('AC-3: Display question and radio options', () => {

      it('should display question text', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toContain('Are you planning to make an application at the same time as your claim?');
      });

      it('should display Yes radio option', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="yes"/);
      });

      it('should display No radio option', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="no"/);
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/name="planningApplication"/);
      });

    });

    describe('AC-5: Preserve selection on revisit', () => {

      it('should pre-select Yes when previously selected', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        await testSession
          .post('/claims/applications')
          .send({ planningApplication: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-select No when previously selected', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        await testSession
          .post('/claims/applications')
          .send({ planningApplication: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).not.toMatch(/value="yes"[^>]*checked/);
        expect(response.text).not.toMatch(/value="no"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/applications', () => {

    describe('AC-4: Yes/No selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select yes if you are planning to make an application');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#planningApplication"/);
      });

    });

    describe('AC-6: Persist selection', () => {

      it('should store yes when Yes selected', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        await testSession
          .post('/claims/applications')
          .send({ planningApplication: 'yes' })
          .expect(302);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store no when No selected', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        await testSession
          .post('/claims/applications')
          .send({ planningApplication: 'no' })
          .expect(302);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/value="no"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation (from documents path)', () => {

      it('should redirect to upload-additional-document when documents exist', async () => {
        await navigateToApplicationsViaDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/upload-additional-document');
      });

    });

    describe('AC-8: Previous navigation (from no documents path)', () => {

      it('should redirect to underlessee-mortgagee-forfeiture-relief when no documents', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/underlessee-mortgagee-forfeiture-relief');
      });

    });

    describe('AC-9: Continue navigation', () => {

      it('should redirect to language-used when valid selection made', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({ planningApplication: 'yes' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/language-used');
      });

    });

    describe('AC-10: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-11: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .post('/claims/applications')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have properly labelled radio inputs', async () => {
        await navigateToApplicationsViaNoDocuments(testSession);
        const response = await testSession
          .get('/claims/applications')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

  });

});
