import { toLocalizedNumbers } from '@/locales';
import { sanitizeDateObject, isValidDateObject } from './dateSanitizer';

/**
 * Formats a single date object to a display string
 * @param {Object} date - The date object to format
 * @param {string} format - The format string (e.g., 'YYYY/MM/DD')
 * @param {boolean} enableTime - Whether to include time in the output
 * @param {string} numberSystem - The number system for localization
 * @returns {string} The formatted date string
 */
export const formatSingleDate = (date, format, enableTime, numberSystem) => {
  let processedDate = date;

  if (!isValidDateObject(date)) {
    console.warn('[dateDisplay] Invalid date format, attempting to sanitize:', date);
    processedDate = sanitizeDateObject(date);

    if (!processedDate) {
      console.error('[dateDisplay] Could not sanitize date:', date);
      return '';
    }
  }

  const { jy, jm, jd, year, month, day, hour, minute } = processedDate;

  const y = jy ?? year;
  const m = jm ?? month;
  const d = jd ?? day;

  let str = format
    .replace('YYYY', String(y))
    .replace('MM', String(m).padStart(2, '0'))
    .replace('DD', String(d).padStart(2, '0'));
  str = toLocalizedNumbers(str, numberSystem);

  if (
    enableTime &&
    hour != null &&
    minute != null &&
    typeof hour === 'number' &&
    typeof minute === 'number'
  ) {
    const h = toLocalizedNumbers(String(hour).padStart(2, '0'), numberSystem);
    const m = toLocalizedNumbers(String(minute).padStart(2, '0'), numberSystem);
    str += ` ${h}:${m}`;
  }
  return str;
};

/**
 * Formats a date range to a display string
 * @param {Object} value - The range object with start and end dates
 * @param {string} format - The format string
 * @param {boolean} enableTime - Whether to include time
 * @param {string} numberSystem - The number system for localization
 * @returns {string} The formatted range string
 */
export const formatRangeDate = (value, format, enableTime, numberSystem) => {
  const { start, end } = value || {};
  if (!start) return '';

  let sanitizedStart = start;
  if (!isValidDateObject(start)) {
    sanitizedStart = sanitizeDateObject(start);
    if (!sanitizedStart) return '';
  }

  if (end) {
    let sanitizedEnd = end;
    if (!isValidDateObject(end)) {
      sanitizedEnd = sanitizeDateObject(end);
    }

    if (sanitizedEnd) {
      return `${formatSingleDate(sanitizedStart, format, enableTime, numberSystem)} - ${formatSingleDate(sanitizedEnd, format, enableTime, numberSystem)}`;
    }
  }
  return formatSingleDate(sanitizedStart, format, enableTime, numberSystem);
};

/**
 * Formats multiple dates to a display string
 * @param {Array} value - Array of date objects
 * @param {string} format - The format string
 * @param {boolean} enableTime - Whether to include time
 * @param {string} numberSystem - The number system for localization
 * @returns {string} The formatted dates string
 */
export const formatMultipleDates = (value, format, enableTime, numberSystem) => {
  if (!Array.isArray(value) || !value.length) return '';

  const processedDates = value
    .map((date) => {
      if (isValidDateObject(date)) return date;
      return sanitizeDateObject(date);
    })
    .filter((date) => date !== null);

  if (!processedDates.length) return '';
  return processedDates
    .map((date) => formatSingleDate(date, format, enableTime, numberSystem))
    .join('، ');
};
