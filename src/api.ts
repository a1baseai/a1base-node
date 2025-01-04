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

class APIService {
  private axiosInstance: AxiosInstance;
  private credentials: APICredentials;
  private baseURL: string;

//   https://api.a1base.com/v1/messages
  constructor(credentials: APICredentials, baseURL = 'https://api.a1base.com/v1/messages') {
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
