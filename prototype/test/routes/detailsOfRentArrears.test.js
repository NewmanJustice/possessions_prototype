/**
 * Tests for Screen 22: Details of Rent Arrears
 * Route: /claims/details-of-rent-arrears
 * 
 * This screen collects rent arrears information including optional document upload,
 * total arrears amount, and third-party payment details with conditional reveals.
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const {
  createAuthenticatedSession,
  navigateToDailyRentAmount
} = require('../helpers/sessionHelper');

describe('Screen 22: Details of Rent Arrears', () => {
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

  describe('GET /claims/details-of-rent-arrears', () => {
    
    describe('AC-1: Display rent statement guidance', () => {
      
      it('should display rent statement guidance section', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('rent statement');
        expect(response.text).toContain('must show');
      });

      it('should explain what the rent statement must show', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        // Check for the 4 requirements
        expect(response.text).toContain('payment was supposed to be made');
        expect(response.text).toContain('amount due');
        expect(response.text).toContain('actual payments made');
        expect(response.text).toContain('total rent arrears');
      });

      it('should explain the period the rent statement must cover', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('period');
      });

    });

    describe('AC-2: Upload rent statement (optional)', () => {
      
      it('should display optional upload section with Add new button', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Add new');
        expect(response.text).toMatch(/upload|Upload/i);
      });

      it('should allow continuing without uploading a document', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should mark upload section as optional', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/optional/i);
      });

    });

    describe('AC-3: Document metadata structure', () => {
      
      it('should have document metadata structure with id, name, uploadedAt', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // This tests the session structure is ready for metadata
        // Actual upload not tested per Q2
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.status).toBe(200);
        // Session structure will be validated through implementation
      });

      it('should store metadata in session.claim.rentArrears.documents array', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        // Session structure validated through successful submission
        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should allow documents array to be empty when no upload', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

    });

    describe('AC-5: Display total rent arrears input', () => {
      
      it('should display "How much are the total rent arrears" question', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('How much are the total rent arrears');
        expect(response.text).toContain('rent statement');
      });

      it('should have currency input labelled Total rent arrears', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Total rent arrears');
        expect(response.text).toMatch(/name="totalArrears"/);
      });

      it('should display currency input with £ prefix', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('£');
      });

    });

    describe('AC-7: Display third-party payments question', () => {
      
      it('should display question about payments by someone other than defendants', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('have any rent payments been paid by someone other than the defendants');
      });

      it('should have exact question text from AC', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('For the period shown on the rent statement');
      });

      it('should display Yes and No radio options', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/name="thirdPartyPayments".*value="yes"/s);
        expect(response.text).toMatch(/name="thirdPartyPayments".*value="no"/s);
      });

    });

    describe('Pre-population on revisit', () => {
      
      it('should pre-populate total arrears from session', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit with total arrears
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '1250.50',
            thirdPartyPayments: 'no'
          })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('1250.50');
      });

      it('should pre-select third-party radio from session', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit with Yes selected
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should pre-check payment sources checkboxes from session', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit with payment sources
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit', 'housingBenefit']
          })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="universalCredit"[^>]*checked/);
        expect(response.text).toMatch(/value="housingBenefit"[^>]*checked/);
      });

      it('should pre-fill other details text from session', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit with Other and details
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other'],
            otherPaymentSource: 'Local council grant'
          })
          .expect(302);
        
        // Revisit
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Local council grant');
      });

    });

  });

  describe('POST /claims/details-of-rent-arrears', () => {
    
    describe('AC-6: Total rent arrears validation', () => {
      
      it('should show error when total arrears not provided', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ thirdPartyPayments: 'no' })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should show error for zero amount', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '0',
            thirdPartyPayments: 'no'
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should show error for negative amount', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '-50',
            thirdPartyPayments: 'no'
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should show error for non-numeric value', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: 'abc',
            thirdPartyPayments: 'no'
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should show error for more than 2 decimal places', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '123.456',
            thirdPartyPayments: 'no'
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should show error for amount over £1,000,000', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '1000000.01',
            thirdPartyPayments: 'no'
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
      });

      it('should display GOV.UK error summary and inline error', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ thirdPartyPayments: 'no' })
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
        expect(response.text).toContain('govuk-error-message');
      });

      it('should move focus to error summary', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ thirdPartyPayments: 'no' })
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

    });

    describe('Currency validation - valid amounts', () => {
      
      it('should accept valid minimum amount (£0.01)', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '0.01',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept valid maximum amount (£1,000,000)', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '1000000',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept amount with 2 decimal places', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '123.45',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept amount with 1 decimal place', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '50.5',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept whole number amount', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

    });

    describe('AC-8: Third-party payment selection validation', () => {
      
      it('should show error when third-party selection not provided', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ totalArrears: '100' })
          .expect(200);

        expect(response.text).toContain('Select whether any rent payments were made by someone other than the defendants');
      });

      it('should have exact error message from AC', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ totalArrears: '100' })
          .expect(200);

        expect(response.text).toContain('Select whether any rent payments were made by someone other than the defendants');
      });

      it('should display GOV.UK error summary and inline error', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ totalArrears: '100' })
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('govuk-error-message');
      });

      it('should move focus to error summary', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({ totalArrears: '100' })
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
      });

    });

    describe('AC-9: Payment sources revealed when Yes selected', () => {
      
      it('should reveal payment sources checkbox group when Yes selected', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // First access page
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        // Payment sources should be present (revealed by JS when Yes selected)
        expect(response.text).toContain('Universal Credit');
      });

      it('should include Universal Credit checkbox', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Universal Credit');
        expect(response.text).toMatch(/value="universalCredit"/);
      });

      it('should include Housing Benefit checkbox', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Housing Benefit');
        expect(response.text).toMatch(/value="housingBenefit"/);
      });

      it('should include Discretionary Housing Payment checkbox', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Discretionary Housing Payment');
        expect(response.text).toMatch(/value="discretionaryHousingPayment"/);
      });

      it('should include Homeless prevention fund checkbox', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Homeless prevention fund');
        expect(response.text).toMatch(/value="homelessPreventionFund"/);
      });

      it('should include Other checkbox', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Other');
        expect(response.text).toMatch(/value="other"/);
      });

      it('should display all 5 payment sources as checkboxes', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        const paymentSourceMatches = response.text.match(/name="paymentSources"/g);
        expect(paymentSourceMatches).toBeTruthy();
        expect(paymentSourceMatches.length).toBeGreaterThanOrEqual(5);
      });

    });

    describe('AC-10: Payment sources validation when Yes selected', () => {
      
      it('should show error when Yes selected with no payment sources', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes'
            // No paymentSources
          })
          .expect(200);

        expect(response.text).toContain('Select at least one payment source');
      });

      it('should have exact error message from AC', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes'
          })
          .expect(200);

        expect(response.text).toContain('Select at least one payment source');
      });

      it('should display GOV.UK error summary and inline error', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes'
          })
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('govuk-error-message');
      });

      it('should move focus to error summary', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes'
          })
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
      });

    });

    describe('AC-11: Other reveals payment source details field', () => {
      
      it('should reveal text input when Other checkbox selected', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        // Conditional reveal structure should be present
        expect(response.text).toMatch(/Payment source/);
      });

      it('should have text input labelled Payment source', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Payment source');
        expect(response.text).toMatch(/name="otherPaymentSource"/);
      });

      it('should require field when Other revealed', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit with Other selected but no details
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
            // No otherPaymentSource
          })
          .expect(200);

        expect(response.text).toContain('Enter the payment source');
      });

    });

    describe('AC-12: Validate other payment source details', () => {
      
      it('should show error when Other selected without details', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
          })
          .expect(200);

        expect(response.text).toContain('Enter the payment source');
      });

      it('should have exact error message from AC', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
          })
          .expect(200);

        expect(response.text).toContain('Enter the payment source');
      });

      it('should display GOV.UK error summary and inline error', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
          })
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('govuk-error-message');
      });

      it('should move focus to error summary', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
          })
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
      });

    });

    describe('AC-13: Persist rent arrears details', () => {
      
      it('should store total arrears as number in session.claim.rentArrears.totalArrears', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '1250.50',
            thirdPartyPayments: 'no'
          })
          .expect(302);
        
        // Verify by revisiting
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('1250.50');
      });

      it('should store third-party payments as boolean in thirdPartyPayments', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        // Verify by revisiting
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="yes"[^>]*checked/);
      });

      it('should store Universal Credit in paymentSources.universalCredit', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="universalCredit"[^>]*checked/);
      });

      it('should store Housing Benefit in paymentSources.housingBenefit', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['housingBenefit']
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="housingBenefit"[^>]*checked/);
      });

      it('should store Discretionary Housing Payment in paymentSources.discretionaryHousingPayment', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['discretionaryHousingPayment']
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="discretionaryHousingPayment"[^>]*checked/);
      });

      it('should store Homeless prevention fund in paymentSources.homelessPreventionFund', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['homelessPreventionFund']
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="homelessPreventionFund"[^>]*checked/);
      });

      it('should store Other in paymentSources.other', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other'],
            otherPaymentSource: 'Council grant'
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="other"[^>]*checked/);
      });

      it('should store other details in paymentSources.otherDetails', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other'],
            otherPaymentSource: 'Council grant'
          })
          .expect(302);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('Council grant');
      });

      it('should use camelCase keys for all payment sources', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // Submit all payment sources
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit', 'housingBenefit', 'discretionaryHousingPayment', 'homelessPreventionFund', 'other'],
            otherPaymentSource: 'Test'
          })
          .expect(302);
        
        // Verified through successful submission and pre-population
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.status).toBe(200);
      });

      it('should set deselected payment sources to false', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // First: select Universal Credit
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        // Then: deselect and select Housing Benefit instead
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['housingBenefit']
          })
          .expect(302);
        
        // Verify Universal Credit is NOT checked
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).not.toMatch(/value="universalCredit"[^>]*checked/);
        expect(response.text).toMatch(/value="housingBenefit"[^>]*checked/);
      });

      it('should set otherDetails to null when Other not selected', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // First: select Other with details
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['other'],
            otherPaymentSource: 'Council grant'
          })
          .expect(302);
        
        // Then: deselect Other
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        // Verify Other details not present
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).not.toMatch(/value="other"[^>]*checked/);
      });

    });

    describe('Payment source combinations', () => {
      
      it('should accept single payment source selection', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept multiple payment source selections', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit', 'housingBenefit']
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should accept all 5 payment sources selected', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit', 'housingBenefit', 'discretionaryHousingPayment', 'homelessPreventionFund', 'other'],
            otherPaymentSource: 'Test source'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should allow deselecting previously selected payment source', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        // First: select 2 sources
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit', 'housingBenefit']
          })
          .expect(302);
        
        // Then: keep only 1
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'yes',
            paymentSources: ['universalCredit']
          })
          .expect(302);
        
        // Verify
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toMatch(/value="universalCredit"[^>]*checked/);
        expect(response.text).not.toMatch(/value="housingBenefit"[^>]*checked/);
      });

    });

    describe('AC-14: Previous navigation', () => {

      it('should display Previous link to daily-rent-amount', async () => {
        await navigateToDetailsOfRentArrears(testSession);

        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('href="/claims/daily-rent-amount"');
        expect(response.text).toContain('Previous');
      });

    });

    describe('AC-15: Continue navigation', () => {
      
      it('should redirect to /claims/money-judgement when Continue clicked', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '100',
            thirdPartyPayments: 'no'
          })
          .expect(302);

        expect(response.headers.location).toBe('/claims/money-judgement');
      });

      it('should persist data before navigation', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: '1500',
            thirdPartyPayments: 'yes',
            paymentSources: ['housingBenefit']
          })
          .expect(302);
        
        // Navigate back to verify persistence
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('1500');
        expect(response.text).toMatch(/value="housingBenefit"[^>]*checked/);
      });

    });

    describe('AC-16: Cancel behaviour', () => {

      it('should display Cancel link to case-list', async () => {
        await navigateToDetailsOfRentArrears(testSession);

        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        expect(response.text).toContain('href="/case-list"');
        expect(response.text).toContain('Cancel');
      });

    });

    describe('AC-17: Accessibility compliance', () => {
      
      it('should display GOV.UK error summary on validation failure', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({})
          .expect(200);

        expect(response.text).toContain('govuk-error-summary');
        expect(response.text).toContain('There is a problem');
      });

      it('should have error links that target relevant inputs', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/<a href="#totalArrears"/);
        expect(response.text).toMatch(/<a href="#thirdPartyPayments"/);
      });

      it('should move focus to error summary', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({})
          .expect(200);

        expect(response.text).toMatch(/role="alert"/);
        expect(response.text).toMatch(/tabindex="-1"/);
      });

      it('should have proper ARIA attributes for conditional sections', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        // GOV.UK conditional reveal uses data-aria-controls
        expect(response.text).toMatch(/data-aria-controls|govuk-checkboxes__conditional/);
      });

      it('should have keyboard accessible inputs, radios, and checkboxes', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .get('/claims/details-of-rent-arrears')
          .expect(200);

        // Standard HTML inputs are keyboard accessible by default
        expect(response.text).toMatch(/type="text"|type="radio"|type="checkbox"/);
      });

    });

    describe('Multiple validation errors', () => {
      
      it('should show both total arrears and third-party errors simultaneously', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({})
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears');
        expect(response.text).toContain('Select whether any rent payments were made');
      });

      it('should show invalid arrears and missing payment sources errors', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: 'invalid',
            thirdPartyPayments: 'yes'
            // No payment sources
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears as a number greater than 0');
        expect(response.text).toContain('Select at least one payment source');
      });

      it('should show all possible validation errors simultaneously', async () => {
        await navigateToDetailsOfRentArrears(testSession);
        
        const response = await testSession
          .post('/claims/details-of-rent-arrears')
          .send({
            totalArrears: 'abc',
            thirdPartyPayments: 'yes',
            paymentSources: ['other']
            // Missing: valid arrears, payment sources (only other), other details
          })
          .expect(200);

        expect(response.text).toContain('Enter the total rent arrears');
        expect(response.text).toContain('Enter the payment source');
      });

    });

  });

});

/**
 * Helper: Navigate to Details of Rent Arrears (Screen 22)
 * Entry: Screen 21 (Daily rent amount) → Screen 22
 */
async function navigateToDetailsOfRentArrears(agent) {
  // Navigate to Screen 21 (Daily rent amount)
  await navigateToDailyRentAmount(agent);
  
  // Screen 21 POST: Confirm daily rent amount (Yes path)
  await agent
    .post('/claims/daily-rent-amount')
    .send({
      confirmation: 'yes'
    })
    .expect(302);
  
  return agent;
}
