/**
 * Date utility functions for Timing MCP Server
 *
 * IMPORTANT: The Timing API requires different date formats depending on the endpoint:
 * - Time entries: Full ISO 8601 with timezone (e.g. "2026-01-01T00:00:00+00:00")
 * - Reports: Date-only format is acceptable (e.g. "2026-01-01")
 *
 * See: https://web.timingapp.com/docs/index.html#request-and-response-data
 */

/** Matches date-only format: YYYY-MM-DD */
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/** Matches full ISO 8601 with time (with or without timezone) */
const FULL_ISO_REGEX = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/;

/**
 * Validate ISO 8601 date format
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDateFormat(dateString: string): boolean {
  // Basic ISO 8601 validation (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  // Accepts both positive and negative timezone offsets (+HH:MM or -HH:MM) and Z
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}:?\d{2}|Z)?)?$/;
  return iso8601Regex.test(dateString);
}

/**
 * Ensure a date string is in full ISO 8601 format with timezone.
 * Required for time entry endpoints (not reports).
 *
 * - "2026-03-01" → "2026-03-01T00:00:00+00:00" (start of day, UTC)
 * - "2026-03-01T10:30:00" → "2026-03-01T10:30:00+00:00" (append UTC)
 * - "2026-03-01T10:30:00+01:00" → unchanged (already has timezone)
 * - "2026-03-01T10:30:00Z" → unchanged
 *
 * @param dateString - Input date string
 * @param mode - "start" appends T00:00:00, "end" appends T23:59:59
 * @returns Full ISO 8601 string with timezone
 */
export function ensureFullISO(dateString: string, mode: 'start' | 'end' = 'start'): string {
  // Already has timezone? Return as-is
  if (/[Zz]$/.test(dateString) || /[+-]\d{2}:?\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Date-only format: add time and timezone
  if (DATE_ONLY_REGEX.test(dateString)) {
    const time = mode === 'end' ? 'T23:59:59' : 'T00:00:00';
    return `${dateString}${time}+00:00`;
  }

  // Full ISO without timezone: append UTC
  if (FULL_ISO_REGEX.test(dateString)) {
    return `${dateString}+00:00`;
  }

  // Fallback: return as-is and let the API validate
  return dateString;
}

/**
 * Validate date range
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns True if valid range, throws error if invalid
 * @throws Error if dates are invalid or range is invalid
 */
export function validateDateRange(startDate: string, endDate: string): void {
  if (!isValidDateFormat(startDate)) {
    throw new Error(`Invalid start date format: ${startDate}. Expected ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)`);
  }
  
  if (!isValidDateFormat(endDate)) {
    throw new Error(`Invalid end date format: ${endDate}. Expected ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)`);
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start date: ${startDate}`);
  }
  
  if (isNaN(end.getTime())) {
    throw new Error(`Invalid end date: ${endDate}`);
  }
  
  if (start > end) {
    throw new Error(`Start date (${startDate}) must be before or equal to end date (${endDate})`);
  }
}

/**
 * Format date for display
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}
