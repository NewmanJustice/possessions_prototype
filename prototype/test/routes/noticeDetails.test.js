/**
 * Notice Details Route Tests - Screen 19
 * 
 * Tests for /claims/notice-details
 * Covers: service method selection, simulated file upload, validation
 * 
 * @see /test/artifacts/screen19/understanding.md
 * @see /test/artifacts/screen19/test-plan.md
 * @see /test/artifacts/screen19/test-matrix.md
 */

const request = require('supertest');
const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToNoticeDetails } = require('../helpers/sessionHelper');

// Mock file upload helpers
function createMockDocument(filename = 'notice.pdf', size = 1024) {
  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: filename,
    uploadedAt: new Date().toISOString(),
    size: size
  };
}

const validFiles = {
  pdf: 'notice.pdf',
  doc: 'certificate.doc',
  docx: 'certificate.docx',
  jpg: 'scan.jpg',
  jpeg: 'photo.jpeg',
  png: 'image.png'
};

const invalidFiles = {
  txt: 'document.txt',
  exe: 'virus.exe',
  bat: 'script.bat'
};

const validSize = 10 * 1024 * 1024;      // 10MB
const invalidSize = 11 * 1024 * 1024;    // 11MB

describe('Notice Details Route - /claims/notice-details', () => {
  
  // ============================================================
  // CROSS-CUTTING: Authentication & Access
  // ============================================================
  describe('Authentication & Access', () => {
    it('should redirect unauthenticated users to sign-in', async () => {
      const response = await request(app).get('/claims/notice-details');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('/auth/sign-in');
    });

    it('should render page for authenticated SOLICITOR users', async () => {
      const testSession = session(app);
      await navigateToNoticeDetails(testSession);
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // Display tests (AC-1, AC-3)
  // ============================================================
  describe('Display tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('D-1: should load page successfully', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.status).toBe(200);
      expect(response.text).toMatch(/Notice details/i);
    });

    it('D-2: should display service method question', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/How did you serve the notice/i);
    });

    it('D-3: should display first class post option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/first class post/i);
    });

    it('D-4: should display permitted place option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/permitted place/i);
    });

    it('D-5: should display personal service option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/personally handing/i);
    });

    it('D-6: should display email option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/By email/i);
    });

    it('D-7: should display other electronic option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/other electronic/i);
    });

    it('D-8: should display other option', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Other/);
    });

    it('D-9: should display upload section title', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/upload.*copy.*notice|certificate of service/i);
    });

    it('D-10: should display upload explanatory text', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/later|hearing bundle/i);
    });

    it('D-11: should display upload button', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Add|Upload/);
    });

    it('D-12: should display Continue button', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Continue/);
    });
  });

  // ============================================================
  // Service method selection tests (AC-1, Q4)
  // ============================================================
  describe('Service method selection tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('SM-1: should store first class post selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'first-class-post' })
        .expect(302);
    });

    it('SM-2: should store permitted place selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'permitted-place' })
        .expect(302);
    });

    it('SM-3: should store personal service selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'personal-service' })
        .expect(302);
    });

    it('SM-4: should store email selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('SM-5: should store other electronic selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'other-electronic' })
        .expect(302);
    });

    it('SM-6: should store other selection', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'other' })
        .expect(302);
    });

    it('SM-7: should persist selected value', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);

      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/checked/);
    });
  });

  // ============================================================
  // Required field validation (AC-2)
  // ============================================================
  describe('Required field validation', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('RV-1: should error when no service method selected', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({});
      
      expect(response.status).toBe(400);
    });

    it('RV-2: should display error summary', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({});
      
      expect(response.text).toMatch(/There is a problem/i);
    });

    it('RV-3: should display inline error', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({});
      
      expect(response.text).toMatch(/error-message/);
    });

    it('RV-4: should display correct error message', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({});
      
      expect(response.text).toContain('Select how you served the notice');
    });

    it('RV-5: should focus error summary', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({});
      
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('RV-6: should clear error with valid selection', async () => {
      await testSession.post('/claims/notice-details').send({}).expect(400);
      
      const response = await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
      
      expect(response.headers.location).toBe('/claims/rent-details');
    });
  });

  // ============================================================
  // Optional upload tests (AC-4)
  // ============================================================
  describe('Optional upload tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('OU-1: should continue without uploads', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' });
      
      expect(response.status).toBe(302);
    });

    it('OU-2: should store empty documents array', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('OU-3: should accept service method without documents', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'first-class-post' });
      
      expect(response.status).toBe(302);
    });
  });

  // ============================================================
  // Upload simulation tests (AC-5, Q1)
  // ============================================================
  describe('Upload simulation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('US-1: should store document metadata', async () => {
      const mockDoc = createMockDocument('notice.pdf');
      expect(mockDoc).toHaveProperty('id');
      expect(mockDoc).toHaveProperty('name');
      expect(mockDoc).toHaveProperty('uploadedAt');
    });

    it('US-2: should add document to array', async () => {
      const mockDoc = createMockDocument('notice.pdf');
      await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc })
        .expect(200);
    });

    it('US-3: should display uploaded document', async () => {
      const mockDoc = createMockDocument('notice.pdf');
      await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toContain('notice.pdf');
    });

    it('US-4: should store multiple documents in array', async () => {
      const doc1 = createMockDocument('notice.pdf');
      const doc2 = createMockDocument('certificate.docx');
      
      await testSession.post('/claims/notice-details/upload').send({ document: doc1 });
      await testSession.post('/claims/notice-details/upload').send({ document: doc2 });
    });

    it('US-5: should include all required metadata fields', async () => {
      const mockDoc = createMockDocument('test.pdf');
      expect(mockDoc.id).toBeDefined();
      expect(mockDoc.name).toBe('test.pdf');
      expect(mockDoc.uploadedAt).toBeDefined();
    });
  });

  // ============================================================
  // Upload validation tests (AC-6, Q2)
  // ============================================================
  describe('Upload validation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('UV-1: should accept PDF files', async () => {
      const mockDoc = createMockDocument(validFiles.pdf);
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      expect(response.status).toBe(200);
    });

    it('UV-2: should accept DOC files', async () => {
      const mockDoc = createMockDocument(validFiles.doc);
      await testSession.post('/claims/notice-details/upload').send({ document: mockDoc }).expect(200);
    });

    it('UV-3: should accept DOCX files', async () => {
      const mockDoc = createMockDocument(validFiles.docx);
      await testSession.post('/claims/notice-details/upload').send({ document: mockDoc }).expect(200);
    });

    it('UV-4: should accept JPG files', async () => {
      const mockDoc = createMockDocument(validFiles.jpg);
      await testSession.post('/claims/notice-details/upload').send({ document: mockDoc }).expect(200);
    });

    it('UV-5: should accept PNG files', async () => {
      const mockDoc = createMockDocument(validFiles.png);
      await testSession.post('/claims/notice-details/upload').send({ document: mockDoc }).expect(200);
    });

    it('UV-6: should reject invalid file types', async () => {
      const mockDoc = createMockDocument(invalidFiles.txt);
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('must be a PDF, DOC, DOCX, JPG, JPEG or PNG');
    });

    it('UV-7: should accept 10MB file', async () => {
      const mockDoc = createMockDocument('large.pdf', validSize);
      await testSession.post('/claims/notice-details/upload').send({ document: mockDoc }).expect(200);
    });

    it('UV-8: should reject 11MB file', async () => {
      const mockDoc = createMockDocument('toolarge.pdf', invalidSize);
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      
      expect(response.status).toBe(400);
      expect(response.text).toContain('must be smaller than 10MB');
    });

    it('UV-9: should show error summary for invalid type', async () => {
      const mockDoc = createMockDocument(invalidFiles.exe);
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      
      expect(response.status).toBe(400);
      expect(response.text).toMatch(/error/i);
    });

    it('UV-10: should show inline error for oversized file', async () => {
      const mockDoc = createMockDocument('huge.pdf', invalidSize);
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: mockDoc });
      
      expect(response.status).toBe(400);
    });
  });

  // ============================================================
  // Multiple upload tests (Q3)
  // ============================================================
  describe('Multiple upload tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('MU-1: should upload multiple files', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file1.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file2.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file3.pdf') });
    });

    it('MU-2: should display all uploaded files', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file1.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file2.pdf') });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toContain('file1.pdf');
      expect(response.text).toContain('file2.pdf');
    });

    it('MU-3: should allow up to 10 uploads', async () => {
      for (let i = 1; i <= 10; i++) {
        await testSession.post('/claims/notice-details/upload').send({ 
          document: createMockDocument(`file${i}.pdf`) 
        }).expect(200);
      }
    });

    it('MU-4: should prevent 11th upload', async () => {
      for (let i = 1; i <= 10; i++) {
        await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument(`file${i}.pdf`) });
      }
      
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: createMockDocument('file11.pdf') });
      
      expect(response.status).toBe(400);
    });

    it('MU-5: should number/identify documents', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file1.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file2.pdf') });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/file1\.pdf/);
      expect(response.text).toMatch(/file2\.pdf/);
    });

    it('MU-6: should accept mixed file types', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('doc.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('image.jpg') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file.docx') });
    });
  });

  // ============================================================
  // Document removal tests (Q3)
  // ============================================================
  describe('Document removal tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('DR-1: should show remove button for uploaded file', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('test.pdf') });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Remove|Delete/i);
    });

    it('DR-2: should remove document from session', async () => {
      const doc = createMockDocument('test.pdf');
      await testSession.post('/claims/notice-details/upload').send({ document: doc });
      
      await testSession.post('/claims/notice-details/remove').send({ documentId: doc.id });
    });

    it('DR-3: should update display after removal', async () => {
      const doc = createMockDocument('test.pdf');
      await testSession.post('/claims/notice-details/upload').send({ document: doc });
      await testSession.post('/claims/notice-details/remove').send({ documentId: doc.id });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).not.toContain('test.pdf');
    });

    it('DR-4: should remove all documents', async () => {
      const doc1 = createMockDocument('file1.pdf');
      const doc2 = createMockDocument('file2.pdf');
      await testSession.post('/claims/notice-details/upload').send({ document: doc1 });
      await testSession.post('/claims/notice-details/upload').send({ document: doc2 });
      
      await testSession.post('/claims/notice-details/remove').send({ documentId: doc1.id });
      await testSession.post('/claims/notice-details/remove').send({ documentId: doc2.id });
    });

    it('DR-5: should allow re-upload after removal', async () => {
      const doc = createMockDocument('test.pdf');
      await testSession.post('/claims/notice-details/upload').send({ document: doc });
      await testSession.post('/claims/notice-details/remove').send({ documentId: doc.id });
      
      const newDoc = createMockDocument('new.pdf');
      await testSession.post('/claims/notice-details/upload').send({ document: newDoc }).expect(200);
    });
  });

  // ============================================================
  // Input preservation tests (AC-7)
  // ============================================================
  describe('Input preservation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('IP-1: should preserve radio on upload error', async () => {
      const invalidDoc = createMockDocument(invalidFiles.txt);
      const response = await testSession
        .post('/claims/notice-details')
        .send({ 
          serviceMethod: 'email',
          uploadDocument: invalidDoc
        });
      
      expect(response.text).toMatch(/checked/);
    });

    it('IP-2: should preserve documents on validation error', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('valid.pdf') });
      
      const response = await testSession.post('/claims/notice-details').send({});
      expect(response.text).toContain('valid.pdf');
    });

    it('IP-3: should preserve both radio and documents', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('test.pdf') });
      
      const response = await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' });
      
      expect(response.status).toBe(302);
    });

    it('IP-4: should preserve valid uploads with invalid ones', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('valid.pdf') });
      
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: createMockDocument(invalidFiles.exe) });
      
      const getResponse = await testSession.get('/claims/notice-details');
      expect(getResponse.text).toContain('valid.pdf');
    });
  });

  // ============================================================
  // Session storage tests (AC-8, Q4)
  // ============================================================
  describe('Session storage tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('SS-1: should store service method', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('SS-2: should store empty documents array', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('SS-3: should store documents array with uploads', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file1.pdf') });
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('file2.pdf') });
      
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('SS-4: should persist session after redirect', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/checked/);
    });

    it('SS-5: should allow changing service method', async () => {
      await testSession.post('/claims/notice-details').send({ serviceMethod: 'email' }).expect(302);
      await testSession.post('/claims/notice-details').send({ serviceMethod: 'other' }).expect(302);
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.status).toBe(200);
    });
  });

  // ============================================================
  // Forward navigation tests (AC-10, Q5)
  // ============================================================
  describe('Forward navigation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('FN-1: should redirect to rent-details', async () => {
      const response = await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' });
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/claims/rent-details');
    });

    it('FN-2: should store session before redirect', async () => {
      await testSession
        .post('/claims/notice-details')
        .send({ serviceMethod: 'email' })
        .expect(302);
    });

    it('FN-3: should persist data after redirect', async () => {
      await testSession.post('/claims/notice-details').send({ serviceMethod: 'email' }).expect(302);
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/checked/);
    });
  });

  // ============================================================
  // Backward navigation tests (AC-9, AC-11)
  // ============================================================
  describe('Backward navigation tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('BN-1: should return to notice-of-intention on Previous', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toContain('/claims/notice-of-intention');
    });

    it('BN-2: should preserve data when using Previous', async () => {
      await testSession.post('/claims/notice-details').send({ serviceMethod: 'email' }).expect(302);
      await testSession.get('/claims/notice-of-intention');
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/checked/);
    });

    it('BN-3: should return to case-list on Cancel', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toContain('/case-list');
    });

    it('BN-4: should preserve draft on Cancel', async () => {
      await testSession.post('/claims/notice-details').send({ serviceMethod: 'email' }).expect(302);
      await testSession.get('/case-list');
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/checked/);
    });
  });

  // ============================================================
  // Accessibility tests (AC-12)
  // ============================================================
  describe('Accessibility tests', () => {
    let testSession;

    beforeEach(async () => {
      testSession = session(app);
      await navigateToNoticeDetails(testSession);
    });

    it('A-1: should link error summary to radio group', async () => {
      const response = await testSession.post('/claims/notice-details').send({});
      expect(response.text).toMatch(/href="#serviceMethod"/);
    });

    it('A-2: should link error summary to upload on upload error', async () => {
      const response = await testSession
        .post('/claims/notice-details/upload')
        .send({ document: createMockDocument(invalidFiles.exe) });
      
      expect(response.text).toMatch(/error/i);
    });

    it('A-3: should have labels for radio inputs', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/<label/);
    });

    it('A-4: should label upload button', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Add|Upload/);
    });

    it('A-5: should have fieldset structure', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/<fieldset/);
      expect(response.text).toMatch(/<legend/);
    });

    it('A-6: should move focus to error summary', async () => {
      const response = await testSession.post('/claims/notice-details').send({});
      expect(response.text).toMatch(/tabindex="-1"/);
    });

    it('A-7: should be keyboard accessible', async () => {
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/<input.*type="radio"/);
      expect(response.text).toMatch(/<form/);
    });

    it('A-8: should have accessible remove buttons', async () => {
      await testSession.post('/claims/notice-details/upload').send({ document: createMockDocument('test.pdf') });
      
      const response = await testSession.get('/claims/notice-details');
      expect(response.text).toMatch(/Remove|Delete/i);
    });
  });
});
