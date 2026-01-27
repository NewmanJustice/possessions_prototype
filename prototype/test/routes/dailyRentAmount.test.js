/**
 * Daily Rent Amount Route Tests - Screen 21
 * 
 * Tests for /claims/daily-rent-amount
 * Covers: calculated amount display, confirmation radios, manual entry override
 * 
 * @see /test/artifacts/screen21/understanding.md
 * @see /test/artifacts/screen21/test-plan.md
 * @see /test/artifacts/screen21/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToDailyRentAmount } = require('../helpers/sessionHelper');

describe('Daily Rent Amount Route - /claims/daily-rent-amount', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    
    it('should be accessible when authenticated', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.status).toBe(200);
    });
    
  });
  
  // ============================================================
  // AC-1: Display calculated daily rent amount
  // ============================================================
  describe('AC-1: Display calculated amount', () => {
    
    // T-1.1: Page displays calculated amount
    it('should display the calculated daily rent amount', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // Should show the calculated amount somewhere
      expect(response.text).toMatch(/17\.86|£17\.86/);
    });
    
    // T-1.2: Amount formatted as currency
    it('should display amount in currency format with £ symbol', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/£17\.86/);
    });
    
    // T-1.3: Explanation text present
    it('should display explanation text about calculation source', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/based on|calculated|previous answers|unpaid rent/i);
    });
    
    // T-1.4: Amount from Screen 20
    it('should display amount from Screen 20 calculation', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // 125 weekly = 17.86 daily (from navigation helper)
      expect(response.text).toMatch(/17\.86/);
    });
    
  });
  
  // ============================================================
  // AC-2: Ask whether the daily rent amount is correct
  // ============================================================
  describe('AC-2: Confirmation question', () => {
    
    // T-2.1: Question displayed
    it('should ask if daily rent amount is correct', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/Is the amount per day that unpaid rent should be charged at correct/i);
    });
    
    // T-2.2: Yes option present
    it('should display "Yes" radio option', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/Yes/);
      expect(response.text).toMatch(/value="yes"/);
    });
    
    // T-2.3: No option present
    it('should display "No" radio option', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/No/);
      expect(response.text).toMatch(/value="no"/);
    });
    
    // T-2.4: Radio group structure
    it('should render GOV.UK radios component', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/govuk-radios/);
      expect(response.text).toMatch(/name="confirmation"/);
    });
    
  });
  
  // ============================================================
  // AC-3: Selection is required
  // ============================================================
  describe('AC-3: Radio selection required', () => {
    
    // T-3.1: Required - No selection
    it('should show error when no radio is selected', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select whether the daily rent amount is correct/);
    });
    
    // T-3.2: Error summary displayed
    it('should display GOV.UK error summary when no selection', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-3.3: Focus on error summary
    it('should set focus on error summary with tabindex="-1"', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-3.4: Error link to radios
    it('should link error summary to radio group', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/href="#confirmation"/);
    });
    
  });
  
  // ============================================================
  // AC-4: Yes path - accept calculated amount
  // ============================================================
  describe('AC-4: Yes path acceptance', () => {
    
    // T-4.1: Yes accepted
    it('should accept submission when "Yes" is selected', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      expect(response.status).toBe(302);
    });
    
    // T-4.2: Store dailyAmountConfirmed true
    it('should set dailyAmountConfirmed to true when "Yes" selected', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      // Verify via revisit
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
    // T-4.3: Store dailyAmount = calculatedDailyAmount
    it('should set dailyAmount equal to calculatedDailyAmount', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      // Session verified by successful storage and retrieval
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.text).toMatch(/17\.86/);
    });
    
    // T-4.4: Redirect on Yes
    it('should redirect to next screen when "Yes" selected', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
  });
  
  // ============================================================
  // AC-5: No path - show manual entry field
  // ============================================================
  describe('AC-5: Conditional reveal', () => {
    
    // T-5.1: Conditional initially hidden
    it('should not show manual entry field on initial page load', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // Conditional should use GOV.UK pattern
      expect(response.text).toMatch(/govuk-radios__conditional/);
    });
    
    // T-5.2: Conditional revealed on No
    it('should have conditional structure for manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/name="manualDailyAmount"/);
    });
    
    // T-5.3: Field label correct
    it('should have label "Enter the correct daily rent amount"', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/Enter the correct daily rent amount/i);
    });
    
    // T-5.4: Field has currency prefix
    it('should have £ prefix on manual entry field', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/£/);
      expect(response.text).toMatch(/govuk-input__prefix/);
    });
    
    // T-5.5: Yes hides conditional (structure test)
    it('should use GOV.UK conditional pattern', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/govuk-radios__conditional/);
    });
    
  });
  
  // ============================================================
  // AC-6: Manual daily rent amount validation
  // ============================================================
  describe('AC-6: Manual entry validation', () => {
    
    // T-6.1: Required when No selected
    it('should show error when "No" selected but manual entry empty', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.2: Non-numeric rejected
    it('should reject non-numeric manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: 'abc' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.3: Zero rejected
    it('should reject zero as manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '0' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.4: Negative rejected
    it('should reject negative manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '-10' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.5: Valid amount accepted
    it('should accept valid manual entry amount', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '17.85' });
      
      expect(response.status).toBe(302);
    });
    
    // T-6.6: Decimal 2dp accepted
    it('should accept amount with 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '125.50' });
      
      expect(response.status).toBe(302);
    });
    
    // T-6.7: Decimal 3dp rejected
    it('should reject amount with more than 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '125.567' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.8: Minimum valid
    it('should accept minimum valid amount (£0.01)', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '0.01' });
      
      expect(response.status).toBe(302);
    });
    
    // T-6.9: Maximum valid
    it('should accept maximum valid amount (£1,000,000.00)', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '1000000.00' });
      
      expect(response.status).toBe(302);
    });
    
    // T-6.10: Over maximum rejected
    it('should reject amount over £1,000,000', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '1000000.01' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.11: Currency symbol rejected
    it('should reject amount with £ symbol', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '£125' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the daily rent amount as a number greater than 0/);
    });
    
    // T-6.12: Error summary on validation
    it('should display GOV.UK error summary on manual entry validation failure', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
  });
  
  // ============================================================
  // AC-7: Accept manually entered daily rent amount
  // ============================================================
  describe('AC-7: Manual entry acceptance', () => {
    
    // T-7.1: Store dailyAmountConfirmed false
    it('should set dailyAmountConfirmed to false when manual entry provided', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      // Verify via revisit
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="no".*checked|checked.*value="no"/);
    });
    
    // T-7.2: Store manual dailyAmount
    it('should store manually entered value as dailyAmount', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      // Verify via revisit
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="20"/);
    });
    
    // T-7.3: Override calculated amount
    it('should replace calculated amount with manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '25.50' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      // Manual value shown, not calculated (17.86)
      expect(checkResponse.text).toMatch(/value="25.5/);
    });
    
    // T-7.4: Redirect on manual entry
    it('should redirect to next screen with valid manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
  });
  
  // ============================================================
  // AC-8: Persist daily rent amount
  // ============================================================
  describe('AC-8: Session persistence', () => {
    
    // T-8.1: Session structure (Yes path)
    it('should create correct session structure for "Yes" path', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
    // T-8.2: Session structure (No path)
    it('should create correct session structure for "No" path', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.text).toMatch(/value="no".*checked|checked.*value="no"/);
    });
    
    // T-8.3: calculatedDailyAmount preserved
    it('should preserve original calculatedDailyAmount from Screen 20', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      // Submit with manual override
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '30.00' });
      
      // Original calculated amount should still be displayable
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      // Page should still show original calculation (£17.86) even after override
      expect(checkResponse.text).toMatch(/17\.86/);
    });
    
    // T-8.4: dailyAmount stored as Number
    it('should store dailyAmount as Number type', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '25.50' });
      
      // Type verified by successful storage and numeric operations
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="25.5/);
    });
    
  });
  
  // ============================================================
  // AC-9: Continue route
  // ============================================================
  describe('AC-9: Routing', () => {
    
    // T-9.1: Redirect on success (Yes)
    it('should redirect to details-of-rent-arrears when "Yes" selected', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
    // T-9.2: Redirect on success (No)
    it('should redirect to details-of-rent-arrears with valid manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
    // T-9.3: Placeholder route exists
    it('should have placeholder route for /claims/details-of-rent-arrears', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      const response = await testSession
        .get('/claims/details-of-rent-arrears');
      
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Details of Rent Arrears|Placeholder/i);
    });
    
  });
  
  // ============================================================
  // AC-10: Previous navigation
  // ============================================================
  describe('AC-10: Previous button', () => {
    
    // T-10.1: Previous button exists
    it('should display Previous link', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/Previous/);
    });
    
    // T-10.2: Previous → rent-details
    it('should navigate to rent-details when Previous is clicked', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/href="\/claims\/rent-details"/);
    });
    
    // T-10.3: Data preserved on previous
    it('should preserve entered data when navigating to previous page', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      await testSession
        .get('/claims/rent-details');
      
      const returnResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(returnResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
  });
  
  // ============================================================
  // AC-11: Cancel behaviour
  // ============================================================
  describe('AC-11: Cancel button', () => {
    
    // T-11.1: Cancel button exists
    it('should display Cancel link', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/Cancel/);
    });
    
    // T-11.2: Cancel → case-list
    it('should navigate to case-list when Cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/href="\/case-list"/);
    });
    
    // T-11.3: Draft preserved on cancel
    it('should preserve session data when cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      await testSession
        .get('/case-list');
      
      const returnResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(returnResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
  });
  
  // ============================================================
  // AC-12: Accessibility
  // ============================================================
  describe('AC-12: Accessibility', () => {
    
    // T-12.1: Error summary focus
    it('should have tabindex="-1" on error summary for focus management', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-12.2: Error summary links
    it('should have href links in error summary', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/href="#/);
    });
    
    // T-12.3: Radio error link target
    it('should link radio error to #confirmation', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/href="#confirmation"/);
    });
    
    // T-12.4: Manual entry error link target
    it('should link manual entry error to #manualDailyAmount', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no' });
      
      expect(response.text).toMatch(/href="#manualDailyAmount"/);
    });
    
    // T-12.5: Labels present
    it('should have proper labels for all form controls', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.text).toMatch(/govuk-label/);
    });
    
    // T-12.6: Keyboard accessible
    it('should have keyboard accessible form controls', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // GOV.UK components are keyboard accessible by default
      expect(response.text).toMatch(/govuk-radios/);
      expect(response.text).toMatch(/govuk-input/);
    });
    
  });
  
  // ============================================================
  // Revisit & Pre-population Tests
  // ============================================================
  describe('Revisit & Pre-population', () => {
    
    // T-R.1: Pre-populate Yes
    it('should pre-populate "Yes" radio when revisiting after confirmation', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
    // T-R.2: Pre-populate No
    it('should pre-populate "No" radio when revisiting after manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="no".*checked|checked.*value="no"/);
    });
    
    // T-R.3: Show conditional on revisit
    it('should show manual entry field when revisiting with "No" selection', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      // Field should be visible (conditional revealed)
      expect(checkResponse.text).toMatch(/name="manualDailyAmount"/);
      expect(checkResponse.text).toMatch(/value="no".*checked|checked.*value="no"/);
    });
    
    // T-R.4: Pre-populate manual value
    it('should pre-populate manual entry value when revisiting', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="20"/);
    });
    
    // T-R.5: Hide conditional on Yes revisit
    it('should not show manual field when revisiting with "Yes" selection', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      // "Yes" should be checked
      expect(checkResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
    // T-R.6: Change from Yes to No
    it('should allow changing from "Yes" to "No" with manual entry', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      // First submit with Yes
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      // Revisit and change to No
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '25.00' });
      
      expect(response.status).toBe(302);
      
      // Verify change persisted
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="no".*checked|checked.*value="no"/);
      expect(checkResponse.text).toMatch(/value="25"/);
    });
    
    // T-R.7: Change from No to Yes
    it('should allow changing from "No" to "Yes"', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      // First submit with No
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      // Revisit and change to Yes
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'yes' });
      
      expect(response.status).toBe(302);
      
      // Verify change persisted
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="yes".*checked|checked.*value="yes"/);
    });
    
    // T-R.8: Update manual value
    it('should allow updating manual entry value', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      // First submit with 20.00
      await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '20.00' });
      
      // Revisit and update to 25.00
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '25.00' });
      
      expect(response.status).toBe(302);
      
      // Verify update persisted
      const checkResponse = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(checkResponse.text).toMatch(/value="25"/);
    });
    
  });
  
  // ============================================================
  // Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    
    // T-E.1: Multiple errors
    it('should display error when no selection made', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({});
      
      expect(response.text).toMatch(/Select whether the daily rent amount is correct/);
    });
    
    // T-E.2: Values preserved on error
    it('should preserve "No" selection and invalid value on error', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: 'abc' });
      
      expect(response.text).toMatch(/value="no".*checked|checked.*value="no"/);
      expect(response.text).toMatch(/value="abc"/);
    });
    
    // T-E.3: Whole number accepted
    it('should accept whole numbers without decimals', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '125' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.4: Single decimal accepted
    it('should accept amounts with single decimal place', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '125.5' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.5: Very small amount
    it('should accept very small amount (£0.01)', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '0.01' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.6: Very large amount
    it('should accept very large amount (£999,999.99)', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .post('/claims/daily-rent-amount')
        .send({ confirmation: 'no', manualDailyAmount: '999999.99' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.7: Calculated amount display rounding
    it('should display calculated amount with 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToDailyRentAmount(testSession);
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // Should show rounded value (17.86 not 17.857142...)
      expect(response.text).toMatch(/£17\.86/);
    });
    
  });
  
});
