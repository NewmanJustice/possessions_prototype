/**
 * Helper functions for creating authenticated test sessions
 */

/**
 * Creates a fully authenticated session for a professional user
 * @param {object} agent - Supertest agent with session support
 * @returns {Promise<object>} The authenticated agent
 */
async function createAuthenticatedSession(agent) {
  // Step 1: Access code
  await agent
    .post('/access')
    .send({ accessCode: process.env.ACCESS_CODE || 'letmein' });

  // Step 2: User type selection
  await agent
    .post('/select-user-type')
    .send({ userType: 'professional' });

  // Step 3: Sign in
  await agent
    .post('/auth/sign-in')
    .send({
      email: 'test@solicitor.com',
      password: 'password123'
    });

  // Step 4: 2FA
  await agent
    .post('/auth/one-time-code')
    .send({ code: '123456' });

  return agent;
}

/**
 * Creates a session up to the sign-in step (before 2FA)
 * @param {object} agent - Supertest agent
 * @returns {Promise<object>} The partially authenticated agent
 */
async function createPartialAuthSession(agent) {
  await agent
    .post('/access')
    .send({ accessCode: process.env.ACCESS_CODE || 'letmein' });

  await agent
    .post('/select-user-type')
    .send({ userType: 'professional' });

  await agent
    .post('/auth/sign-in')
    .send({
      email: 'test@solicitor.com',
      password: 'password123'
    });

  return agent;
}

/**
 * Navigates to a specific point in the claims journey
 * @param {object} agent - Authenticated supertest agent
 * @param {string} destination - The destination route (e.g., 'claimant-type')
 * @returns {Promise<void>}
 */
async function navigateToClaimsStep(agent, destination) {
  await agent.post('/claims/start').send({});
  await agent.post('/claims/eligibility').send({});
  await agent.post('/claims/border-postcode').send({ propertyLocation: 'england' });

  if (destination === 'claim-type') {
    await agent.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
  } else if (destination === 'name-of-claimant') {
    await agent.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
    await agent.post('/claims/claim-type').send({ claimType: 'no' });
  }
}

/**
 * Navigates to the claimant name page
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the claimant name step
 */
async function navigateToClaimantName(agent) {
  await createAuthenticatedSession(agent);
  await agent.post('/claims/start').send({});
  await agent.post('/claims/eligibility').send({});
  await agent.post('/claims/border-postcode').send({ propertyLocation: 'england' });
  await agent.post('/claims/claimant-type').send({ claimantType: 'registered-provider' });
  await agent.post('/claims/claim-type').send({ claimType: 'no' });
  return agent;
}

/**
 * Navigates to the contact preferences page
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the contact preferences step
 */
async function navigateToContactPreferences(agent) {
  await navigateToClaimantName(agent);
  await agent
    .post('/claims/name-of-claimant')
    .send({ useRegisteredName: 'yes' });
  return agent;
}

/**
 * Navigates to the defendant details page
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the defendant details step
 */
async function navigateToDefendantDetails(agent) {
  await navigateToContactPreferences(agent);

  // Submit contact preferences to reach defendant-details
  await agent
    .post('/claims/contact-preferences')
    .send({
      useRegisteredEmail: 'yes',
      useRegisteredAddress: 'yes',
      providePhone: 'no'
    });

  // Manually inject property address into session for "same as property" tests
  // Since property address page doesn't exist in current journey, we inject it here
  const res = await agent.get('/claims/defendant-details');
  // Property address will be set via middleware or we'll rely on tests to set it up

  return agent;
}

/**
 * Navigates to the tenancy details page
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the tenancy step
 */
async function navigateToTenancy(agent) {
  await navigateToDefendantDetails(agent);
  await agent
    .post('/claims/defendant-details')
    .send({
      nameKnown: 'no',
      addressKnown: 'no',
      addAnotherDefendant: 'no'
    });
  return agent;
}

/**
 * Navigates to the assured journey confirmation page (Screen 13.1)
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the assured confirmation step
 */
async function navigateToAssuredConfirmation(agent) {
  await navigateToTenancy(agent);
  await agent
    .post('/claims/tenancy')
    .send({ tenancyType: 'assured-tenancy' });
  return agent;
}

/**
 * Navigates to the assured tenancy grounds selection page (Screen 13.1.1)
 * @param {object} agent - Supertest agent (will be authenticated if not already)
 * @returns {Promise<object>} The authenticated agent at the assured grounds selection step
 */
async function navigateToAssuredTenancyGrounds(agent) {
  await navigateToAssuredConfirmation(agent);
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'yes' });
  return agent;
}

/**
 * Navigate to Pre-action Protocol (Screen 16)
 * Entry: Screen 13.1.1 (No additional grounds) → Screen 16
 * @param {Object} agent - Supertest-session agent
 * @returns {Object} Agent with session state
 */
async function navigateToPreActionProtocol(agent) {
  await navigateToAssuredConfirmation(agent);
  
  // Screen 13.1: Select No (don't proceed with assured grounds)
  await agent
    .post('/claims/grounds-for-possession-assured-confirmation')
    .send({ assuredProceed: 'false' })
    .expect(302);
  
  // Screen 13.1.1: Select No (no additional grounds)
  await agent
    .post('/claims/grounds-for-possession-assured-selection')
    .send({ hasAdditionalGrounds: 'false' })
    .expect(302);
    
  return agent;
}

/**
 * Navigate to Mediation and Settlement (Screen 17)
 * Entry: Screen 16 (Pre-action protocol) → Screen 17
 * @param {Object} agent - Supertest-session agent
 * @returns {Object} Agent with session state
 */
async function navigateToMediationSettlement(agent) {
  await navigateToPreActionProtocol(agent);
  
  // Screen 16: Select either Yes or No (both go to mediation-settlement)
  await agent
    .post('/claims/preaction-protocol')
    .send({ followed: 'true' })
    .expect(302);
    
  return agent;
}

/**
 * Navigate to Notice of Intention (Screen 18)
 * Entry: Screen 17 (Mediation and settlement) → Screen 18
 * @param {Object} agent - Supertest-session agent
 * @returns {Object} Agent with session state
 */
async function navigateToNoticeOfIntention(agent) {
  await navigateToMediationSettlement(agent);
  
  // Screen 17: Submit mediation and settlement
  await agent
    .post('/claims/mediation-settlement')
    .send({ 
      mediationAttempted: 'false',
      settlementAttempted: 'false'
    })
    .expect(302);
    
  return agent;
}

/**
 * DEPRECATED: Old navigation helper for rent arrears question
 * Use navigateToAssuredConfirmation instead
 */
async function navigateToGrounds(agent) {
  console.warn('navigateToGrounds is deprecated - use navigateToAssuredConfirmation');
  return navigateToAssuredConfirmation(agent);
}

module.exports = {
  createAuthenticatedSession,
  createPartialAuthSession,
  navigateToClaimsStep,
  navigateToClaimantName,
  navigateToContactPreferences,
  navigateToDefendantDetails,
  navigateToTenancy,
  navigateToAssuredConfirmation,
  navigateToAssuredTenancyGrounds,
  navigateToPreActionProtocol,
  navigateToMediationSettlement,
  navigateToNoticeOfIntention,
  navigateToGrounds  // Deprecated - kept for backward compatibility
};
