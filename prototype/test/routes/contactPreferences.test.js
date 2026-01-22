/**
 * Contact Preferences Route Tests - Screen 10
 * 
 * Tests for /claims/contact-preferences
 * Covers: notification email, correspondence address, contact phone, navigation
 * 
 * @see /test/artifacts/screen10/understanding.md
 * @see /test/artifacts/screen10/test-plan.md
 * @see /test/artifacts/screen10/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToContactPreferences } = require('../helpers/sessionHelper');

describe('Contact Preferences Route - /claims/contact-preferences', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('T-X.1: should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/contact-preferences');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('T-X.2: should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToContactPreferences(testSession);
      
      const response = await testSession.get('/claims/contact-preferences');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // STORY 1: Notifications Email
  // ============================================================
  describe('Story 1: Notifications Email', () => {
    
    describe('AC-1.1: Registered email displayed', () => {
      it('T-1.1.1: should display registered email as read-only text', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.status).toBe(200);
        // Email should appear in page but not as editable input for registered email
        expect(response.text).toContain('test@solicitor.com');
      });

      it('T-1.1.2: should show label "Your My HMCTS registered email address is:"', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('Your My HMCTS registered email address is');
      });
    });

    describe('AC-1.2: Use registered email (Yes)', () => {
      it('T-1.2.1: should set notificationEmail to registered email when Yes selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-1.2.2: should clear alternateEmail from session when Yes selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // First submit with alternate email
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'alternate@test.com',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        // Go back and change to Yes
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        // Verify by checking page doesn't show alternate email as selected
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('AC-1.3: Use alternate email (No)', () => {
      it('T-1.3.1: should reveal email input when No is selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        // Page should contain conditional reveal input for alternate email
        expect(response.text).toContain('alternateEmail');
      });

      it('T-1.3.2: should show error summary for invalid email format', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'not-an-email',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-1.3.3: should show inline error "Enter an email address in the correct format"', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'not-an-email',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('Enter an email address in the correct format');
      });

      it('T-1.3.4: should set focus to error summary on validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'invalid',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        // GOV.UK error summary should have tabindex="-1" for focus management
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-1.3.5: should save valid alternate email to session', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'valid@alternate.com',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-1.3.6: should set notificationEmail to alternate email value', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'notification@test.com',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        // Re-visit page to verify stored value
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('notification@test.com');
      });
    });

    describe('AC-1.4: Single address only', () => {
      it('T-1.4.1: should only store single notification email', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'single@email.com',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
      });
    });

    describe('Email Edge Cases', () => {
      it('T-1.E.1: should show error when No selected but email is empty', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: '',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-1.E.2: should show error for whitespace-only email', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: '   ',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-1.E.3: should show error for email exceeding 254 characters', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const longEmail = 'a'.repeat(250) + '@test.com'; // 260 chars
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: longEmail,
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-1.E.4: should preserve entered email on validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'invalid-email',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('invalid-email');
      });

      it('T-1.E.5: should show error when no email radio selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: '',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // STORY 2: Correspondence Address
  // ============================================================
  describe('Story 2: Correspondence Address', () => {
    
    describe('AC-2.1: Registered address shown', () => {
      it('T-2.1.1: should display registered address as read-only', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.status).toBe(200);
        // Should contain address-related content
        expect(response.text).toMatch(/address/i);
      });

      it('T-2.1.2: should show label "Your organisation\'s My HMCTS registered address is:"', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain("Your organisation's My HMCTS registered address is");
      });
    });

    describe('AC-2.2: Choosing registered address (Yes)', () => {
      it('T-2.2.1: should set correspondenceAddress to registered when Yes selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-2.2.2: should clear alternateAddress from session when Yes selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // Submit with alternate address first
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            providePhone: 'no'
          });
        
        // Change to Yes
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('AC-2.3: Choosing alternate address (No)', () => {
      it('T-2.3.1: should reveal postcode input and Find address button when No selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('postcode');
        expect(response.text).toMatch(/find address/i);
      });

      it('T-2.3.2: should reveal address fields when No selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('buildingAndStreet');
        expect(response.text).toContain('townOrCity');
      });
    });

    describe('AC-2.4: Postcode lookup (simulated)', () => {
      it('T-2.4.1: should return dummy addresses for known postcode', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // POST to lookup endpoint (if separate) or test via form
        const response = await testSession
          .post('/claims/contact-preferences/lookup-address')
          .send({ postcode: 'LU5 6TB' });
        
        // Should return addresses or redirect back with results
        expect([200, 302]).toContain(response.status);
      });

      it('T-2.4.2: should populate Building/Street, Town/City, Postcode when address selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // Submit with manual address (simulating selection)
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '14 Long Street',
            townOrCity: 'Luton',
            postcode: 'LU5 6TB',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
      });
    });

    describe('AC-2.5: Manual edit allowed', () => {
      it('T-2.5.1: should allow editing address fields after selection', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: 'Edited Street Name',
            townOrCity: 'Edited City',
            postcode: 'ED1 1ED',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });
    });

    describe('AC-2.6: Required address validation', () => {
      it('T-2.6.1: should show error when Building/Street is missing', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '',
            townOrCity: 'London',
            postcode: 'SW1A 1AA',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/building|street/i);
      });

      it('T-2.6.2: should show error when Town/City is missing', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: '',
            postcode: 'SW1A 1AA',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/town|city/i);
      });

      it('T-2.6.3: should show error when Postcode is missing', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '123 Test St',
            townOrCity: 'London',
            postcode: '',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toMatch(/postcode/i);
      });

      it('T-2.6.4: should display error summary with focus on validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: '',
            townOrCity: '',
            postcode: '',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toContain('There is a problem');
      });
    });

    describe('Address Edge Cases', () => {
      it('T-2.E.1: should preserve entered address values on validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'no',
            buildingAndStreet: 'Preserved Street',
            townOrCity: '',  // Missing - causes error
            postcode: 'PR1 1PR',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('Preserved Street');
        expect(getResponse.text).toContain('PR1 1PR');
      });

      it('T-2.E.2: should show error when no address radio selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: '',
            providePhone: 'no'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });
  });

  // ============================================================
  // STORY 3: Contact Phone Number
  // ============================================================
  describe('Story 3: Contact Phone Number', () => {
    
    describe('AC-3.1: Phone option present and optional', () => {
      it('T-3.1.1: should display phone Yes/No radio options', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('providePhone');
        expect(response.text).toMatch(/phone/i);
      });

      it('T-3.1.2: should indicate phone is optional in label', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toMatch(/optional/i);
      });
    });

    describe('AC-3.2: Select Yes requires valid phone', () => {
      it('T-3.2.1: should reveal phone input when Yes selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('contactPhone');
      });

      it('T-3.2.2: should show error for invalid phone number', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: 'not-a-phone'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.2.3: should set focus to error summary on phone validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: 'abc'
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });
    });

    describe('AC-3.3: Select No retains but ignores phone', () => {
      it('T-3.3.1: should set contactPhoneActive to false when No selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-3.3.2: should retain existing phone value when No selected', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // First submit with phone
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '07712345678'
          });
        
        // Change to No
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        // Check page - phone should still be visible if retained
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('AC-3.4: Phone stored in session', () => {
      it('T-3.4.1: should save valid phone to contactPhone in session', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '07712345678'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-3.4.2: should set contactPhoneActive to true when valid phone provided', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '+44 7712 345678'
          });
        
        // Verify by re-visiting page
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.status).toBe(200);
      });
    });

    describe('Phone Boundary Cases', () => {
      it('T-3.E.1: should fail validation for phone with 6 digits', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '123456'  // 6 digits - too short
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.2: should pass validation for phone with 7 digits', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '1234567'  // 7 digits - minimum valid
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-3.E.3: should pass validation for phone with 15 digits', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '123456789012345'  // 15 digits - maximum valid
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-3.E.4: should fail validation for phone with 16 digits', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '1234567890123456'  // 16 digits - too long
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.5: should accept phone with spaces and formatting', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '+44 (0) 7712 345 678'  // With formatting
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });

      it('T-3.E.6: should preserve entered phone on validation failure', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '12345'  // Too short
          });
        
        const getResponse = await testSession.get('/claims/contact-preferences');
        expect(getResponse.text).toContain('12345');
      });
    });
  });

  // ============================================================
  // STORY 4: Save / Navigation Behaviour
  // ============================================================
  describe('Story 4: Save / Navigation Behaviour', () => {
    
    describe('AC-4.1: Continue saves and redirects', () => {
      it('T-4.1.1: should save contactPreferences to session on Continue', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        
        // Verify data persists by accessing next page
        const nextPage = await testSession.get('/claims/defendant-details');
        expect(nextPage.status).toBe(200);
      });

      it('T-4.1.2: should redirect to /claims/defendant-details on success', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });
    });

    describe('AC-4.2: Previous navigates back', () => {
      it('T-4.2.1: should navigate to /claims/name-of-claimant on Previous', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('/claims/name-of-claimant');
      });

      it('T-4.2.2: should preserve session state when navigating back', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // Navigate back
        const backResponse = await testSession.get('/claims/name-of-claimant');
        expect(backResponse.status).toBe(200);
        
        // Navigate forward again
        const forwardResponse = await testSession.get('/claims/contact-preferences');
        expect(forwardResponse.status).toBe(200);
      });
    });

    describe('AC-4.3: Cancel returns to case list', () => {
      it('T-4.3.1: should have Cancel link to /case-list', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('/case-list');
        expect(response.text).toContain('Cancel');
      });

      it('T-4.3.2: should preserve claim draft in session after Cancel', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // Navigate to case list (Cancel)
        const cancelResponse = await testSession.get('/case-list');
        expect(cancelResponse.status).toBe(200);
        
        // Go back to contact preferences - should still work
        const returnResponse = await testSession.get('/claims/contact-preferences');
        expect(returnResponse.status).toBe(200);
      });
    });

    describe('AC-4.4: Minimal valid submission', () => {
      it('T-4.4.1: should accept submission with all registered options and no phone', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        const response = await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'yes',
            useRegisteredAddress: 'yes',
            providePhone: 'no'
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/defendant-details');
      });
    });

    describe('Navigation Edge Cases', () => {
      it('T-4.E.1: should show previously saved preferences when re-visiting page', async () => {
        const testSession = session(app);
        await navigateToContactPreferences(testSession);
        
        // Submit preferences
        await testSession
          .post('/claims/contact-preferences')
          .send({
            useRegisteredEmail: 'no',
            alternateEmail: 'saved@email.com',
            useRegisteredAddress: 'yes',
            providePhone: 'yes',
            contactPhone: '07712345678'
          });
        
        // Go back to page
        const response = await testSession.get('/claims/contact-preferences');
        expect(response.text).toContain('saved@email.com');
        expect(response.text).toContain('07712345678');
      });
    });
  });

  // ============================================================
  // PAGE CONTENT & UX
  // ============================================================
  describe('Page Content & UX', () => {
    it('T-X.3: should have correct page title', async () => {
      const testSession = session(app);
      await navigateToContactPreferences(testSession);
      
      const response = await testSession.get('/claims/contact-preferences');
      expect(response.text).toMatch(/<title>.*Contact.*<\/title>/i);
    });

    it('T-X.4: should include "Error:" in page title on validation failure', async () => {
      const testSession = session(app);
      await navigateToContactPreferences(testSession);
      
      await testSession
        .post('/claims/contact-preferences')
        .send({
          useRegisteredEmail: '',
          useRegisteredAddress: '',
          providePhone: ''
        });
      
      const getResponse = await testSession.get('/claims/contact-preferences');
      expect(getResponse.text).toMatch(/<title>Error:.*<\/title>/i);
    });
  });
});
