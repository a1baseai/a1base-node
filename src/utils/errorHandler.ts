import { AxiosError } from 'axios';

export const handleError = (error: AxiosError): never => {
  if (error.response) {
    const errorData = error.response.data as { detail: string };
    throw new Error(`API Error: ${error.response.status} - ${errorData.detail}`);
  }
  throw error;
};