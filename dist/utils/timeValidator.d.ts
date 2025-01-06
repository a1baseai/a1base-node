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
export declare function isTimestampFresh(timestamp: number, maxAgeSeconds?: number): boolean;
