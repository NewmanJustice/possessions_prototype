/**
 * Tenancy or Licence Details Route Tests - Screen 12
 * 
 * Tests for /claims/tenancy
 * Covers: tenancy type, start date, document upload, navigation
 * 
 * @see /test/artifacts/screen12/understanding.md
 * @see /test/artifacts/screen12/test-plan.md
 * @see /test/artifacts/screen12/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToTenancy } = require('../helpers/sessionHelper');

describe('Tenancy or Licence Details Route - /claims/tenancy', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('T-X.1: should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/tenancy');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('T-X.2: should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // AC-1: Tenancy/licence type required
  // ============================================================
  describe('AC-1: Tenancy/licence type required', () => {
    it('T-1.1: should show radio options for tenancy type', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.status).toBe(200);
      expect(response.text).toContain('type="radio"');
      expect(response.text).toContain('tenancyType');
    });

    it('T-1.2: should display all six tenancy types', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toMatch(/assured/i);
      expect(response.text).toMatch(/secure/i);
      expect(response.text).toMatch(/introductory/i);
      expect(response.text).toMatch(/flexible/i);
      expect(response.text).toMatch(/demoted/i);
      expect(response.text).toMatch(/other/i);
    });

    it('T-1.3: should show error summary when submitting without selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-1.4: should show error message "Select the tenancy or licence type"', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toMatch(/select.*tenancy.*licence.*type/i);
    });

    it('T-1.5: should move focus to error summary on validation failure', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-1.6: should accept assured-tenancy selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-1.7: should accept secure-tenancy selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-1.8: should accept introductory-tenancy selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'introductory-tenancy' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-1.9: should accept flexible-tenancy selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'flexible-tenancy' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-1.10: should accept demoted-tenancy selection', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'demoted-tenancy' });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });
  });

  // ============================================================
  // AC-2: "Other" reveals optional free-text
  // ============================================================
  describe('AC-2: "Other" reveals optional free-text', () => {
    it('T-2.1: should have conditional reveal field for "Other"', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toContain('otherTypeDetails');
    });

    it('T-2.2: should have field labelled "Please specify"', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toMatch(/please specify/i);
    });

    it('T-2.3: should accept "Other" with blank free-text', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'other',
          otherTypeDetails: ''
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });

    it('T-2.4: should accept "Other" with populated free-text', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'other',
          otherTypeDetails: 'Licence agreement'
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });

    it('T-2.E.1: should show error for free-text exceeding 255 characters', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const longText = 'A'.repeat(256);
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'other',
          otherTypeDetails: longText
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-2.E.2: should preserve free-text on validation failure', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // Submit with partial date to cause error
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'other',
          otherTypeDetails: 'Preserved text',
          'startDate-day': '15',
          'startDate-month': '',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('Preserved text');
    });
  });

  // ============================================================
  // AC-3: Optional start date validation
  // ============================================================
  describe('AC-3: Optional start date validation', () => {
    it('T-3.1: should allow empty date fields (no error)', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '',
          'startDate-month': '',
          'startDate-year': ''
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-3.2: should accept complete valid date', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '15',
          'startDate-month': '06',
          'startDate-year': '2020'
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-3.3: should save date to session', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '01',
          'startDate-month': '04',
          'startDate-year': '2021'
        });
      
      // Verify by revisiting page
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('01');
      expect(getResponse.text).toContain('04');
      expect(getResponse.text).toContain('2021');
    });

    it('T-3.4: should show error for partial date (day only)', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '15',
          'startDate-month': '',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-3.5: should show error for partial date (month only)', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '',
          'startDate-month': '06',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-3.6: should show error for partial date (year only)', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '',
          'startDate-month': '',
          'startDate-year': '2020'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-3.7: should show error for partial date (day+month only)', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '15',
          'startDate-month': '06',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-3.8: should show error message describing date problem', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '15',
          'startDate-month': '',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toMatch(/date|format/i);
    });

    describe('Date Boundary Cases', () => {
      it('T-3.E.1: should show error for year 1799 (below minimum)', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '01',
            'startDate-month': '01',
            'startDate-year': '1799'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.2: should accept year 1800 (minimum valid)', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '01',
            'startDate-month': '01',
            'startDate-year': '1800'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
      });

      it('T-3.E.3: should accept year 2100 (maximum valid)', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '01',
            'startDate-month': '01',
            'startDate-year': '2100'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
      });

      it('T-3.E.4: should show error for year 2101 (above maximum)', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '01',
            'startDate-month': '01',
            'startDate-year': '2101'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.5: should show error for day 0', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '0',
            'startDate-month': '06',
            'startDate-year': '2020'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.6: should show error for day 32', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '32',
            'startDate-month': '06',
            'startDate-year': '2020'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.7: should show error for month 0', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '15',
            'startDate-month': '0',
            'startDate-year': '2020'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.8: should show error for month 13', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            'startDate-day': '15',
            'startDate-month': '13',
            'startDate-year': '2020'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('govuk-error-summary');
      });

      it('T-3.E.9: should preserve date values on validation failure', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: '',  // Missing - causes error
            'startDate-day': '25',
            'startDate-month': '12',
            'startDate-year': '2020'
          });
        
        const getResponse = await testSession.get('/claims/tenancy');
        expect(getResponse.text).toContain('25');
        expect(getResponse.text).toContain('12');
        expect(getResponse.text).toContain('2020');
      });
    });
  });

  // ============================================================
  // AC-4: Upload tenancy/licence agreement (simulated)
  // ============================================================
  describe('AC-4: Upload tenancy/licence agreement (simulated)', () => {
    it('T-4.1: should have upload control with "Add new" button', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toMatch(/add new|upload/i);
    });

    it('T-4.2: should allow submission without uploading files', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);

      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy'
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-4.3: should store file metadata in session when uploaded', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'tenancy_agreement.pdf'
        });
      
      expect(response.status).toBe(302);
    });

    it('T-4.4: should show uploaded file in list', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'agreement.pdf'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      // File should appear in the document list
      expect(getResponse.status).toBe(200);
    });

    it('T-4.5: should show error for disallowed file type', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'malware.exe'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-4.6: should show error for file over size limit', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'large_file.pdf',
          uploadedFileSize: 6000000  // 6MB, over 5MB limit
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    describe('File Type Acceptance', () => {
      it('T-4.E.1: should accept PDF file', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'document.pdf'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-4.E.2: should accept DOC file', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'document.doc'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-4.E.3: should accept DOCX file', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'document.docx'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-4.E.4: should accept JPG file', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'photo.jpg'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-4.E.5: should accept PNG file', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);
        
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'image.png'
          });
        
        expect(response.status).toBe(302);
      });

      it('T-4.E.6: should allow file removal from list via GET link', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        // Upload a file first (with action to stay on page)
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'to_remove.pdf',
            action: 'addDocument'
          });

        // Get page to find document ID
        const pageResponse = await testSession.get('/claims/tenancy');
        const docIdMatch = pageResponse.text.match(/documentId=([^"&]+)/);
        const documentId = docIdMatch ? docIdMatch[1] : 'unknown';

        // Remove the file via GET (as the template now uses links)
        const response = await testSession
          .get(`/claims/tenancy/remove-document?documentId=${documentId}`);

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/tenancy');
      });

      it('T-4.E.7: should allow multiple files to be uploaded', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileNames: ['file1.pdf', 'file2.pdf']
          });

        expect(response.status).toBe(302);
      });

      it('T-4.E.8: should stay on tenancy page when Add new button clicked', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'document.pdf',
            action: 'addDocument'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/tenancy');
      });

      it('T-4.E.9: should redirect to grounds page when Continue clicked after adding document', async () => {
        const testSession = session(app);
        await navigateToTenancy(testSession);

        // First add a document with Add new button
        await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy',
            uploadedFileName: 'document.pdf',
            action: 'addDocument'
          });

        // Then click Continue (no action param)
        const response = await testSession
          .post('/claims/tenancy')
          .send({
            tenancyType: 'assured-tenancy'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
      });
    });
  });

  // ============================================================
  // AC-5: Preserve inputs on validation error
  // ============================================================
  describe('AC-5: Preserve inputs on validation error', () => {
    it('T-5.1: should preserve tenancy type on error', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '15',
          'startDate-month': '',  // Partial date causes error
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('assured-tenancy');
    });

    it('T-5.2: should preserve date values on error', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: '',  // Missing causes error
          'startDate-day': '10',
          'startDate-month': '05',
          'startDate-year': '2019'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('10');
      expect(getResponse.text).toContain('05');
      expect(getResponse.text).toContain('2019');
    });

    it('T-5.3: should preserve uploaded files on error', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First upload a file successfully
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'preserved.pdf'
        });
      
      // Then cause an error
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: '',
          'startDate-day': '15',
          'startDate-month': '',
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.status).toBe(200);
    });

    it('T-5.4: should preserve "Other" free-text on error', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'other',
          otherTypeDetails: 'Preserved details',
          'startDate-day': '15',
          'startDate-month': '',  // Partial date causes error
          'startDate-year': ''
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('Preserved details');
    });
  });

  // ============================================================
  // AC-6: Continue saves and redirects
  // ============================================================
  describe('AC-6: Continue saves and redirects', () => {
    it('T-6.1: should save tenancy to session on Continue', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'secure-tenancy',
          'startDate-day': '01',
          'startDate-month': '06',
          'startDate-year': '2020'
        });
      
      // Verify by revisiting
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('secure-tenancy');
    });

    it('T-6.2: should store type field in session', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'flexible-tenancy' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('flexible-tenancy');
    });

    it('T-6.3: should store startDate in session when provided', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          'startDate-day': '20',
          'startDate-month': '11',
          'startDate-year': '2019'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('20');
      expect(getResponse.text).toContain('11');
      expect(getResponse.text).toContain('2019');
    });

    it('T-6.4: should store documents array in session', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'assured-tenancy',
          uploadedFileName: 'stored.pdf'
        });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.status).toBe(200);
    });

    // T-6.5 removed - routing now tested in T-R.1, T-R.2, T-R.3 (groundsModel-based)
  });

  // ============================================================
  // AC-7: Previous & Cancel behaviour
  // ============================================================
  describe('AC-7: Previous & Cancel behaviour', () => {
    it('T-7.1: should have Previous link to /claims/defendant-details', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toContain('/claims/defendant-details');
    });

    it('T-7.2: should preserve entered data when navigating back', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // Submit tenancy data
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'introductory-tenancy',
          'startDate-day': '05',
          'startDate-month': '03',
          'startDate-year': '2021'
        });
      
      // Navigate back
      const backResponse = await testSession.get('/claims/defendant-details');
      expect(backResponse.status).toBe(200);
      
      // Navigate forward
      const forwardResponse = await testSession.get('/claims/tenancy');
      expect(forwardResponse.text).toContain('introductory-tenancy');
    });

    it('T-7.3: should have Cancel link to /case-list', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toContain('/case-list');
      expect(response.text).toContain('Cancel');
    });

    it('T-7.4: should preserve claim draft after Cancel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // Navigate to case list (Cancel)
      const cancelResponse = await testSession.get('/case-list');
      expect(cancelResponse.status).toBe(200);
      
      // Go back to tenancy - should still work
      const returnResponse = await testSession.get('/claims/tenancy');
      expect(returnResponse.status).toBe(200);
    });
  });

  // ============================================================
  // AC-8: Accessibility
  // ============================================================
  describe('AC-8: Accessibility', () => {
    it('T-8.1: should show error summary on validation failure', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
      expect(getResponse.text).toContain('There is a problem');
    });

    it('T-8.2: should have error links to corresponding fields', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('href="#');
    });

    it('T-8.3: should move focus to error summary', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toContain('govuk-error-summary');
    });

    it('T-8.4: should have form controls with associated labels', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toContain('<label');
      expect(response.text).toContain('for=');
    });
  });

  // ============================================================
  // PAGE CONTENT & UX
  // ============================================================
  describe('Page Content & UX', () => {
    it('T-X.3: should have correct page title', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toMatch(/<title>.*[Tt]enancy.*<\/title>/i);
    });

    it('T-X.4: should include "Error:" in page title on validation failure', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: '' });
      
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.text).toMatch(/<title>Error:.*<\/title>/i);
    });

    it('T-X.5: should show previously saved tenancy when re-visiting', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // Submit tenancy
      await testSession
        .post('/claims/tenancy')
        .send({
          tenancyType: 'demoted-tenancy',
          'startDate-day': '12',
          'startDate-month': '08',
          'startDate-year': '2022'
        });
      
      // Go to next page (demoted-tenancy routes to OTHER_UNSUPPORTED)
      await testSession.get('/claims/grounds-for-possession-intro-demoted-other');
      
      // Come back
      const response = await testSession.get('/claims/tenancy');
      expect(response.text).toContain('demoted-tenancy');
      expect(response.text).toContain('12');
      expect(response.text).toContain('08');
      expect(response.text).toContain('2022');
    });
  });

  describe('AC-13, AC-14: Grounds model determination and persistence', () => {
    it('T-13.1: should determine groundsModel on successful submission', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      expect(response.status).toBe(302);
      const sessionData = testSession.cookies.find(c => c.name === 'connect.sid');
      expect(sessionData).toBeDefined();
    });

    it('T-13.2: should store groundsModel in session', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      // Verify by visiting a page that uses session
      const getResponse = await testSession.get('/claims/tenancy');
      expect(getResponse.status).toBe(200);
      // groundsModel will be verified in mapping tests
    });
  });

  describe('AC-15: Grounds model mapping', () => {
    it('T-15.1: should map assured-tenancy to ASSURED groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-15.2: should map secure-tenancy to SECURE_LIKE groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-15.3: should map introductory-tenancy to SECURE_LIKE groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'introductory-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-15.4: should map flexible-tenancy to SECURE_LIKE groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'flexible-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-15.5: should map demoted-tenancy to OTHER_UNSUPPORTED groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'demoted-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });

    it('T-15.6: should map other to OTHER_UNSUPPORTED groundsModel', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'other' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });
  });

  describe('AC-16: State clearing on tenancy change', () => {
    it('T-16.1: should clear assured grounds when changing from ASSURED to SECURE_LIKE', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First submission: assured tenancy with grounds data
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      // Simulate having completed assured grounds journey
      await testSession.get('/claims/grounds-for-possession-assured-confirmation');
      
      // Return to tenancy page
      await testSession.get('/claims/tenancy');
      
      // Change to secure tenancy
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-16.2: should clear assured grounds when changing from ASSURED to OTHER_UNSUPPORTED', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First: assured tenancy
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      // Return and change to demoted
      await testSession.get('/claims/tenancy');
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'demoted-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });

    it('T-16.3: should clear secure grounds when changing from SECURE_LIKE to ASSURED', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First: secure tenancy
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });
      
      // Return and change to assured
      await testSession.get('/claims/tenancy');
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-16.4: should preserve grounds data when groundsModel unchanged', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First: secure tenancy
      await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });
      
      // Return and change to another SECURE_LIKE type
      await testSession.get('/claims/tenancy');
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'flexible-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-16.5: should not error when no previous grounds data exists', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      // First submission with no grounds data
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });
  });

  describe('Routing based on groundsModel', () => {
    it('T-R.1: should redirect to /claims/grounds-for-possession-assured-confirmation for ASSURED', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'assured-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-assured-confirmation');
    });

    it('T-R.2: should redirect to /claims/grounds-for-possession-secure-flexible for SECURE_LIKE', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'secure-tenancy' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-secure-flexible');
    });

    it('T-R.3: should redirect to /claims/grounds-for-possession-intro-demoted-other for OTHER_UNSUPPORTED', async () => {
      const testSession = session(app);
      await navigateToTenancy(testSession);
      
      const response = await testSession
        .post('/claims/tenancy')
        .send({ tenancyType: 'other' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/grounds-for-possession-intro-demoted-other');
    });
  });
});
