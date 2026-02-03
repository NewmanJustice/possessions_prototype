/**
 * Tests for Screen 35: Language Used
 * Route: /claims/language-used
 *
 * Tests derived from user story: businessArtifacts/userstories/screen35.txt
 * Test artifacts: prototype/test/artifacts/screen35/
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToApplicationsViaNoDocuments
} = require('../helpers/sessionHelper');

describe('Screen 35: Language Used', () => {
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
   * Helper to navigate to Screen 35 via Screen 34
   */
  async function navigateToLanguageUsed(agent) {
    await navigateToApplicationsViaNoDocuments(agent);

    // Screen 34: Submit applications question
    await agent
      .post('/claims/applications')
      .send({ planningApplication: 'no' })
      .expect(302);

    return agent;
  }

  describe('GET /claims/language-used', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('T-1.1: should display page heading "Language used"', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('Language used');
      });

      it('T-1.2: should display caption "Make a claim"', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('T-1.3: should display case number', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display question with hint text', () => {

      it('T-2.1: should display question legend', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('Which language did you use to complete this service?');
      });

      it('T-2.2: should display hint text', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('If someone else helped you to answer a question in this service');
        expect(response.text).toContain('ask them if they answered any questions in Welsh');
      });

    });

    describe('AC-3: Display radio options', () => {

      it('T-3.1: should display English radio option', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('English');
        expect(response.text).toMatch(/value="english"/);
      });

      it('T-3.2: should display Welsh radio option', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('Welsh');
        expect(response.text).toMatch(/value="welsh"/);
      });

      it('T-3.3: should display "English and Welsh" radio option', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toContain('English and Welsh');
        expect(response.text).toMatch(/value="english-and-welsh"/);
      });

      it('T-3.4: should use correct name attribute for radio buttons', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/name="language"/);
      });

      it('T-3.5: should have no option pre-selected on first visit', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).not.toMatch(/value="english"[^>]*checked/);
        expect(response.text).not.toMatch(/value="welsh"[^>]*checked/);
        expect(response.text).not.toMatch(/value="english-and-welsh"[^>]*checked/);
      });

    });

    describe('AC-6: Preserve selection on revisit', () => {

      it('T-6.1: should pre-select English when previously selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'english' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="english"[^>]*checked/);
      });

      it('T-6.2: should pre-select Welsh when previously selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'welsh' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="welsh"[^>]*checked/);
      });

      it('T-6.3: should pre-select "English and Welsh" when previously selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'english-and-welsh' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="english-and-welsh"[^>]*checked/);
      });

      it('T-6.4: should have no pre-selection on first visit', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).not.toMatch(/value="english"[^>]*checked/);
        expect(response.text).not.toMatch(/value="welsh"[^>]*checked/);
        expect(response.text).not.toMatch(/value="english-and-welsh"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/language-used', () => {

    describe('AC-4: Language selection is required', () => {

      it('T-4.1: should show error when no selection made', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select which language you used to complete this service');
      });

      it('T-4.2: should display GOV.UK error summary', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('T-4.3: should have error link targeting radio group', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#language"/);
      });

    });

    describe('AC-5: Persist language selection', () => {

      it('T-5.1: should store english when English selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'english' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="english"[^>]*checked/);
      });

      it('T-5.2: should store welsh when Welsh selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'welsh' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="welsh"[^>]*checked/);
      });

      it('T-5.3: should store english-and-welsh when "English and Welsh" selected', async () => {
        await navigateToLanguageUsed(testSession);
        await testSession
          .post('/claims/language-used')
          .send({ language: 'english-and-welsh' })
          .expect(302);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/value="english-and-welsh"[^>]*checked/);
      });

    });

    describe('AC-7: Previous navigation', () => {

      it('T-7.1: should redirect to /claims/applications when Previous clicked', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/applications');
      });

    });

    describe('AC-8: Continue navigation', () => {

      it('T-8.1: should redirect to /claims/completing-your-claim when English selected', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({ language: 'english' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/completing-your-claim');
      });

      it('T-8.2: should redirect to /claims/completing-your-claim when Welsh selected', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({ language: 'welsh' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/completing-your-claim');
      });

      it('T-8.3: should redirect to /claims/completing-your-claim when "English and Welsh" selected', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({ language: 'english-and-welsh' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/completing-your-claim');
      });

    });

    describe('AC-9: Cancel behaviour', () => {

      it('T-9.1: should redirect to /case-list when Cancel clicked', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-10: Accessibility compliance', () => {

      it('T-10.1: should display GOV.UK error summary on validation failure', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('T-10.2: should have error summary with tabindex for focus', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('T-10.3: should have properly labelled radio inputs', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .get('/claims/language-used')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__input/);
        expect(response.text).toMatch(/govuk-radios__label/);
      });

    });

    describe('AC-11: Page title reflects error state', () => {

      it('T-11.1: should prefix page title with "Error:" on validation failure', async () => {
        await navigateToLanguageUsed(testSession);
        const response = await testSession
          .post('/claims/language-used')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<title>Error:/);
      });

    });

  });

});
