/**
 * Time utility functions for Timing MCP Server
 */

/**
 * Format duration in seconds to human-readable format (e.g., "2h 30m")
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 && hours === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.length > 0 ? parts.join(' ') : '0s';
}

/**
 * Calculate duration between two dates in seconds
 * @param startDate - Start date string (ISO 8601)
 * @param endDate - End date string (ISO 8601)
 * @returns Duration in seconds
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format for duration calculation');
  }
  
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/**
 * Format time entry duration for display
 * @param startDate - Start date string
 * @param endDate - End date string or null if running
 * @returns Formatted duration string
 */
export function formatTimeEntryDuration(startDate: string, endDate: string | null): string {
  if (!endDate) {
    return 'Running';
  }
  
  const duration = calculateDuration(startDate, endDate);
  return formatDuration(duration);
}
