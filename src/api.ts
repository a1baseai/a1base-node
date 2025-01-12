// src/api.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { APICredentials, RateLimitConfig } from './types';
import { handleError } from './utils/errorHandler';

/**
 * Internal interface for queued API requests
 */
interface QueuedRequest<T = any> {
  method: 'get' | 'post';
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

/**
 * APIService handles all HTTP communication with the A1Base API
 * @remarks
 * All communication with the API must be over HTTPS for security.
 * Non-HTTPS URLs will be rejected.
 */
class APIService {
  private axiosInstance: AxiosInstance;
  private credentials: APICredentials;
  private baseURL: string;
  private requestQueue: QueuedRequest[] = [];
  private rateLimitConfig: Required<RateLimitConfig>;
  private processingQueue: boolean = false;
  private lastRequestTime: number = 0;

  /**
   * Creates an instance of APIService
   * @param credentials - API credentials for authentication
   * @param baseURL - Base URL for API requests (must use HTTPS)
   * @throws {Error} If baseURL does not use HTTPS protocol
   */
  constructor({
    credentials,
    baseURL = 'https://api.a1base.com/v1/messages',
    rateLimitConfig = {}
  }: {
    credentials: APICredentials;
    baseURL?: string;
    rateLimitConfig?: RateLimitConfig;
  }) {
    if (!baseURL.toLowerCase().startsWith('https://')) {
      throw new Error('APIService requires HTTPS. Non-HTTPS URLs are not allowed for security reasons.');
    }
    
    // Initialize rate limit configuration with defaults
    this.rateLimitConfig = {
      requestsPerSecond: rateLimitConfig.requestsPerSecond ?? 10,
      maxQueueSize: rateLimitConfig.maxQueueSize ?? 100,
      retryAfter: rateLimitConfig.retryAfter ?? 1000
    };
    this.credentials = credentials;
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.credentials.apiKey,
        'X-API-Secret': this.credentials.apiSecret,
      },
    });

    // Add interceptors if needed
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        return handleError(error);
      }
    );
  }

  /**
   * Process the request queue while respecting rate limits
   * @private
   */
  private async processQueue() {
    if (this.processingQueue || this.requestQueue.length === 0) return;
    
    this.processingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minTimeBetweenRequests = 1000 / this.rateLimitConfig.requestsPerSecond;
      
      if (timeSinceLastRequest < minTimeBetweenRequests) {
        await new Promise(resolve => setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest));
      }
      
      const request = this.requestQueue.shift();
      if (!request) continue;
      
      try {
        let response: AxiosResponse;
        if (request.method === 'get') {
          response = await this.axiosInstance.get(request.url, request.config);
        } else {
          response = await this.axiosInstance.post(request.url, request.data, request.config);
        }
        request.resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          request.reject(handleError(error));
        } else if (error instanceof Error) {
          request.reject(error);
        } else {
          request.reject(new Error('Unknown error occurred'));
        }
      }
      
      this.lastRequestTime = Date.now();
    }
    
    this.processingQueue = false;
  }

  /**
   * Add a request to the rate-limited queue
   * @private
   * @param request - Request configuration
   * @returns Promise that resolves with the API response
   * @throws Error if queue is full
   */
  private enqueueRequest<T>(request: {
    method: 'get' | 'post';
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
  }): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.requestQueue.length >= this.rateLimitConfig.maxQueueSize) {
        reject(new Error(`Request queue full (max size: ${this.rateLimitConfig.maxQueueSize})`));
        return;
      }
      
      const queuedRequest: QueuedRequest<T> = {
        ...request,
        resolve,
        reject,
        timestamp: Date.now()
      };
      
      this.requestQueue.push(queuedRequest);
      this.processQueue();
    });
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.enqueueRequest({
      method: 'post',
      url,
      data,
      config
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.enqueueRequest({
      method: 'get',
      url,
      config
    });
  }

  // Add other HTTP methods as needed (put, delete, etc.)
}

export default APIService;
