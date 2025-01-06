/**
 * Utility functions for sanitizing input data
 */
/**
 * Sanitizes string input by removing potentially dangerous characters
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export declare function sanitizeInput(input: string): string;
/**
 * Validates and sanitizes attachment URIs
 * @param uri - The URI to validate and sanitize
 * @returns Sanitized URI or empty string if invalid
 * @throws {Error} If URI contains potentially malicious content
 */
export declare function validateAttachmentUri(uri?: string): string;
