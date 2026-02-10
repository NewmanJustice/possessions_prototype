/**
 * Journey Map Service
 * Provides zone/station definitions and status calculation for the journey map feature.
 */

const JOURNEY_ZONES = [
  {
    id: 'eligibility',
    name: 'Eligibility',
    colour: 'green',
    stations: [
      {
        id: 'check-eligibility',
        title: 'Check eligibility',
        url: '/claims/eligibility',
        question: 'Is this property eligible for a possession claim?',
        requirements: ['Property must be in England'],
        sessionField: 'eligibilityConfirmed'
      },
      {
        id: 'property-location',
        title: 'Property location',
        url: '/claims/border-postcode',
        question: 'Where is the property located?',
        requirements: ['Property postcode'],
        sessionField: 'propertyLocation'
      },
      {
        id: 'claimant-type',
        title: 'Claimant type',
        url: '/claims/claimant-type',
        question: 'What type of claimant are you?',
        requirements: [],
        sessionField: 'claimantType'
      }
    ]
  },
  {
    id: 'claim-type',
    name: 'Claim Type',
    colour: 'green',
    stations: [
      {
        id: 'type-of-claim',
        title: 'Type of claim',
        url: '/claims/claim-type',
        question: 'What type of possession claim are you making?',
        requirements: [],
        sessionField: 'claimType'
      }
    ]
  },
  {
    id: 'claimant-details',
    name: 'Claimant Details',
    colour: 'blue',
    stations: [
      {
        id: 'claimant-name',
        title: 'Claimant name',
        url: '/claims/name-of-claimant',
        question: 'What is the claimant name?',
        requirements: ['Full name or organisation name'],
        sessionField: 'claimant.name'
      },
      {
        id: 'contact-preferences',
        title: 'Contact preferences',
        url: '/claims/contact-preferences',
        question: 'What contact details should appear on the claim?',
        requirements: ['Email address', 'Postal address'],
        sessionField: 'claimant.contactPreferences'
      }
    ]
  },
  {
    id: 'defendant-details',
    name: 'Defendant Details',
    colour: 'blue',
    stations: [
      {
        id: 'defendant-information',
        title: 'Defendant information',
        url: '/claims/defendant-details',
        question: 'Who is the defendant?',
        requirements: ['Defendant name', 'Defendant address'],
        sessionField: 'defendant.nameKnown'
      }
    ]
  },
  {
    id: 'property-tenancy',
    name: 'Property & Tenancy',
    colour: 'purple',
    stations: [
      {
        id: 'property-address',
        title: 'Property address',
        url: '/claims/property-address',
        question: 'What is the address of the property?',
        requirements: ['Full property address'],
        sessionField: 'property.address'
      },
      {
        id: 'tenancy-type',
        title: 'Type of tenancy',
        url: '/claims/tenancy',
        question: 'What type of tenancy is this?',
        requirements: ['Tenancy agreement details'],
        sessionField: 'tenancy.type'
      }
    ]
  },
  {
    id: 'grounds-for-possession',
    name: 'Grounds for Possession',
    colour: 'orange',
    stations: [
      {
        id: 'grounds-selection',
        title: 'Grounds selection',
        url: '/claims/grounds',
        question: 'What grounds are you claiming possession on?',
        requirements: ['Knowledge of applicable grounds'],
        sessionField: 'grounds'
      }
    ]
  },
  {
    id: 'pre-action-notice',
    name: 'Pre-action & Notice',
    colour: 'orange',
    stations: [
      {
        id: 'preaction-protocol',
        title: 'Pre-action protocol',
        url: '/claims/preaction-protocol',
        question: 'Have you complied with the pre-action protocol?',
        requirements: ['Evidence of compliance'],
        sessionField: 'preActionProtocol'
      },
      {
        id: 'notice-served',
        title: 'Notice served',
        url: '/claims/notice-of-intention',
        question: 'Has notice been served?',
        requirements: ['Notice details'],
        sessionField: 'notice.served'
      },
      {
        id: 'notice-details',
        title: 'Notice details',
        url: '/claims/notice-details',
        question: 'What are the notice details?',
        requirements: ['Date of notice', 'Method of service'],
        sessionField: 'notice.details'
      }
    ]
  },
  {
    id: 'rent-arrears',
    name: 'Rent & Arrears',
    colour: 'red',
    stations: [
      {
        id: 'rent-amount',
        title: 'Rent amount',
        url: '/claims/rent-details',
        question: 'What is the rent amount?',
        requirements: ['Current rent amount', 'Payment frequency'],
        sessionField: 'rent.amount'
      },
      {
        id: 'arrears-details',
        title: 'Arrears details',
        url: '/claims/details-of-rent-arrears',
        question: 'What are the arrears details?',
        requirements: ['Total arrears', 'Arrears calculation'],
        sessionField: 'rent.arrears'
      }
    ]
  },
  {
    id: 'money-judgment',
    name: 'Money Judgment',
    colour: 'red',
    stations: [
      {
        id: 'request-judgment',
        title: 'Request judgment',
        url: '/claims/money-judgement',
        question: 'Are you requesting a money judgment?',
        requirements: [],
        sessionField: 'moneyJudgment.requested'
      },
      {
        id: 'claimant-circumstances',
        title: 'Claimant circumstances',
        url: '/claims/claimants-circumstances',
        question: 'What are the claimant circumstances?',
        requirements: [],
        sessionField: 'claimantCircumstances'
      },
      {
        id: 'defendant-circumstances',
        title: 'Defendant circumstances',
        url: '/claims/defendants-circumstances',
        question: 'What are the defendant circumstances?',
        requirements: [],
        sessionField: 'defendantCircumstances'
      }
    ]
  },
  {
    id: 'alternatives',
    name: 'Alternatives',
    colour: 'yellow',
    stations: [
      {
        id: 'alternative-remedies',
        title: 'Alternative remedies',
        url: '/claims/alternative-to-possession',
        question: 'Are you seeking alternative remedies?',
        requirements: [],
        sessionField: 'alternatives.remedies'
      }
    ]
  },
  {
    id: 'additional-info',
    name: 'Additional Info',
    colour: 'grey',
    stations: [
      {
        id: 'claiming-costs',
        title: 'Claiming costs',
        url: '/claims/claiming-costs',
        question: 'Are you claiming costs?',
        requirements: [],
        sessionField: 'costs'
      },
      {
        id: 'additional-reasons',
        title: 'Additional reasons',
        url: '/claims/additional-reasons-for-possession',
        question: 'Do you have additional reasons for possession?',
        requirements: [],
        sessionField: 'additionalReasons'
      },
      {
        id: 'underlessee-mortgagee',
        title: 'Underlessee or mortgagee',
        url: '/claims/underlessee-or-mortgagee',
        question: 'Is there an underlessee or mortgagee?',
        requirements: [],
        sessionField: 'underlesseeMortgagee'
      },
      {
        id: 'additional-documents',
        title: 'Additional documents',
        url: '/claims/upload-additional-document',
        question: 'Do you have additional documents to upload?',
        requirements: ['Supporting documents'],
        sessionField: 'additionalDocuments'
      },
      {
        id: 'applications',
        title: 'Applications',
        url: '/claims/applications',
        question: 'Are you making any applications?',
        requirements: [],
        sessionField: 'applications'
      }
    ]
  },
  {
    id: 'submit',
    name: 'Submit',
    colour: 'black',
    stations: [
      {
        id: 'language-used',
        title: 'Language used',
        url: '/claims/language-used',
        question: 'What language should be used for the claim?',
        requirements: [],
        sessionField: 'languageUsed'
      },
      {
        id: 'completing-claim',
        title: 'Completing your claim',
        url: '/claims/completing-your-claim',
        question: 'How do you want to complete your claim?',
        requirements: [],
        sessionField: 'completingClaim'
      },
      {
        id: 'statement-of-truth',
        title: 'Statement of truth',
        url: '/claims/statement-of-truth',
        question: 'Who will sign the statement of truth?',
        requirements: ['Signatory details'],
        sessionField: 'statementOfTruth'
      },
      {
        id: 'check-answers',
        title: 'Check your answers',
        url: '/claims/check-your-answers',
        question: 'Review your claim before submitting',
        requirements: [],
        sessionField: 'answersChecked'
      },
      {
        id: 'pay-fee',
        title: 'Pay claim fee',
        url: '/claims/pay-claim-fee',
        question: 'Pay the claim fee to submit',
        requirements: ['Payment details'],
        sessionField: 'feePaid'
      }
    ]
  }
];

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj, path) {
  if (!path) return undefined;
  const parts = path.split('.');
  let value = obj;
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  return value;
}

/**
 * Find station by ID across all zones
 */
function findStationById(stationId) {
  for (const zone of JOURNEY_ZONES) {
    for (const station of zone.stations) {
      if (station.id === stationId) {
        return station;
      }
    }
  }
  return null;
}

/**
 * Check if a station is completed based on session data
 */
function isStationCompleted(session, station) {
  if (!session || !session.claimDraft) return false;
  const value = getNestedValue(session.claimDraft, station.sessionField);
  return value !== undefined && value !== null && value !== '';
}

/**
 * Get all journey zones with station definitions
 */
function getJourneyZones() {
  return JOURNEY_ZONES;
}

/**
 * Get current station ID based on URL
 */
function getCurrentStationId(url) {
  if (!url) return null;
  const path = url.split('?')[0];

  for (const zone of JOURNEY_ZONES) {
    for (const station of zone.stations) {
      if (station.url === path) {
        return station.id;
      }
    }
  }
  return null;
}

/**
 * Get station status
 */
function getStationStatus(session, stationId, currentUrl) {
  const station = findStationById(stationId);
  if (!station) return 'upcoming';

  const currentPath = currentUrl ? currentUrl.split('?')[0] : '';

  if (station.url === currentPath) {
    return 'current';
  }

  if (isStationCompleted(session, station)) {
    return 'completed';
  }

  return 'upcoming';
}

/**
 * Get array of completed station IDs
 */
function getCompletedStationIds(session) {
  const completed = [];
  for (const zone of JOURNEY_ZONES) {
    for (const station of zone.stations) {
      if (isStationCompleted(session, station)) {
        completed.push(station.id);
      }
    }
  }
  return completed;
}

/**
 * Get selected branch based on tenancy type
 */
function getSelectedBranch(session) {
  if (!session || !session.claimDraft || !session.claimDraft.tenancy) {
    return null;
  }

  const tenancyType = session.claimDraft.tenancy.type;
  if (!tenancyType) return null;

  if (tenancyType === 'assured-tenancy') return 'assured';
  if (tenancyType === 'secure-tenancy') return 'secure';
  if (tenancyType === 'flexible-tenancy') return 'flexible';

  return null;
}

/**
 * Get full journey map data for template rendering
 */
function getJourneyMapData(session, currentUrl) {
  const currentStationId = getCurrentStationId(currentUrl);
  const selectedBranch = getSelectedBranch(session);

  const zones = JOURNEY_ZONES.map(zone => ({
    ...zone,
    stations: zone.stations.map(station => ({
      ...station,
      status: getStationStatus(session, station.id, currentUrl)
    }))
  }));

  return {
    zones,
    currentStationId,
    selectedBranch
  };
}

module.exports = {
  getJourneyZones,
  getCurrentStationId,
  getStationStatus,
  getCompletedStationIds,
  getSelectedBranch,
  getJourneyMapData
};
