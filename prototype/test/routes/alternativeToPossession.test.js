/**
 * Tests for Screen 26: Alternatives to Possession
 * Route: /claims/alternative-to-possession
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToAlternativeToPossession
} = require('../helpers/sessionHelper');

describe('Screen 26: Alternatives to Possession', () => {
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

  describe('GET /claims/alternative-to-possession', () => {

    describe('Page display and guidance', () => {

      it('should display the page heading', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toContain('Alternatives to possession');
      });

      it('should display guidance about suspension of right to buy', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/suspension.*right to buy/i);
      });

      it('should display guidance about demotion of tenancy', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/demotion.*tenancy/i);
      });

      it('should display the optional question text', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/alternative to possession.*suspension of right to buy.*demotion of tenancy.*optional/is);
      });

    });

    describe('Radio options display', () => {

      it('should display suspension of right to buy radio option', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="suspensionOfRightToBuy"/);
        expect(response.text).toContain('Suspension of right to buy');
      });

      it('should display demotion of tenancy radio option', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="demotionOfTenancy"/);
        expect(response.text).toContain('Demotion of tenancy');
      });

      it('should display neither option', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="neither"/);
        expect(response.text).toContain('Neither');
      });

      it('should use correct name attribute for radio buttons', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/name="alternativesToPossession"/);
      });

    });

    describe('Pre-population on revisit', () => {

      it('should pre-select suspension when previously selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'suspensionOfRightToBuy' })
          .expect(302);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="suspensionOfRightToBuy"[^>]*checked/);
      });

      it('should pre-select demotion when previously selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'demotionOfTenancy' })
          .expect(302);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="demotionOfTenancy"[^>]*checked/);
      });

      it('should pre-select neither when previously selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'neither' })
          .expect(302);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="neither"[^>]*checked/);
      });

    });

  });

  describe('POST /claims/alternative-to-possession', () => {

    describe('Optional selection acceptance', () => {

      it('should accept submission with no selection', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({})
          .expect(302);
      });

      it('should not display validation error when no selection made', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({})
          .expect(302);
        expect(response.text).not.toContain('There is a problem');
      });

    });

    describe('Session persistence', () => {

      it('should store suspension selection in session', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'suspensionOfRightToBuy' })
          .expect(302);
        const sessionData = await testSession.get('/claims/alternative-to-possession').expect(200);
        expect(sessionData.text).toMatch(/value="suspensionOfRightToBuy"[^>]*checked/);
      });

      it('should store demotion selection in session', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'demotionOfTenancy' })
          .expect(302);
        const sessionData = await testSession.get('/claims/alternative-to-possession').expect(200);
        expect(sessionData.text).toMatch(/value="demotionOfTenancy"[^>]*checked/);
      });

      it('should store neither selection in session', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'neither' })
          .expect(302);
        const sessionData = await testSession.get('/claims/alternative-to-possession').expect(200);
        expect(sessionData.text).toMatch(/value="neither"[^>]*checked/);
      });

    });

    describe('Routing: No selection to claiming costs', () => {

      it('should redirect to claiming-costs when neither is selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'neither' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

      it('should redirect to claiming-costs when no selection made', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({})
          .expect(302);
        expect(response.headers.location).toBe('/claims/claiming-costs');
      });

    });

    describe('Routing: Suspension to housing act suspension', () => {

      it('should redirect to select-housing-act-suspension when suspension selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'suspensionOfRightToBuy' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/select-housing-act-suspension');
      });

    });

    describe('Routing: Demotion to housing act demotion', () => {

      it('should redirect to select-housing-act-demotion when demotion selected', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'demotionOfTenancy' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/select-housing-act-demotion');
      });

    });

    describe('Previous button navigation', () => {

      it('should redirect to defendants-circumstances when Previous clicked', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/defendants-circumstances');
      });

      it('should preserve session data when navigating back', async () => {
        await navigateToAlternativeToPossession(testSession);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ alternativesToPossession: 'suspensionOfRightToBuy' })
          .expect(302);
        await testSession
          .post('/claims/alternative-to-possession')
          .send({ action: 'previous' })
          .expect(302);
        const response = await testSession
          .get('/claims/alternative-to-possession')
          .expect(200);
        expect(response.text).toMatch(/value="suspensionOfRightToBuy"[^>]*checked/);
      });

    });

    describe('Cancel button navigation', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToAlternativeToPossession(testSession);
        const response = await testSession
          .post('/claims/alternative-to-possession')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

  });

});
