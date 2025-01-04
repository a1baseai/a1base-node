/**
 * Utility functions for sanitizing input data
 */

/**
 * Sanitizes string input by removing potentially dangerous characters
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove HTML/XML tags and potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validates and sanitizes attachment URIs
 * @param uri - The URI to validate and sanitize
 * @returns Sanitized URI or empty string if invalid
 * @throws {Error} If URI contains potentially malicious content
 */
export function validateAttachmentUri(uri?: string): string {
  if (!uri) return '';

  // Basic URI validation
  try {
    const url = new URL(uri);
    // Only allow specific protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid attachment URI protocol. Only HTTP(S) is allowed.');
    }
    return url.toString();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid attachment URI: ${error.message}`);
    }
    throw error;
  }
}
