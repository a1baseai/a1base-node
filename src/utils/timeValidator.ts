/**
 * Utility functions for validating timestamps in webhooks
 */

/**
 * Checks if a timestamp is within acceptable time range to prevent replay attacks
 * @param timestamp - Unix timestamp in milliseconds
 * @param maxAgeSeconds - Maximum allowed age of the timestamp in seconds (default: 5 minutes)
 * @returns boolean indicating if timestamp is fresh
 * @throws {Error} If timestamp is invalid or in the future
 */
export function isTimestampFresh(timestamp: number, maxAgeSeconds = 300): boolean {
  const now = Date.now();
  
  // Validate timestamp
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    throw new Error('Invalid timestamp format');
  }

  // Check for future timestamps (allowing 30 seconds for clock skew)
  if (timestamp > now + 30000) {
    throw new Error('Timestamp is in the future');
  }

  // Check if timestamp is too old
  return now - timestamp < maxAgeSeconds * 1000;
}
