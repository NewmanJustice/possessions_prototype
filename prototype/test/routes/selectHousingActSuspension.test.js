/**
 * Tests for Screen 26a: Housing Act (Suspension of right to buy)
 * Route: /claims/select-housing-act-suspension
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToSelectHousingActSuspension
} = require('../helpers/sessionHelper');

describe('Screen 26a: Housing Act (Suspension of right to buy)', () => {
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

  describe('GET /claims/select-housing-act-suspension', () => {

    describe('AC-1: Display page heading and guidance', () => {

      it('should display page heading "Housing Act"', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Housing Act');
      });

      it('should display guidance about selecting Housing Act for suspension', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/select.*Housing Act|suspension/i);
      });

      it('should be accessible at /claims/select-housing-act-suspension', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension');
        expect(response.status).toBe(200);
      });

    });

    describe('AC-2: Display Housing Act selection', () => {

      it('should display question about which Housing Act applies', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/which housing act/i);
      });

      it('should display Housing Act 1985 option', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Housing Act 1985');
      });

      it('should display Housing Act 1996 option', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Housing Act 1996');
      });

      it('should display Other option', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Other');
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/name="suspensionHousingAct"/);
      });

    });

    describe('AC-4: "Other" reveals Act name field', () => {

      it('should have conditional reveal for Other option', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/govuk-radios__conditional/);
      });

      it('should have housingActOtherName input field', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/name="housingActOtherName"/);
      });

      it('should have label "Name of Housing Act" for Other input', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Name of Housing Act');
      });

    });

    describe('AC-6: Display Housing Act section input', () => {

      it('should display Section input field', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/name="section"/);
      });

      it('should display Section label', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Section');
      });

      it('should display hint text for Section', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('For example');
      });

    });

    describe('Pre-population behaviour', () => {

      it('should have no pre-selection on first visit', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).not.toMatch(/name="suspensionHousingAct"[^>]*checked/);
      });

      it('should pre-select 1985 option when previously selected', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1985"[^>]*checked/);
      });

      it('should pre-select 1996 option when previously selected', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1996', section: 'section 153A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996"[^>]*checked/);
      });

      it('should pre-select Other and populate other name when previously selected', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({
            suspensionHousingAct: 'other',
            housingActOtherName: 'Custom Housing Act 2020',
            section: 'section 5'
          })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="other"[^>]*checked/);
        expect(response.text).toContain('Custom Housing Act 2020');
      });

      it('should pre-populate section when previously entered', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('section 121A');
      });

    });

    describe('Navigation buttons', () => {

      it('should display Previous link to alternative-to-possession', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Previous');
      });

      it('should display Continue button', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Continue');
      });

      it('should display Cancel link to case-list', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('Cancel');
        expect(response.text).toContain('href="/case-list"');
      });

    });

  });

  describe('POST /claims/select-housing-act-suspension', () => {

    describe('AC-3: Housing Act selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ section: 'section 121A' })
          .expect(200);
        expect(response.text).toContain('Select the Housing Act');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error message', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-message');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#suspensionHousingAct"/);
      });

    });

    describe('AC-5: "Other" Act name is required', () => {

      it('should show error when Other selected with empty name', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'other', section: 'section 5' })
          .expect(200);
        expect(response.text).toContain('Enter the name of the Housing Act');
      });

      it('should not show other name error when 1985 selected', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        // Successful redirect means no validation error
      });

      it('should not show other name error when 1996 selected', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1996', section: 'section 153A' })
          .expect(302);
        // Successful redirect means no validation error
      });

      it('should have error link targeting other name field', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'other', section: 'section 5' })
          .expect(200);
        expect(response.text).toMatch(/<a href="#housingActOtherName"/);
      });

    });

    describe('AC-7: Section is required', () => {

      it('should show error when section is empty', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985' })
          .expect(200);
        expect(response.text).toContain('Enter the Housing Act section');
      });

      it('should have error link targeting section field', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985' })
          .expect(200);
        expect(response.text).toMatch(/<a href="#section"/);
      });

    });

    describe('AC-8: Section format validation (max length)', () => {

      it('should accept section at exactly 50 characters', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({
            suspensionHousingAct: 'housing-act-1985',
            section: 'a'.repeat(50)
          })
          .expect(302);
        // Successful redirect means accepted
      });

      it('should show error for section over 50 characters', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({
            suspensionHousingAct: 'housing-act-1985',
            section: 'a'.repeat(51)
          })
          .expect(200);
        expect(response.text).toContain('Enter 50 characters or fewer');
      });

    });

    describe('AC-9: Persist Housing Act and section', () => {

      it('should store 1985 selection in session', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1985"[^>]*checked/);
      });

      it('should store 1996 selection in session', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1996', section: 'section 153A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996"[^>]*checked/);
      });

      it('should store Other selection with name in session', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({
            suspensionHousingAct: 'other',
            housingActOtherName: 'Custom Act',
            section: 'section 1'
          })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="other"[^>]*checked/);
        expect(response.text).toContain('Custom Act');
      });

      it('should update session when changing selection', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1996', section: 'section 153A' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996"[^>]*checked/);
      });

    });

    describe('AC-10: Previous navigation', () => {

      it('should redirect to alternative-to-possession when Previous clicked', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-11: Continue navigation', () => {

      it('should redirect to reasons-for-suspension with 1985 selection', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1985', section: 'section 121A' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/reasons-for-suspension');
      });

      it('should redirect to reasons-for-suspension with 1996 selection', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'housing-act-1996', section: 'section 153A' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/reasons-for-suspension');
      });

      it('should redirect to reasons-for-suspension with Other selection', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({
            suspensionHousingAct: 'other',
            housingActOtherName: 'Custom Act',
            section: 'section 1'
          })
          .expect(302);
        expect(response.headers.location).toBe('/claims/reasons-for-suspension');
      });

    });

    describe('AC-12: Cancel behaviour', () => {

      it('should have Cancel link pointing to /case-list', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toMatch(/<a[^>]*href="\/case-list"[^>]*>.*Cancel.*<\/a>/s);
      });

    });

    describe('AC-13: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus management', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('govuk-radios');
        expect(response.text).toMatch(/type="radio"/);
      });

      it('should have proper labels for radio options', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-suspension')
          .expect(200);
        expect(response.text).toContain('govuk-radios__label');
      });

      it('should prefix page title with Error: on validation failure', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<title>\s*Error:/);
      });

    });

    describe('Multiple error handling', () => {

      it('should show multiple errors when both radio and section missing', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select the Housing Act');
        expect(response.text).toContain('Enter the Housing Act section');
      });

      it('should show all errors when Other selected without name or section', async () => {
        await navigateToSelectHousingActSuspension(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-suspension')
          .send({ suspensionHousingAct: 'other' })
          .expect(200);
        expect(response.text).toContain('Enter the name of the Housing Act');
        expect(response.text).toContain('Enter the Housing Act section');
      });

    });

  });

  describe('Authentication', () => {

    it('should require authentication', async () => {
      const unauthSession = session(app);
      const response = await unauthSession
        .get('/claims/select-housing-act-suspension')
        .expect(302);
      expect(response.headers.location).toMatch(/access|sign-in/);
    });

  });

});
