/**
 * Tests for Screen 31: Underlessee or Mortgagee Details
 * Route: /claims/underlessee-or-mortgagee-details
 */

const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToUnderlesseeOrMortgageeDetails
} = require('../helpers/sessionHelper');

describe('Screen 31: Underlessee or Mortgagee Details', () => {
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

  describe('GET /claims/underlessee-or-mortgagee-details', () => {

    describe('AC-1: Display page heading, caption, and case number', () => {

      it('should display page heading "Underlessee or mortgagee details"', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Underlessee or mortgagee details');
      });

      it('should display caption "Make a claim"', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Make a claim');
      });

      it('should display case number', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toMatch(/Case number/i);
      });

    });

    describe('AC-2: Display name section heading and question', () => {

      it('should display section heading "Underlessee or mortgagee name"', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Underlessee or mortgagee name');
      });

      it('should display name question', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Do you know the underlessee or mortgagee');
        expect(response.text).toContain('name');
      });

      it('should display Yes and No radio options for name', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toMatch(/name="knowsName"/);
      });

    });

    describe('AC-5: Display address section heading and question', () => {

      it('should display section heading for address', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('correspondence address');
      });

      it('should display Yes and No radio options for address', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toMatch(/name="knowsAddress"/);
      });

    });

    describe('AC-12: Display additional party section', () => {

      it('should display additional underlessees section', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Additional underlessees or mortgagees');
      });

      it('should display Yes and No radio for additional', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toMatch(/name="hasAdditional"/);
      });

    });

  });

  describe('POST /claims/underlessee-or-mortgagee-details', () => {

    describe('AC-16: Name question selection is required', () => {

      it('should show error when knowsName not selected', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ knowsAddress: 'no', hasAdditional: 'no' })
          .expect(200);
        expect(response.text).toContain('Select yes if you know the underlessee or mortgagee');
      });

      it('should display GOV.UK error summary', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
      });

    });

    describe('AC-17: Name is required when Yes selected', () => {

      it('should show error when Yes selected but name empty', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ knowsName: 'yes', name: '', knowsAddress: 'no', hasAdditional: 'no' })
          .expect(200);
        expect(response.text).toContain('Enter the underlessee or mortgagee');
      });

    });

    describe('AC-18: Address question selection is required', () => {

      it('should show error when knowsAddress not selected', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ knowsName: 'no', hasAdditional: 'no' })
          .expect(200);
        expect(response.text).toContain('Select yes if you know the underlessee or mortgagee');
        expect(response.text).toContain('address');
      });

    });

    describe('AC-19: Required address fields validation', () => {

      it('should show error when address Yes but fields missing', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ knowsName: 'no', knowsAddress: 'yes', hasAdditional: 'no' })
          .expect(200);
        expect(response.text).toContain('Enter the building and street');
      });

      it('should show error for missing town or city', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({
            knowsName: 'no',
            knowsAddress: 'yes',
            buildingAndStreet: '123 Test St',
            hasAdditional: 'no'
          })
          .expect(200);
        expect(response.text).toContain('Enter the town or city');
      });

      it('should show error for missing postcode', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({
            knowsName: 'no',
            knowsAddress: 'yes',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            hasAdditional: 'no'
          })
          .expect(200);
        expect(response.text).toContain('Enter the postcode');
      });

    });

    describe('AC-20: Additional party question selection is required', () => {

      it('should show error when hasAdditional not selected', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ knowsName: 'no', knowsAddress: 'no' })
          .expect(200);
        expect(response.text).toContain('Select yes if you need to add another');
      });

    });

    describe('AC-21: Persist underlessee/mortgagee details', () => {

      it('should store data and redirect on valid submission', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({
            knowsName: 'yes',
            name: 'Test Person',
            knowsAddress: 'yes',
            buildingAndStreet: '123 Test Street',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            hasAdditional: 'no'
          })
          .expect(302);
        expect(response.headers.location).toBeDefined();
      });

    });

    describe('AC-22: Preserve selections on revisit', () => {

      it('should pre-fill name when revisiting', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({
            knowsName: 'yes',
            name: 'Test Person',
            knowsAddress: 'no',
            hasAdditional: 'no'
          });
        const response = await testSession
          .get('/claims/underlessee-or-mortgagee-details')
          .expect(200);
        expect(response.text).toContain('Test Person');
      });

    });

    describe('AC-23: Previous navigation', () => {

      it('should redirect to underlessee-or-mortgagee when Previous clicked', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ action: 'previous' })
          .expect(302);
        expect(response.headers.location).toBe('/claims/underlessee-or-mortgagee');
      });

    });

    describe('AC-24: Continue navigation', () => {

      it('should redirect to next screen on valid submission', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({
            knowsName: 'no',
            knowsAddress: 'no',
            hasAdditional: 'no'
          })
          .expect(302);
        expect(response.headers.location).toBeDefined();
        expect(response.headers.location).not.toBe('/claims/underlessee-or-mortgagee-details');
      });

    });

    describe('AC-25: Cancel behaviour', () => {

      it('should redirect to case-list when Cancel clicked', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({ action: 'cancel' })
          .expect(302);
        expect(response.headers.location).toBe('/case-list');
      });

    });

    describe('AC-26: Accessibility compliance', () => {

      it('should display error summary on validation failure', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({})
          .expect(200);
        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error summary with tabindex for focus', async () => {
        await navigateToUnderlesseeOrMortgageeDetails(testSession);
        const response = await testSession
          .post('/claims/underlessee-or-mortgagee-details')
          .send({})
          .expect(200);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

    });

  });

});
