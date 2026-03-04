/**
 * Environment configuration for Timing MCP Server
 * Handles environment variable validation and provides configuration
 */

/**
 * Get and validate Timing API key from environment variables
 * @returns The API key
 * @throws Error if API key is not set
 */
export function getTimingApiKey(): string {
  const apiKey = process.env.TIMING_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "TIMING_API_KEY environment variable is not set. " +
      "Please set it in your MCP client configuration or environment."
    );
  }
  
  return apiKey;
}

/**
 * Get the timezone to use for API requests.
 * Reads TIMING_TIMEZONE env var, falls back to system timezone or 'Europe/Berlin'.
 * @returns IANA timezone string
 */
export function getTimingTimezone(): string {
  if (process.env.TIMING_TIMEZONE) {
    return process.env.TIMING_TIMEZONE;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Europe/Berlin';
  }
}

/**
 * Timing API configuration
 */
export interface TimingConfig {
  apiKey: string;
  timezone: string;
}

/**
 * Get Timing API configuration
 * @returns Configuration object
 */
export function getTimingConfig(): TimingConfig {
  return {
    apiKey: getTimingApiKey(),
    timezone: getTimingTimezone(),
  };
}
