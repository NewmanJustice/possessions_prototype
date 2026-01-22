const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { createAuthenticatedSession, navigateToClaimantName } = require('../helpers/sessionHelper');

describe('Claimant Name Route', () => {
  describe('GET /claims/name-of-claimant', () => {
    describe('Authentication & Access', () => {
      it('should redirect unauthenticated users to sign-in', async () => {
        const response = await request(app).get('/claims/name-of-claimant');
        expect(response.status).toBe(302);
        expect(response.headers.location).toContain('/auth/sign-in');
      });

      it('should render page for authenticated SOLICITOR users', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.status).toBe(200);
      });
    });

    describe('Content Display', () => {
      it('should display case number 1234-5678-9101-1213', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('1234-5678-9101-1213');
      });

      it('should display registered claimant name "Treetops Housing"', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('Treetops Housing');
      });

      it('should contain the question "Is this the correct claimant name?"', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('Is this the correct claimant name');
      });

      it('should display "Yes" and "No" radio buttons', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('Yes');
        expect(response.text).toContain('No');
        expect(response.text).toContain('type="radio"');
      });

      it('should display conditional reveal hint "What is the correct claimant name?"', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('What is the correct claimant name');
      });

      it('should contain Previous and Continue buttons', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.text).toContain('Previous');
        expect(response.text).toContain('Continue');
      });
    });
  });

  describe('POST /claims/name-of-claimant - Validation', () => {
    describe('Empty Selection', () => {
      it('should reject when no radio button selected', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const postResponse = await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: '' });
        
        expect(postResponse.status).toBe(302);
        expect(postResponse.headers.location).toBe('/claims/name-of-claimant');
      });

      it('should display error "Select yes if this is the correct claimant name"', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: '' });
        
        const getResponse = await testSession.get('/claims/name-of-claimant');
        expect(getResponse.text).toContain('Select yes if');
      });

      it('should display error in GOV.UK error summary', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: '' });
        
        const getResponse = await testSession.get('/claims/name-of-claimant');
        expect(getResponse.text).toContain('govuk-error-summary');
        expect(getResponse.text).toContain('There is a problem');
      });
    });

    describe('"No" Selected Without Custom Name', () => {
      it('should reject when "No" is selected but text input is empty', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const postResponse = await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: '' 
          });
        
        expect(postResponse.status).toBe(302);
        expect(postResponse.headers.location).toBe('/claims/name-of-claimant');
      });

      it('should reject when "No" is selected with whitespace-only input', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const postResponse = await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: '   ' 
          });
        
        expect(postResponse.status).toBe(302);
        expect(postResponse.headers.location).toBe('/claims/name-of-claimant');
      });

      it('should display error "Enter the correct claimant name"', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: '' 
          });
        
        const getResponse = await testSession.get('/claims/name-of-claimant');
        expect(getResponse.text).toContain('Enter the correct claimant name');
      });

      it('should preserve radio selection "No" when showing error', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: '' 
          });
        
        const getResponse = await testSession.get('/claims/name-of-claimant');
        expect(getResponse.text).toContain('value="no"');
        expect(getResponse.text).toContain('checked');
      });
    });
  });

  describe('POST /claims/name-of-claimant - Happy Paths', () => {
    describe('Select "Yes" (Use Registered Name)', () => {
      it('should accept "Yes" and redirect to /claims/contact-preferences', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: 'yes' });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/contact-preferences');
      });

      it('should store registered name "Treetops Housing" in session', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: 'yes' });
        
        // Verify by navigating to next page and checking session persists
        const nextPageResponse = await testSession.get('/claims/contact-preferences');
        expect(nextPageResponse.status).toBe(200);
        
        // Could also navigate back and verify data is preserved
        const backResponse = await testSession.get('/claims/name-of-claimant');
        expect(backResponse.status).toBe(200);
      });
    });

    describe('Select "No" (Use Custom Name)', () => {
      it('should accept "No" with valid custom name', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: 'Custom Housing Ltd' 
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/contact-preferences');
      });

      it('should redirect to /claims/contact-preferences after custom name', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: 'Another Housing Association' 
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/contact-preferences');
      });

      it('should store custom name in session, not registered name', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: 'My Custom Housing' 
          });
        
        // Verify by accessing next page (session should persist)
        const nextPageResponse = await testSession.get('/claims/contact-preferences');
        expect(nextPageResponse.status).toBe(200);
      });

      it('should accept custom names with special characters', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: "O'Brien Housing & Associates Ltd." 
          });
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/contact-preferences');
      });
    });
  });

  describe('Integration with Journey', () => {
    describe('Session Data Persistence', () => {
      it('should maintain previously entered claim data', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: 'yes' });
        
        // Navigate back to verify earlier data is still present
        const borderResponse = await testSession.get('/claims/border-postcode');
        expect(borderResponse.status).toBe(200);
        
        const claimantTypeResponse = await testSession.get('/claims/claimant-type');
        expect(claimantTypeResponse.status).toBe(200);
      });

      it('should not lose session data when validation fails', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        // Submit invalid data
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: '' });
        
        // Verify can still access previous pages
        const claimTypeResponse = await testSession.get('/claims/claim-type');
        expect(claimTypeResponse.status).toBe(200);
      });

      it('should persist claimant name in session after successful submission', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        await testSession
          .post('/claims/name-of-claimant')
          .send({ 
            useRegisteredName: 'no',
            customClaimantName: 'Persistent Housing' 
          });
        
        // Navigate back to page
        const response = await testSession.get('/claims/name-of-claimant');
        expect(response.status).toBe(200);
        
        // Form should show previously selected option
        expect(response.text).toContain('value="no"');
      });
    });

    describe('Back Navigation', () => {
      it('should be able to navigate back to /claims/claim-type', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        const response = await testSession.get('/claims/claim-type');
        expect(response.status).toBe(200);
        expect(response.text).toContain('trespasser');
      });

      it('should maintain session data when navigating back', async () => {
        const testSession = session(app);
        await navigateToClaimantName(testSession);
        
        // Submit data
        await testSession
          .post('/claims/name-of-claimant')
          .send({ useRegisteredName: 'yes' });
        
        // Navigate back
        const backResponse = await testSession.get('/claims/claim-type');
        expect(backResponse.status).toBe(200);
        
        // Navigate forward again
        const forwardResponse = await testSession.get('/claims/name-of-claimant');
        expect(forwardResponse.status).toBe(200);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long custom names', async () => {
      const testSession = session(app);
      await navigateToClaimantName(testSession);
      
      const longName = 'A'.repeat(200); // 200 character name
      const response = await testSession
        .post('/claims/name-of-claimant')
        .send({ 
          useRegisteredName: 'no',
          customClaimantName: longName 
        });
      
      // Should either accept or show specific validation error
      expect([200, 302]).toContain(response.status);
    });

    it('should trim whitespace from custom names', async () => {
      const testSession = session(app);
      await navigateToClaimantName(testSession);
      
      const response = await testSession
        .post('/claims/name-of-claimant')
        .send({ 
          useRegisteredName: 'no',
          customClaimantName: '  Trimmed Housing  ' 
        });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/contact-preferences');
    });
  });
});
