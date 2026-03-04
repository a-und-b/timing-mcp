/**
 * Error handling utilities for Timing MCP Server
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AxiosLikeError extends Error {
  response?: {
    status?: number;
    data?: unknown;
  };
  isAxiosError?: boolean;
}

/**
 * Extract API response details from an error (if available)
 * @param error - Error that may contain API response data
 * @returns Additional detail string, or empty string
 */
function extractApiResponseDetails(error: unknown): string {
  const axiosErr = error as AxiosLikeError;
  if (axiosErr?.response?.data) {
    try {
      const data = axiosErr.response.data;
      if (typeof data === 'string') return ` | API response: ${data}`;
      return ` | API response: ${JSON.stringify(data)}`;
    } catch {
      // ignore serialization errors
    }
  }
  return '';
}

/**
 * Format error message for user-friendly display
 * @param error - Error object or string
 * @returns Formatted error message
 */
export function formatTimingError(error: unknown): string {
  if (error instanceof Error) {
    return error.message + extractApiResponseDetails(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

/**
 * Create a validation error message
 * @param field - Field name that failed validation
 * @param reason - Reason for validation failure
 * @returns Formatted validation error message
 */
export function createValidationErrorMessage(field: string, reason: string): string {
  return `Validation error for field '${field}': ${reason}`;
}

/**
 * Handle API errors and return user-friendly messages
 * @param error - Error from API call
 * @param operation - Operation that failed (e.g., "list projects")
 * @returns User-friendly error message
 */
export function handleTimingApiError(error: unknown, operation: string): string {
  const baseMessage = `Failed to ${operation}`;

  if (error instanceof Error) {
    const details = extractApiResponseDetails(error);

    // Check for common error patterns
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return `${baseMessage}: Authentication failed. Please check your TIMING_API_KEY.${details}`;
    }

    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return `${baseMessage}: Resource not found.${details}`;
    }

    if (error.message.includes('422')) {
      return `${baseMessage}: Validation error (422).${details}`;
    }

    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return `${baseMessage}: Rate limit exceeded. Please try again later.`;
    }

    return `${baseMessage}: ${error.message}${details}`;
  }

  return `${baseMessage}: Unknown error occurred`;
}
