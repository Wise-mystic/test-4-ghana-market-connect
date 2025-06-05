/**
 * Language configuration for the application
 * ISO 639-2/B language codes are used where applicable
 */

export const LANGUAGES = {
  ENGLISH: 'en',
  TWI: 'tw',
  GA: 'gaa',
  EWE: 'ee',
  FANTE: 'fat',
  DAGBANI: 'dag'
};

export const LANGUAGE_NAMES = {
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.TWI]: 'Twi',
  [LANGUAGES.GA]: 'Ga',
  [LANGUAGES.EWE]: 'Ewe',
  [LANGUAGES.FANTE]: 'Fante',
  [LANGUAGES.DAGBANI]: 'Dagbani'
};

export const LANGUAGE_MESSAGES = {
  [LANGUAGES.ENGLISH]: {
    selectLanguage: 'Please select a valid language preference',
    invalidLanguage: 'Invalid language selection',
    required: 'This field is required'
  },
  [LANGUAGES.TWI]: {
    selectLanguage: 'Yɛsrɛ sɛ mubɛtie kasa a ɛfata',
    invalidLanguage: 'Kasa a mubɛtie no nni hɔ',
    required: 'Saa field yi ɛsɛ sɛ ɛbɛyɛ'
  },
  [LANGUAGES.GA]: {
    selectLanguage: 'Tse kɛ gbɛjegbɛ lɛɛ kɛhaa ni',
    invalidLanguage: 'Gbɛjegbɛ lɛɛ nɛɛ mli',
    required: 'Saa field lɛɛ ɛsɛ sɛ ɛbɛyɛ'
  },
  [LANGUAGES.EWE]: {
    selectLanguage: 'Taflatsɛ kpɔkpɔ ɖe gbeɖiɖi me',
    invalidLanguage: 'Gbeɖiɖi me kpɔkpɔ ɖeke',
    required: 'Saa field sia ɖe dɔ wu'
  },
  [LANGUAGES.FANTE]: {
    selectLanguage: 'Mesrɛ sɛ wobɛtie kasa a ɛfata',
    invalidLanguage: 'Kasa a wobɛtie no nni hɔ',
    required: 'Saa field yi ɛsɛ sɛ ɛbɛyɛ'
  },
  [LANGUAGES.DAGBANI]: {
    selectLanguage: 'Piligu ka dii kpɛm',
    invalidLanguage: 'Kpɛm dinli ka dii',
    required: 'Saa field ŋɔ ka dii kpɛm'
  }
};

export const DEFAULT_LANGUAGE = LANGUAGES.ENGLISH;

export const isValidLanguage = (lang) => Object.values(LANGUAGES).includes(lang);

export const getLanguageName = (code) => LANGUAGE_NAMES[code] || 'Unknown';

export const getMessage = (code, key) => {
  const messages = LANGUAGE_MESSAGES[code] || LANGUAGE_MESSAGES[DEFAULT_LANGUAGE];
  return messages[key] || LANGUAGE_MESSAGES[DEFAULT_LANGUAGE][key];
}; 