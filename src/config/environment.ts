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
 * Timing API configuration
 */
export interface TimingConfig {
  apiKey: string;
}

/**
 * Get Timing API configuration
 * @returns Configuration object
 */
export function getTimingConfig(): TimingConfig {
  return {
    apiKey: getTimingApiKey(),
  };
}
