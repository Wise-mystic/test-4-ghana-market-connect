import { LANGUAGES, DEFAULT_LANGUAGE, isValidLanguage } from '../config/languages.js';

/**
 * Middleware to handle language preferences
 * Sets the language based on:
 * 1. User's preferred language (if authenticated)
 * 2. Accept-Language header
 * 3. Default language
 */
export const languageMiddleware = async (req, res, next) => {
  try {
    let language = DEFAULT_LANGUAGE;

    // If user is authenticated, use their preferred language
    if (req.user && req.user.preferredLanguage) {
      language = req.user.preferredLanguage;
    } 
    // Otherwise check Accept-Language header
    else if (req.headers['accept-language']) {
      const acceptLanguage = req.headers['accept-language'].split(',')[0].trim();
      if (isValidLanguage(acceptLanguage)) {
        language = acceptLanguage;
      }
    }

    // Set language in request object
    req.language = language;
    
    // Add language helper methods to response object
    res.setLanguage = (lang) => {
      if (isValidLanguage(lang)) {
        req.language = lang;
      }
    };

    next();
  } catch (error) {
    console.error('Language middleware error:', error);
    req.language = DEFAULT_LANGUAGE;
    next();
  }
}; 