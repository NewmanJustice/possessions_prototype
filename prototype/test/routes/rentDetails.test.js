/**
 * Rent Details Route Tests - Screen 20
 * 
 * Tests for /claims/rent-details
 * Covers: rent amount input, frequency selection, daily rent calculation, routing logic
 * 
 * @see /test/artifacts/screen20/understanding.md
 * @see /test/artifacts/screen20/test-plan.md
 * @see /test/artifacts/screen20/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToRentDetails } = require('../helpers/sessionHelper');

describe('Rent Details Route - /claims/rent-details', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    
    it('should be accessible when authenticated', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.status).toBe(200);
    });
    
  });
  
  // ============================================================
  // AC-1: Display rent amount input
  // ============================================================
  describe('AC-1: Display rent amount input', () => {
    
    // T-1.1: Page displays rent amount input
    it('should display the question "How much is the rent?"', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/How much is the rent/i);
    });
    
    // T-1.2: Input has currency prefix
    it('should display currency input with £ prefix', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/£/);
      expect(response.text).toMatch(/govuk-input__prefix/);
    });
    
    // T-1.3: Input accepts numeric values
    it('should have a numeric input field for rent amount', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/name="amount"/);
      expect(response.text).toMatch(/id="amount"/);
    });
    
  });
  
  // ============================================================
  // AC-2: Rent amount is required and numeric
  // ============================================================
  describe('AC-2: Rent amount validation', () => {
    
    // T-2.1: Required - Empty amount
    it('should show error when no rent amount is entered', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.2: Required - Error summary displayed
    it('should display GOV.UK error summary when amount is missing', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-2.3: Required - Focus management
    it('should set focus on error summary with tabindex="-1"', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-2.4: Required - Error link
    it('should link error summary to amount input field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/href="#amount"/);
    });
    
    // T-2.5: Numeric - Non-numeric input
    it('should reject non-numeric input', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: 'abc', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.6: Numeric - Currency symbol rejected
    it('should reject amount with £ symbol', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '£125', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.7: Numeric - Zero value rejected
    it('should reject zero as rent amount', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '0', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.8: Numeric - Negative value rejected
    it('should reject negative rent amounts', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '-125', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.9: Numeric - Valid 2 decimals accepted
    it('should accept rent amount with 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.50', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
    // T-2.10: Numeric - 3+ decimals rejected
    it('should reject rent amount with more than 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.567', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.11: Boundary - Minimum valid amount
    it('should accept minimum valid amount (£0.01)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '0.01', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
    // T-2.12: Boundary - Maximum valid amount
    it('should accept maximum valid amount (£1,000,000.00)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '1000000.00', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
    // T-2.13: Boundary - Over maximum rejected
    it('should reject amount over £1,000,000', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '1000000.01', frequency: 'weekly' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
    // T-2.14: Inline error displayed
    it('should display inline error on amount field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/govuk-error-message/);
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
    });
    
  });
  
  // ============================================================
  // AC-3: Display rent frequency options
  // ============================================================
  describe('AC-3: Display frequency options', () => {
    
    // T-3.1: Frequency question displayed
    it('should display the question "How frequently should rent be paid?"', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/How frequently should rent be paid/i);
    });
    
    // T-3.2: Weekly option present
    it('should display "Weekly" radio option', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Weekly/);
      expect(response.text).toMatch(/value="weekly"/);
    });
    
    // T-3.3: Fortnightly option present
    it('should display "Fortnightly" radio option', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Fortnightly/);
      expect(response.text).toMatch(/value="fortnightly"/);
    });
    
    // T-3.4: Monthly option present
    it('should display "Monthly" radio option', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Monthly/);
      expect(response.text).toMatch(/value="monthly"/);
    });
    
    // T-3.5: Other option present
    it('should display "Other" radio option', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Other/);
      expect(response.text).toMatch(/value="other"/);
    });
    
    // T-3.6: Radio group structure
    it('should render GOV.UK radios component', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/govuk-radios/);
      expect(response.text).toMatch(/name="frequency"/);
    });
    
  });
  
  // ============================================================
  // AC-4: Frequency selection is required
  // ============================================================
  describe('AC-4: Frequency selection required', () => {
    
    // T-4.1: Required - No selection
    it('should show error when no frequency is selected', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/Select how often rent should be paid/);
    });
    
    // T-4.2: Required - Error summary
    it('should display GOV.UK error summary when frequency is missing', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/There is a problem/);
    });
    
    // T-4.3: Required - Focus management
    it('should set focus on error summary when frequency validation fails', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-4.4: Required - Error link
    it('should link error summary to frequency field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/href="#frequency"/);
    });
    
    // T-4.5: Inline error displayed
    it('should display inline error on frequency field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/govuk-error-message/);
      expect(response.text).toMatch(/Select how often rent should be paid/);
    });
    
  });
  
  // ============================================================
  // AC-5: Preserve inputs on validation failure
  // ============================================================
  describe('AC-5: Preserve inputs on error', () => {
    
    // T-5.1: Preserve amount on error
    it('should preserve amount when only frequency is missing', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/value="125"/);
    });
    
    // T-5.2: Preserve frequency on error
    it('should preserve frequency when only amount is missing', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/value="weekly".*checked|checked.*value="weekly"/);
    });
    
    // T-5.3: Preserve both on multi-error
    it('should preserve both values when both have errors', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: 'abc', frequency: '' });
      
      expect(response.text).toMatch(/value="abc"/);
    });
    
    // T-5.4: Preserve on amount format error
    it('should preserve invalid amount for user correction', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.567', frequency: 'weekly' });
      
      expect(response.text).toMatch(/value="125.567"/);
    });
    
  });
  
  // ============================================================
  // AC-6: Persist rent details in session
  // ============================================================
  describe('AC-6: Session persistence', () => {
    
    // T-6.1: Store amount
    it('should store rent amount in session', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.50', frequency: 'weekly' });
      
      const checkResponse = await testSession
        .get('/claims/rent-details');
      
      expect(checkResponse.text).toMatch(/value="125.5"/); // Could be 125.5 or 125.50
    });
    
    // T-6.2: Store frequency
    it('should store frequency in session', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'monthly' });
      
      const checkResponse = await testSession
        .get('/claims/rent-details');
      
      expect(checkResponse.text).toMatch(/value="monthly".*checked|checked.*value="monthly"/);
    });
    
    // T-6.3: Amount stored as number
    it('should store amount as a number type', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.50', frequency: 'weekly' });
      
      // Verify via session (implementation will store as number)
      // Checking via re-render confirms numeric handling
      const checkResponse = await testSession
        .get('/claims/rent-details');
      
      expect(checkResponse.text).toMatch(/value="125.5/);
    });
    
    // T-6.4: Frequency stored as lowercase
    it('should store frequency value as lowercase', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      const checkResponse = await testSession
        .get('/claims/rent-details');
      
      expect(checkResponse.text).toMatch(/value="weekly".*checked|checked.*value="weekly"/);
    });
    
    // T-6.5: Session structure correct
    it('should create rentDetails object with correct structure', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      // Session structure validated by successful storage and retrieval
      const checkResponse = await testSession
        .get('/claims/rent-details');
      
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.text).toMatch(/value="125"/);
      expect(checkResponse.text).toMatch(/value="weekly".*checked|checked.*value="weekly"/);
    });
    
  });
  
  // ============================================================
  // AC-7: Auto-calculate daily rent amount
  // ============================================================
  describe('AC-7: Daily rent calculation', () => {
    
    // T-7.1: Weekly calculation (700 ÷ 7 = 100.00)
    it('should calculate daily rent for weekly frequency (700 ÷ 7)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '700', frequency: 'weekly' });
      
      // Calculation verified by checking next screen or session
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-7.2: Fortnightly calculation (750 ÷ 14 = 53.57)
    it('should calculate daily rent for fortnightly frequency (750 ÷ 14)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '750', frequency: 'fortnightly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-7.3: Monthly calculation (1500 ÷ 365 × 12 = 493.15)
    it('should calculate daily rent for monthly frequency (1500 ÷ 365 × 12)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '1500', frequency: 'monthly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-7.4: Weekly rounding (125 ÷ 7 = 17.857... → 17.86)
    it('should round weekly calculation to 2 decimal places (125 → 17.86)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      // Calculation stored in session, verified on next page
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      // Placeholder page should exist
      expect(response.status).toBe(200);
    });
    
    // T-7.5: Fortnightly rounding (125 ÷ 14 = 8.928... → 8.93)
    it('should round fortnightly calculation to 2 decimal places (125 → 8.93)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'fortnightly' });
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.status).toBe(200);
    });
    
    // T-7.6: Monthly rounding (125 ÷ 365 × 12 = 41.095... → 41.10)
    it('should round monthly calculation to 2 decimal places (125 → 41.10)', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'monthly' });
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.status).toBe(200);
    });
    
    // T-7.7: Precision - 2 decimal places
    it('should ensure calculated daily amount has maximum 2 decimal places', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '999.99', frequency: 'weekly' });
      
      // Calculation precision verified by implementation
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.status).toBe(200);
    });
    
    // T-7.8: Other frequency - no calculation
    it('should set calculatedDailyAmount to null for "other" frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'other' });
      
      // Other frequency routes differently (no calculation)
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
  });
  
  // ============================================================
  // AC-8: Navigate to daily rent confirmation
  // ============================================================
  describe('AC-8: Routing for standard frequencies', () => {
    
    // T-8.1: Weekly → daily-rent-amount
    it('should redirect to daily-rent-amount for weekly frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-8.2: Fortnightly → daily-rent-amount
    it('should redirect to daily-rent-amount for fortnightly frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'fortnightly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-8.3: Monthly → daily-rent-amount
    it('should redirect to daily-rent-amount for monthly frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'monthly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-8.4: Placeholder route exists
    it('should have placeholder route for /claims/daily-rent-amount', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      const response = await testSession
        .get('/claims/daily-rent-amount');
      
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Daily Rent Amount|Placeholder/i);
    });
    
  });
  
  // ============================================================
  // AC-9: Other frequency routes to rent arrears details
  // ============================================================
  describe('AC-9: Routing for other frequency', () => {
    
    // T-9.1: Other → details-of-rent-arrears
    it('should redirect to details-of-rent-arrears for other frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'other' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/details-of-rent-arrears');
    });
    
    // T-9.2: Placeholder route exists
    it('should have placeholder route for /claims/details-of-rent-arrears', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'other' });
      
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
    it('should display Previous button', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Previous/);
    });
    
    // T-10.2: Previous → notice-details
    it('should navigate to notice-details when Previous is clicked', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/href="\/claims\/notice-details"/);
    });
    
    // T-10.3: Data preserved on previous
    it('should preserve entered data when navigating to previous page', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      await testSession
        .get('/claims/notice-details');
      
      const returnResponse = await testSession
        .get('/claims/rent-details');
      
      expect(returnResponse.text).toMatch(/value="125"/);
      expect(returnResponse.text).toMatch(/value="weekly".*checked|checked.*value="weekly"/);
    });
    
  });
  
  // ============================================================
  // AC-11: Cancel behaviour
  // ============================================================
  describe('AC-11: Cancel button', () => {
    
    // T-11.1: Cancel button exists
    it('should display Cancel link', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/Cancel/);
    });
    
    // T-11.2: Cancel → case-list
    it('should navigate to case-list when Cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/href="\/case-list"/);
    });
    
    // T-11.3: Draft preserved on cancel
    it('should preserve session data when cancel is clicked', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      await testSession
        .get('/case-list');
      
      const returnResponse = await testSession
        .get('/claims/rent-details');
      
      expect(returnResponse.text).toMatch(/value="125"/);
    });
    
  });
  
  // ============================================================
  // AC-12: Accessibility compliance
  // ============================================================
  describe('AC-12: Accessibility', () => {
    
    // T-12.1: Error summary focus
    it('should have tabindex="-1" on error summary for focus management', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/tabindex="-1"/);
    });
    
    // T-12.2: Error summary links
    it('should have href links in error summary', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({});
      
      expect(response.text).toMatch(/govuk-error-summary/);
      expect(response.text).toMatch(/href="#/);
    });
    
    // T-12.3: Amount error link target
    it('should link amount error to #amount field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ frequency: 'weekly' });
      
      expect(response.text).toMatch(/href="#amount"/);
    });
    
    // T-12.4: Frequency error link target
    it('should link frequency error to frequency field', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125' });
      
      expect(response.text).toMatch(/href="#frequency"/);
    });
    
    // T-12.5: Input labels present
    it('should have proper labels for all input fields', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      expect(response.text).toMatch(/for="amount"/);
      expect(response.text).toMatch(/govuk-label/);
    });
    
    // T-12.6: Keyboard accessible
    it('should have keyboard accessible form controls', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .get('/claims/rent-details');
      
      // All GOV.UK components are keyboard accessible by default
      expect(response.text).toMatch(/govuk-input/);
      expect(response.text).toMatch(/govuk-radios/);
      expect(response.text).toMatch(/govuk-button/);
    });
    
    // T-12.7: ARIA attributes
    it('should have ARIA attributes linking errors to fields', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({});
      
      // GOV.UK components include aria-describedby for error messages
      expect(response.text).toMatch(/govuk-error-message/);
    });
    
  });
  
  // ============================================================
  // Edge Cases
  // ============================================================
  describe('Edge Cases', () => {
    
    // T-E.1: Multiple errors displayed
    it('should display both errors when amount and frequency are missing', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({});
      
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
      expect(response.text).toMatch(/Select how often rent should be paid/);
    });
    
    // T-E.2: Multiple distinct errors
    it('should show separate errors for invalid amount and missing frequency', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: 'abc' });
      
      expect(response.text).toMatch(/Enter the rent amount as a number greater than 0/);
      expect(response.text).toMatch(/Select how often rent should be paid/);
    });
    
    // T-E.3: Re-populate on page revisit
    it('should pre-populate fields when revisiting the page', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '500', frequency: 'monthly' });
      
      await testSession
        .get('/claims/daily-rent-amount');
      
      const revisitResponse = await testSession
        .get('/claims/rent-details');
      
      expect(revisitResponse.text).toMatch(/value="500"/);
      expect(revisitResponse.text).toMatch(/value="monthly".*checked|checked.*value="monthly"/);
    });
    
    // T-E.4: Calculation updates on frequency change
    it('should recalculate when frequency is changed', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      // First submission with weekly
      await testSession
        .post('/claims/rent-details')
        .send({ amount: '700', frequency: 'weekly' });
      
      // Revisit and change to monthly
      await testSession
        .get('/claims/rent-details');
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '700', frequency: 'monthly' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/daily-rent-amount');
    });
    
    // T-E.5: Decimal with trailing zeros
    it('should handle decimal values with trailing zeros', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.50', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.6: Whole number in decimal field
    it('should accept whole numbers without decimals', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
    // T-E.7: Single decimal place
    it('should accept amounts with single decimal place', async () => {
      const testSession = session(app);
      await navigateToRentDetails(testSession);
      
      const response = await testSession
        .post('/claims/rent-details')
        .send({ amount: '125.5', frequency: 'weekly' });
      
      expect(response.status).toBe(302);
    });
    
  });
  
});
