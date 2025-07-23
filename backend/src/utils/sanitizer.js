const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized string
 */
const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') {
    return input;
  }

  const defaultOptions = {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {}, // No attributes allowed
    disallowedTagsMode: 'recursiveEscape',
  };

  const sanitizationOptions = { ...defaultOptions, ...options };

  return sanitizeHtml(input, sanitizationOptions).trim();
};

/**
 * Sanitize HTML content with limited allowed tags
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
const sanitizeHtmlContent = (html) => {
  if (typeof html !== 'string') {
    return html;
  }

  const options = {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
    ],
    allowedAttributes: {
      'a': ['href', 'target'],
      'img': ['src', 'alt', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'recursiveEscape',
  };

  return sanitizeHtml(html, options);
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return email;
  }

  return email.toLowerCase().trim();
};

/**
 * Sanitize URL
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeUrl = (url) => {
  if (typeof url !== 'string') {
    return url;
  }

  // Basic URL validation and sanitization
  const trimmedUrl = url.trim();
  
  // Add protocol if missing
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }

  return trimmedUrl;
};

/**
 * Sanitize object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

module.exports = {
  sanitizeInput,
  sanitizeHtmlContent,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeObject,
}; 