// src/api.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { handleError } from './utils/errorHandler';

/**
 * Interface for API Credentials
 */
export interface APICredentials {
  apiKey: string;
  apiSecret: string;
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

  /**
   * Creates an instance of APIService
   * @param credentials - API credentials for authentication
   * @param baseURL - Base URL for API requests (must use HTTPS)
   * @throws {Error} If baseURL does not use HTTPS protocol
   */
  constructor(credentials: APICredentials, baseURL = 'https://api.a1base.com/v1/messages') {
    if (!baseURL.toLowerCase().startsWith('https://')) {
      throw new Error('APIService requires HTTPS. Non-HTTPS URLs are not allowed for security reasons.');
    }
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

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Add other HTTP methods as needed (put, delete, etc.)
}

export default APIService;
