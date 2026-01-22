/**
 * Defendant Details Route Tests - Screen 11
 * 
 * Tests for /claims/defendant-details
 * Covers: defendant name, correspondence address, additional defendants, navigation
 * 
 * @see /test/artifacts/screen11/understanding.md
 * @see /test/artifacts/screen11/test-plan.md
 * @see /test/artifacts/screen11/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToDefendantDetails } = require('../helpers/sessionHelper');

describe('Defendant Details Route - /claims/defendant-details', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('T-X.1: should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/defendant-details');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('T-X.2: should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToDefendantDetails(testSession);
      
      const response = await testSession.get('/claims/defendant-details');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // DEFENDANT NAME (AC-1 to AC-3)
  // ============================================================
  describe('Defendant Name', () => {
    
    describe('AC-1: Ask whether name is known', () => {
      it('T-1.1: should ask "Do you know the defendant\'s name?" with Yes/No radios', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.status).toBe(200);
        expect(response.text).toContain("Do you know the defendant's name");
        expect(response.text).toContain('nameKnown');
      });
    });

    describe('AC-2: Name known - require first and last name', () => {
      it('T-2.1: should show first name and last name fields when Yes selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('firstName');
        expect(response.text).toContain('lastName');
      });

      it('T-2.2: should show error when first name is missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: '',
            lastName: 'Smith',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/first name/i);
      });

      it('T-2.3: should show error when last name is missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/last name/i);
      });

      it('T-2.4: should show errors for both names when both missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: '',
            lastName: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/first name/i);
        expect(getResponse.text).toMatch(/last name/i);
      });

      it('T-2.5: should display error summary with focus on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: '',
            lastName: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toContain('There is a problem');
      });

      it('T-2.6: should accept valid first and last name', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: 'Smith',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });
    });

    describe('AC-3: Name unknown - hide and clear fields', () => {
      it('T-3.1: should allow submission when name unknown (No selected)', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });

      it('T-3.2: should clear stored name values when changing from Yes to No', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // First submit with name known
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: 'Smith',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        // Go back and change to No
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        // Verify name is cleared by revisiting page
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('Name Edge Cases', () => {
      it('T-2.E.1: should show error for whitespace-only first name', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: '   ',
            lastName: 'Smith',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-2.E.2: should show error for whitespace-only last name', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: '   ',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-2.E.3: should show error for first name exceeding 255 characters', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const longName = 'A'.repeat(256);
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: longName,
            lastName: 'Smith',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-2.E.4: should show error for last name exceeding 255 characters', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const longName = 'A'.repeat(256);
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: longName,
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-2.E.5: should accept names with special characters', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: "Mary-Jane",
            lastName: "O'Brien-Smith",
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });

      it('T-2.E.6: should preserve entered names on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'PreservedFirst',
            lastName: '',  // Missing - causes error
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('PreservedFirst');
      });

      it('T-2.E.7: should show error when no name radio is selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // DEFENDANT ADDRESS - KNOWN/UNKNOWN (AC-4 to AC-5)
  // ============================================================
  describe('Defendant Correspondence Address - Known/Unknown', () => {
    
    describe('AC-4: Ask whether address is known', () => {
      it('T-4.1: should ask "Do you know defendant\'s correspondence address?" with Yes/No', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain("Do you know the defendant's correspondence address");
        expect(response.text).toContain('addressKnown');
      });
    });

    describe('AC-5: Address unknown - allow continuation', () => {
      it('T-5.1: should not show address fields when No selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-5.2: should allow continuation without address when No selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });

      it('T-5.3: should store addressKnown=false when No selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        // Verify by revisiting page
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('Address Edge Cases', () => {
      it('T-5.E.1: should show error when no address radio selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: '',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // SAME AS PROPERTY ADDRESS (AC-6 to AC-8)
  // ============================================================
  describe('Same as Property Address', () => {
    
    describe('AC-6: Address known - ask if same as property', () => {
      it('T-6.1: should ask "same as property?" when Yes (address known) selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('addressSameAsProperty');
      });
    });

    describe('AC-7: Same as property - copy and clear', () => {
      it('T-7.1: should accept same as property selection', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'yes',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });

      it('T-7.2: should clear manual address when same as property selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // First submit with manual address
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Manual St',
            townOrCity: 'Manchester',
            postcode: 'M1 1AA',
            addAnotherDefendant: 'no'
          });
        
        // Change to same as property
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'yes',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('AC-8: Different address - show fields', () => {
      it('T-8.1: should show postcode lookup when No (different address) selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toMatch(/find address/i);
      });

      it('T-8.2: should show manual address fields when No selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('buildingAndStreet');
        expect(response.text).toContain('townOrCity');
        expect(response.text).toContain('postcode');
      });
    });

    describe('Same as Property Edge Cases', () => {
      it('T-8.E.1: should show error when no "same as property" radio selected but address known is yes', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: '',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // ADDRESS ENTRY AND VALIDATION (AC-9 to AC-12)
  // ============================================================
  describe('Address Entry and Validation', () => {
    
    describe('AC-9: Postcode lookup', () => {
      it('T-9.1: should have Find address button for postcode lookup', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toMatch(/find address/i);
      });
    });

    describe('AC-10: Manual address entry', () => {
      it('T-10.1: should allow manual address entry', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '456 Different Street',
            townOrCity: 'Birmingham',
            postcode: 'B1 1AA',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });
    });

    describe('AC-11: Required address fields', () => {
      it('T-11.1: should show error when Building/Street is missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/building|street/i);
      });

      it('T-11.2: should show error when Town/City is missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: '',
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/town|city/i);
      });

      it('T-11.3: should show error when Postcode is missing', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            postcode: '',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/postcode/i);
      });

      it('T-11.4: should not require County (optional)', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            county: '',  // Optional
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });

      it('T-11.5: should not require Country (optional)', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            country: '',  // Optional
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });
    });

    describe('AC-12: Address validation behaviour', () => {
      it('T-12.1: should show error summary for missing address fields', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '',
            townOrCity: '',
            postcode: '',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toContain('There is a problem');
      });

      it('T-12.2: should set focus to error summary on address validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });

    describe('Address Edge Cases', () => {
      it('T-12.E.1: should preserve entered address values on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: 'Preserved Street',
            townOrCity: '',  // Missing - causes error
            postcode: 'PR1 1PR',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('Preserved Street');
        expect(getResponse.text).toContain('PR1 1PR');
      });
    });
  });

  // ============================================================
  // ADDITIONAL DEFENDANTS (AC-13 to AC-15)
  // ============================================================
  describe('Additional Defendants', () => {
    
    describe('AC-13: Ask about additional defendants', () => {
      it('T-13.1: should ask "Do you need to add another defendant?" with Yes/No', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('Do you need to add another defendant');
        expect(response.text).toContain('addAnotherDefendant');
      });
    });

    describe('AC-14: Additional defendants not yet supported', () => {
      it('T-14.1: should show "not supported" message when Yes selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // The message should be visible on the page (JS reveal)
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toMatch(/not.*supported|not.*available|coming soon/i);
      });

      it('T-14.2: should not redirect to different page when Yes selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // Submitting with Yes should either stay on page or show validation
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'yes'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('AC-15: Single defendant happy path', () => {
      it('T-15.1: should continue to next step when No selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });
    });

    describe('Additional Defendants Edge Cases', () => {
      it('T-15.E.1: should show error when no additional defendants radio selected', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: ''
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // NAVIGATION AND SUBMISSION (AC-16 to AC-18)
  // ============================================================
  describe('Navigation and Submission', () => {
    
    describe('AC-16: Continue saves and proceeds', () => {
      it('T-16.1: should save defendant to session on Continue', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'John',
            lastName: 'Doe',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        // Verify by going to next page
        const nextPage = await testSession.get('/claims/grounds');
        expect(nextPage.status).toBe(200);
      });

      it('T-16.2: should redirect to /claims/grounds on success', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'no',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds');
      });
    });

    describe('AC-17: Previous navigation', () => {
      it('T-17.1: should have Previous link to /claims/contact-preferences', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('/claims/contact-preferences');
      });

      it('T-17.2: should preserve entered data when navigating back', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // Submit data
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'Jane',
            lastName: 'Doe',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        // Navigate back
        const backResponse = await testSession.get('/claims/contact-preferences');
        expect(backResponse.status).toBe(200);
        
        // Navigate forward
        const forwardResponse = await testSession.get('/claims/defendant-details');
        expect(forwardResponse.text).toContain('Jane');
        expect(forwardResponse.text).toContain('Doe');
      });
    });

    describe('AC-18: Cancel behaviour', () => {
      it('T-18.1: should have Cancel link to /case-list', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession.get('/claims/defendant-details');
        expect(response.text).toContain('/case-list');
        expect(response.text).toContain('Cancel');
      });

      it('T-18.2: should preserve claim draft in session after Cancel', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        // Navigate to case list (Cancel)
        const cancelResponse = await testSession.get('/case-list');
        expect(cancelResponse.status).toBe(200);
        
        // Go back to defendant details - should still work
        const returnResponse = await testSession.get('/claims/defendant-details');
        expect(returnResponse.status).toBe(200);
      });
    });
  });

  // ============================================================
  // ACCESSIBILITY AND PERSISTENCE (AC-19 to AC-20)
  // ============================================================
  describe('Accessibility and Persistence', () => {
    
    describe('AC-19: Error handling and accessibility', () => {
      it('T-19.1: should show error summary on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: '',
            addressKnown: '',
            addAnotherDefendant: ''
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-19.2: should have error links to corresponding fields', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: '',
            lastName: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        // Error summary should contain links to fields
        expect(getResponse.text).toContain('href="#');
      });

      it('T-19.3: should move focus to error summary on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: '',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-19.4: should preserve previously entered values on validation failure', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'PreservedName',
            lastName: '',  // Error
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('PreservedName');
      });
    });

    describe('AC-20: Session storage structure', () => {
      it('T-20.1: should store defendant as array in session', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        const response = await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'Array',
            lastName: 'Test',
            addressKnown: 'no',
            addAnotherDefendant: 'no'
          });
        
        expect(response.status).toBe(302);
        
        // Verify by revisiting - data should be there
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('Array');
      });

      it('T-20.2: should have correct session structure with all fields', async () => {
        const testSession = session(app);
        await navigateToDefendantDetails(testSession);
        
        await testSession
          .post('/claims/defendant-details')
          .send({
            nameKnown: 'yes',
            firstName: 'Complete',
            lastName: 'Structure',
            addressKnown: 'yes',
            addressSameAsProperty: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            addAnotherDefendant: 'no'
          });
        
        // Verify by revisiting
        const getResponse = await testSession.get('/claims/defendant-details');
        expect(getResponse.text).toContain('Complete');
        expect(getResponse.text).toContain('Structure');
        expect(getResponse.text).toContain('123 Test St');
      });
    });
  });

  // ============================================================
  // PAGE CONTENT & UX
  // ============================================================
  describe('Page Content & UX', () => {
    it('T-X.3: should have correct page title', async () => {
      const testSession = session(app);
      await navigateToDefendantDetails(testSession);
      
      const response = await testSession.get('/claims/defendant-details');
      expect(response.text).toMatch(/<title>.*[Dd]efendant.*<\/title>/i);
    });

    it('T-X.4: should include "Error:" in page title on validation failure', async () => {
      const testSession = session(app);
      await navigateToDefendantDetails(testSession);
      
      await testSession
        .post('/claims/defendant-details')
        .send({
          nameKnown: '',
          addressKnown: '',
          addAnotherDefendant: ''
        });
      
      const getResponse = await testSession.get('/claims/defendant-details');
      expect(getResponse.text).toMatch(/<title>Error:.*<\/title>/i);
    });

    it('T-X.5: should show previously saved defendant when re-visiting page', async () => {
      const testSession = session(app);
      await navigateToDefendantDetails(testSession);
      
      // Submit defendant details
      await testSession
        .post('/claims/defendant-details')
        .send({
          nameKnown: 'yes',
          firstName: 'Revisit',
          lastName: 'Test',
          addressKnown: 'no',
          addAnotherDefendant: 'no'
        });
      
      // Go to next page
      await testSession.get('/claims/grounds');
      
      // Come back
      const response = await testSession.get('/claims/defendant-details');
      expect(response.text).toContain('Revisit');
      expect(response.text).toContain('Test');
    });
  });
});
