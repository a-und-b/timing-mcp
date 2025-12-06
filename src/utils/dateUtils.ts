/**
 * Date utility functions for Timing MCP Server
 */

/**
 * Validate ISO 8601 date format
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDateFormat(dateString: string): boolean {
  // Basic ISO 8601 validation (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  // Accepts both positive and negative timezone offsets (+HH:MM or -HH:MM) and Z
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?)?$/;
  return iso8601Regex.test(dateString);
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
