/**
 * Normalizes a value to a valid number
 * @param {*} value - The value to normalize
 * @param {number} defaultValue - The default value if normalization fails
 * @returns {number} The normalized number
 */
export const normalizeValue = (value, defaultValue = 0) => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return !isNaN(parsed) ? parsed : defaultValue;
  }
  if (typeof value === 'object' && value !== null) {
    console.warn('[dateSanitizer] Invalid date field (object):', value);
    return defaultValue;
  }
  return defaultValue;
};

/**
 * Sanitizes a date object to ensure all fields are valid numbers
 * @param {Object} date - The date object to sanitize
 * @returns {Object|null} The sanitized date object or null if invalid
 */
export const sanitizeDateObject = (date) => {
  if (!date || typeof date !== 'object') return null;

  if ('jy' in date || 'jm' in date || 'jd' in date) {
    const sanitized = {
      jy: normalizeValue(date.jy, 1403),
      jm: normalizeValue(date.jm, 1),
      jd: normalizeValue(date.jd, 1),
    };

    if ('hour' in date || 'minute' in date) {
      sanitized.hour = normalizeValue(date.hour, 0);
      sanitized.minute = normalizeValue(date.minute, 0);
    }

    return sanitized;
  }

  if ('year' in date || 'month' in date || 'day' in date) {
    const sanitized = {
      year: normalizeValue(date.year, 2024),
      month: normalizeValue(date.month, 1),
      day: normalizeValue(date.day, 1),
    };

    if ('hour' in date || 'minute' in date) {
      sanitized.hour = normalizeValue(date.hour, 0);
      sanitized.minute = normalizeValue(date.minute, 0);
    }

    return sanitized;
  }

  return null;
};

/**
 * Validates if a date object has valid numeric fields
 * @param {Object} date - The date object to validate
 * @returns {boolean} True if the date object is valid
 */
export const isValidDateObject = (date) => {
  if (!date || typeof date !== 'object') return false;

  if ('jy' in date && 'jm' in date && 'jd' in date) {
    return (
      typeof date.jy === 'number' &&
      typeof date.jm === 'number' &&
      typeof date.jd === 'number' &&
      !isNaN(date.jy) &&
      !isNaN(date.jm) &&
      !isNaN(date.jd)
    );
  }

  if ('year' in date && 'month' in date && 'day' in date) {
    return (
      typeof date.year === 'number' &&
      typeof date.month === 'number' &&
      typeof date.day === 'number' &&
      !isNaN(date.year) &&
      !isNaN(date.month) &&
      !isNaN(date.day)
    );
  }

  return false;
};
