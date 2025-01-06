import type { AxiosRequestConfig } from 'axios';
import { APICredentials, RateLimitConfig } from './types';
/**
 * APIService handles all HTTP communication with the A1Base API
 * @remarks
 * All communication with the API must be over HTTPS for security.
 * Non-HTTPS URLs will be rejected.
 */
declare class APIService {
    private axiosInstance;
    private credentials;
    private baseURL;
    private requestQueue;
    private rateLimitConfig;
    private processingQueue;
    private lastRequestTime;
    /**
     * Creates an instance of APIService
     * @param credentials - API credentials for authentication
     * @param baseURL - Base URL for API requests (must use HTTPS)
     * @throws {Error} If baseURL does not use HTTPS protocol
     */
    constructor(credentials: APICredentials, baseURL?: string, rateLimitConfig?: RateLimitConfig);
    /**
     * Process the request queue while respecting rate limits
     * @private
     */
    private processQueue;
    /**
     * Add a request to the rate-limited queue
     * @private
     * @param request - Request configuration
     * @returns Promise that resolves with the API response
     * @throws Error if queue is full
     */
    private enqueueRequest;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
export default APIService;
