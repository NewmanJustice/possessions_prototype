/**
 * @fileoverview Tests for Assured Tenancy Grounds Selection page (Screen 13.1.1)
 * Route: /claims/grounds-for-possession-assured-selection
 *
 * Tests grounds checkboxes (8, 10, 11), other grounds radio branching,
 * navigation, and session persistence.
 */

const session = require('supertest-session');
const app = require('../../src/app');
const { navigateToAssuredTenancyGrounds, createAuthenticatedSession } = require('../helpers/sessionHelper');

describe('Assured Tenancy Grounds Selection - /claims/grounds-for-possession-assured-selection', () => {
  let agent;

  beforeEach(() => {
    agent = session(app);
  });

  // ===========================================
  // GROUNDS CHECKBOXES (AC-1, AC-2, AC-3)
  // ===========================================
  describe('Grounds Checkboxes', () => {
    describe('AC-1: Display grounds', () => {
      test('T-1.1: displays ground 8 checkbox with label', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/ground\s*8/i);
        expect(res.text).toMatch(/serious\s+rent\s+arrears/i);
      });

      test('T-1.2: displays ground 10 checkbox with label', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/ground\s*10/i);
        expect(res.text).toMatch(/rent\s+arrears/i);
      });

      test('T-1.3: displays ground 11 checkbox with label', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/ground\s*11/i);
        expect(res.text).toMatch(/persistent\s+delay/i);
      });

      test('T-1.4: displays explanatory text', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text.toLowerCase()).toMatch(/grounds|possession/);
      });
    });

    describe('AC-2: All grounds are optional', () => {
      test('T-2.1: accepts submission with no grounds selected', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({ hasAdditionalGrounds: 'no' });

        expect(res.statusCode).toBe(302);
      });

      test('T-2.2: accepts submission with single ground selected', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            hasAdditionalGrounds: 'no'
          });

        expect(res.statusCode).toBe(302);
      });

      test('T-2.3: accepts submission with all grounds selected', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            ground10: 'true',
            ground11: 'true',
            hasAdditionalGrounds: 'no'
          });

        expect(res.statusCode).toBe(302);
      });
    });

    describe('AC-3: Selected grounds are persisted', () => {
      test('T-3.1: stores ground 8 selection in session', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
      });

      test('T-3.2: stores ground 10 selection in session', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground10: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground10.*checked|checked.*ground10/i);
      });

      test('T-3.3: stores ground 11 selection in session', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground11: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground11.*checked|checked.*ground11/i);
      });

      test('T-3.4: stores multiple grounds in session', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            ground10: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
        expect(res.text).toMatch(/ground10.*checked|checked.*ground10/i);
      });

      test('T-3.5: stores all grounds in session', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            ground10: 'true',
            ground11: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
        expect(res.text).toMatch(/ground10.*checked|checked.*ground10/i);
        expect(res.text).toMatch(/ground11.*checked|checked.*ground11/i);
      });

      test('T-3.6: unselected grounds not checked on revisit', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            hasAdditionalGrounds: 'no'
          });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
        expect(res.text).not.toMatch(/ground10.*checked/i);
        expect(res.text).not.toMatch(/ground11.*checked/i);
      });
    });
  });

  // ===========================================
  // OTHER GROUNDS RADIO (AC-4, AC-5)
  // ===========================================
  describe('Other Grounds Radio', () => {
    describe('AC-4: Ask about other grounds', () => {
      test('T-4.1: displays radio question', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/other\s+grounds\s+for\s+possession/i);
      });

      test('T-4.2: displays Yes option', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/type="radio".*value="yes"|value="yes".*type="radio"/i);
      });

      test('T-4.3: displays No option', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/type="radio".*value="no"|value="no".*type="radio"/i);
      });
    });

    describe('AC-5: Branching selection required', () => {
      test('T-5.1: shows error when no radio selected', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({});

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/error/i);
      });

      test('T-5.2: error message matches AC spec', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({});

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/select\s+whether\s+you\s+have\s+other\s+grounds/i);
      });

      test('T-5.3: GOV.UK error summary shown', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({});

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/govuk-error-summary/);
      });

      test('T-5.4: error summary links to radio group', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({});

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/href="#hasAdditionalGrounds/i);
      });
    });
  });

  // ===========================================
  // BRANCHING NAVIGATION (AC-6, AC-7)
  // ===========================================
  describe('Branching Navigation', () => {
    describe('AC-6: Yes path navigation', () => {
      test('T-6.1: Yes redirects to other-tenancy-grounds', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({ hasAdditionalGrounds: 'yes' });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/claims/grounds-for-possession');
      });

      test('T-6.2: Yes stores hasAdditionalGrounds = true', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({ hasAdditionalGrounds: 'yes' });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/hasAdditionalGrounds.*yes.*checked|checked.*yes/i);
      });
    });

    describe('AC-7: No path navigation', () => {
      test('T-7.1: No redirects to reasons-for-possessions', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({ hasAdditionalGrounds: 'no' });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/claims/preaction-protocol');
      });

      test('T-7.2: No stores hasAdditionalGrounds = false', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({ hasAdditionalGrounds: 'no' });

        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.text).toMatch(/hasAdditionalGrounds.*no.*checked|checked.*no/i);
      });
    });
  });

  // ===========================================
  // NAVIGATION (AC-8, AC-9)
  // ===========================================
  describe('Navigation', () => {
    describe('AC-8: Previous navigation', () => {
      test('T-8.1: Previous link present', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/href=".*\/claims\/grounds-for-possession-assured-confirmation.*"|href='.*\/claims\/grounds-for-possession-assured-confirmation.*'/i);
      });

      test('T-8.2: Previous navigates to confirmation page', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-confirmation');

        expect(res.statusCode).toBe(200);
      });

      test('T-8.3: Previous preserves checkbox selections', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        // Make selections but don't submit
        await agent
          .post('/claims/grounds-for-possession-assured-selection')
          .send({
            ground8: 'true',
            ground10: 'true'
          });

        // Go back and return
        await agent.get('/claims/grounds-for-possession-assured-confirmation');
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
        expect(res.text).toMatch(/ground10.*checked|checked.*ground10/i);
      });
    });

    describe('AC-9: Cancel behaviour', () => {
      test('T-9.1: Cancel link present', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/href=".*\/case-list.*"|href='.*\/case-list.*'/i);
      });

      test('T-9.2: Cancel navigates to case-list', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        const res = await agent.get('/case-list');

        expect(res.statusCode).toBe(200);
      });

      test('T-9.3: Cancel preserves claim draft', async () => {
        await navigateToAssuredTenancyGrounds(agent);
        await agent.get('/case-list');

        // Can return to claim journey
        const res = await agent.get('/claims/grounds-for-possession-assured-selection');
        expect(res.statusCode).toBe(200);
      });
    });
  });

  // ===========================================
  // RE-VISIT BEHAVIOUR
  // ===========================================
  describe('Re-visit Behaviour', () => {
    test('T-R.1: checkboxes pre-populated on re-visit', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      await agent
        .post('/claims/grounds-for-possession-assured-selection')
        .send({
          ground8: 'true',
          ground11: 'true',
          hasAdditionalGrounds: 'no'
        });

      const res = await agent.get('/claims/grounds-for-possession-assured-selection');
      expect(res.text).toMatch(/ground8.*checked|checked.*ground8/i);
      expect(res.text).toMatch(/ground11.*checked|checked.*ground11/i);
    });

    test('T-R.2: radio pre-populated on re-visit', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      await agent
        .post('/claims/grounds-for-possession-assured-selection')
        .send({ hasAdditionalGrounds: 'yes' });

      const res = await agent.get('/claims/grounds-for-possession-assured-selection');
      expect(res.text).toMatch(/yes.*checked/i);
    });

    test('T-R.3: mixed state preserved correctly', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      await agent
        .post('/claims/grounds-for-possession-assured-selection')
        .send({
          ground10: 'true',
          hasAdditionalGrounds: 'no'
        });

      const res = await agent.get('/claims/grounds-for-possession-assured-selection');
      expect(res.text).not.toMatch(/ground8.*checked/i);
      expect(res.text).toMatch(/ground10.*checked|checked.*ground10/i);
      expect(res.text).not.toMatch(/ground11.*checked/i);
    });
  });

  // ===========================================
  // ACCESSIBILITY (AC-10)
  // ===========================================
  describe('Accessibility', () => {
    test('T-10.1: error summary shown on validation failure', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      await agent
        .post('/claims/grounds-for-possession-assured-selection')
        .send({});

      const res = await agent.get('/claims/grounds-for-possession-assured-selection');
      expect(res.text).toMatch(/govuk-error-summary/);
    });

    test('T-10.2: checkboxes have labels', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/<label.*for=.*ground/i);
    });

    test('T-10.3: radios have labels', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/<label.*for=.*hasAdditionalGrounds/i);
    });

    test('T-10.4: page uses GOV.UK checkbox component', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/govuk-checkboxes/);
    });

    test('T-10.5: page uses GOV.UK radios component', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/govuk-radios/);
    });
  });

  // ===========================================
  // CROSS-CUTTING
  // ===========================================
  describe('Cross-cutting', () => {
    test('T-X.1: requires authentication', async () => {
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toMatch(/sign-in|access/i);
    });

    test('T-X.2: page has correct title', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/<title>.*Grounds for possession.*<\/title>/i);
    });

    test('T-X.3: error state shows Error in title', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      await agent
        .post('/claims/grounds-for-possession-assured-selection')
        .send({});

      const res = await agent.get('/claims/grounds-for-possession-assured-selection');
      expect(res.text).toMatch(/<title>.*Error:.*Grounds for possession.*<\/title>/i);
    });

    test('T-X.4: Continue button present', async () => {
      await navigateToAssuredTenancyGrounds(agent);
      const res = await agent.get('/claims/grounds-for-possession-assured-selection');

      expect(res.text).toMatch(/continue/i);
      expect(res.text).toMatch(/type="submit"|type='submit'/i);
    });
  });
});
