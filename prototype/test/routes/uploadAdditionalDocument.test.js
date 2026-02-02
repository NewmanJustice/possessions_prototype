/**
 * Tests for Screen 33: Upload additional documents
 * Route: /claims/upload-additional-document
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToUnderlesseeMortgageeForfeitureRelief
} = require('../helpers/sessionHelper');

describe('Screen 33: Upload Additional Documents', () => {
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
   * Helper to navigate to Screen 33 via the Yes path on Screen 32
   */
  async function navigateToUploadAdditionalDocument(agent) {
    await navigateToUnderlesseeMortgageeForfeitureRelief(agent);
    await agent
      .post('/claims/underlessee-mortgagee-forfeiture-relief')
      .send({ hasUnderlesseeOrMortgageeForRelief: 'yes' })
      .expect(302);
  }

  describe('GET /claims/upload-additional-document', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('should display page heading "Upload additional documents"', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('Upload additional documents');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display instructional text', () => {

      it('should display instructional text about document selection', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('select the type of document');
      });

    });

    describe('AC-4: Display add document section', () => {

      it('should display Add document heading', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('Add document');
      });

      it('should display Add new button', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('Add new');
      });

    });

    describe('AC-15: Preserve documents on revisit', () => {

      it('should display previously added documents', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        // Add a document
        await testSession
          .post('/claims/upload-additional-document')
          .send({
            action: 'addNew',
            'documents[0][documentType]': 'contact-log',
            'documents[0][description]': 'Test document'
          })
          .expect(200);
        // Revisit page
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('contact-log');
      });

    });

  });

  describe('POST /claims/upload-additional-document', () => {

    describe('AC-5: Add new button reveals document form', () => {

      it('should add a new document entry when Add new clicked', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        expect(response.text).toContain('Type of document');
        expect(response.text).toContain('Short description');
      });

      it('should display Remove button for document entry', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        expect(response.text).toContain('Remove');
      });

    });

    describe('AC-6: Document type dropdown options', () => {

      it('should include document type options in dropdown', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        expect(response.text).toContain('Contact log');
        expect(response.text).toContain('Tenancy agreement');
      });

    });

    describe('AC-7: Multiple document entries', () => {

      it('should allow adding multiple documents', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        // Add first document
        await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        // Add second document
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({
            action: 'addNew',
            'documents[0][documentType]': 'contact-log'
          })
          .expect(200);
        // Should have multiple document entries
        expect(response.text).toMatch(/Document.*Document/s);
      });

    });

    describe('AC-8: Remove document entry', () => {

      it('should remove document when Remove clicked', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        // Add a document
        await testSession
          .post('/claims/upload-additional-document')
          .send({
            action: 'addNew',
            'documents[0][documentType]': 'contact-log',
            'documents[0][description]': 'Test doc'
          })
          .expect(200);
        // Remove it
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({
            action: 'remove-0',
            'documents[0][documentType]': 'contact-log'
          })
          .expect(200);
        // Document should be gone
        expect(response.text).not.toContain('Test doc');
      });

    });

    describe('AC-12: Document type validation', () => {

      it('should show error when document type not selected', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        // Add document without type
        await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        // Try to continue
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({
            'documents[0][documentType]': '',
            'documents[0][description]': 'Test'
          })
          .expect(200);
        expect(response.text).toContain('Select the type of document');
      });

      it('should display GOV.UK error summary for validation errors', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'addNew' })
          .expect(200);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({
            'documents[0][documentType]': ''
          })
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

    });

    describe('AC-13: At least one document required', () => {

      it('should show error when no documents added but required', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({})
          .expect(200);
        expect(response.text).toContain('You must upload at least one document');
      });

    });

    describe('AC-14: Persist document data', () => {

      it('should persist document type in session', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        await testSession
          .post('/claims/upload-additional-document')
          .send({
            'documents[0][documentType]': 'contact-log',
            'documents[0][description]': 'My contact log'
          })
          .expect(302);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toMatch(/contact-log.*selected/s);
      });

      it('should persist description in session', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        await testSession
          .post('/claims/upload-additional-document')
          .send({
            'documents[0][documentType]': 'contact-log',
            'documents[0][description]': 'My contact log'
          })
          .expect(302);
        const response = await testSession
          .get('/claims/upload-additional-document')
          .expect(200);
        expect(response.text).toContain('My contact log');
      });

    });

    describe('AC-16: Previous navigation', () => {

      it('should redirect to underlessee-mortgagee-forfeiture-relief when Previous clicked', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/underlessee-mortgagee-forfeiture-relief');
      });

    });

    describe('AC-17: Continue navigation', () => {

      it('should redirect to applications when valid document submitted', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({
            'documents[0][documentType]': 'contact-log',
            'documents[0][description]': 'Test'
          })
          .expect(302);
        expect(response.headers.location).toBe('/claims/applications');
      });

    });

    describe('AC-18: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-19: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToUploadAdditionalDocument(testSession);
        const response = await testSession
          .post('/claims/upload-additional-document')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

    });

  });

});
