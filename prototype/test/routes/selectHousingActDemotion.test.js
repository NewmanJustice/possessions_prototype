/**
 * Tests for Screen 26c: Housing Act (Demotion of tenancy)
 * Route: /claims/select-housing-act-demotion
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToSelectHousingActDemotion
} = require('../helpers/sessionHelper');

describe('Screen 26c: Housing Act (Demotion of tenancy)', () => {
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

  describe('GET /claims/select-housing-act-demotion', () => {

    describe('AC-1: Display page heading and guidance', () => {

      it('should display page heading "Housing Act"', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toContain('Housing Act');
      });

      it('should display guidance about selecting Housing Act for demotion', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/demotion|Housing Act/i);
      });

      it('should be accessible at /claims/select-housing-act-demotion', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion');
        expect(response.status).toBe(200);
      });

    });

    describe('AC-2: Display Housing Act selection', () => {

      it('should display question about which Housing Act applies', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/which housing act/i);
      });

      it('should display Housing Act 1985 (section 82A) option', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toContain('Housing Act 1985');
        expect(response.text).toContain('82A');
      });

      it('should display Housing Act 1996 (section 143A) option', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toContain('Housing Act 1996');
        expect(response.text).toContain('143A');
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/name="demotionHousingAct"/);
      });

      it('should not display an "Other" option', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).not.toMatch(/value="other"/i);
      });

    });

    describe('AC-5: Preserve selection on revisit', () => {

      it('should pre-select 1985 option when previously selected', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1985-section-82a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1985-section-82a"[^>]*checked/);
      });

      it('should pre-select 1996 option when previously selected', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1996-section-143a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996-section-143a"[^>]*checked/);
      });

      it('should have no pre-selection on first visit', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).not.toMatch(/name="demotionHousingAct"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/select-housing-act-demotion', () => {

    describe('AC-3: Housing Act selection is required', () => {

      it('should show error when no selection made', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toContain('Select the Housing Act');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should display inline error message', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-message');
      });

      it('should have error link targeting radio group', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/<a href="#demotionHousingAct"/);
      });

    });

    describe('AC-4: Persist Housing Act selection', () => {

      it('should store 1985 selection in session', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1985-section-82a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1985-section-82a"[^>]*checked/);
      });

      it('should store 1996 selection in session', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1996-section-143a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996-section-143a"[^>]*checked/);
      });

      it('should update session when changing from 1985 to 1996', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1985-section-82a' })
          .expect(302);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1996-section-143a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1996-section-143a"[^>]*checked/);
      });

      it('should update session when changing from 1996 to 1985', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1996-section-143a' })
          .expect(302);
        await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1985-section-82a' })
          .expect(302);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toMatch(/value="housing-act-1985-section-82a"[^>]*checked/);
      });

    });

    describe('AC-6: Previous navigation', () => {

      it('should redirect to alternative-to-possession when Previous clicked', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

      it('should not require validation when Previous clicked', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/alternative-to-possession');
      });

    });

    describe('AC-7: Continue navigation', () => {

      it('should redirect to statement-of-express-terms with 1985 selection', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1985-section-82a' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-express-terms');
      });

      it('should redirect to statement-of-express-terms with 1996 selection', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ demotionHousingAct: 'housing-act-1996-section-143a' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/statement-of-express-terms');
      });

    });

    describe('AC-8: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-9: Accessibility compliance', () => {

      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

      it('should have error summary with tabindex for focus management', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .post('/claims/select-housing-act-demotion')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have keyboard accessible radio inputs', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toContain('govuk-radios');
        expect(response.text).toMatch(/type="radio"/);
      });

      it('should have proper labels for radio options', async () => {
        await navigateToSelectHousingActDemotion(testSession);
        const response = await testSession
          .get('/claims/select-housing-act-demotion')
          .expect(200);
        expect(response.text).toContain('govuk-radios__label');
      });

    });

  });

});
