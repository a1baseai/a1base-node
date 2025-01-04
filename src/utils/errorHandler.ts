import { AxiosError } from 'axios';

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

const formatValidationErrors = (detail: ValidationError[]): string => {
  return detail
    .map(err => {
      const field = err.loc.slice(1).join('.');
      return `${field}: ${err.msg}`;
    })
    .join('; ');
};

export const handleError = (error: AxiosError): never => {
  const url = error.config?.url || '';
  const isWhatsApp = url.includes('/wa/whatsapp');
  const prefix = isWhatsApp ? 'WhatsApp Error' : 'API Error';

  // Handle network or connection errors first
  if (!error.response || error.code === 'ECONNABORTED') {
    const networkPrefix = isWhatsApp ? 'Network Error' : 'API Error';
    throw new Error(`${networkPrefix}: Unable to connect to the server - Please check your internet connection and try again`);
  }

  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data as { detail: string | ValidationError[] };

    // Handle validation errors (422)
    if (status === 422 && Array.isArray(errorData.detail)) {
      const validationPrefix = isWhatsApp ? 'WhatsApp Validation Error' : 'Validation Error';
      throw new Error(`${validationPrefix}: ${formatValidationErrors(errorData.detail)}`);
    }

    // WhatsApp specific errors
    if (isWhatsApp) {
      switch (status) {
        case 400:
          const detail = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : 'Invalid request format';
          throw new Error(`${prefix}: Invalid message format - ${detail}`);
        case 401:
          throw new Error(`${prefix}: Authentication failed - Please check your API credentials`);
        case 403:
          throw new Error(`${prefix}: Access denied - Please verify your account permissions`);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error(`${prefix}: Server error - Please try again later or contact support if the issue persists`);
        default:
          throw new Error(`${prefix}: ${status} - ${errorData.detail}`);
      }
    }

    // Generic API errors
    switch (status) {
      case 400:
        const detail = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : 'Invalid request format';
        throw new Error(`${prefix}: Invalid message format - ${detail}`);
      case 401:
        throw new Error(`${prefix}: Authentication failed - Please check your API credentials`);
      case 403:
        throw new Error(`${prefix}: Access denied - Please verify your account permissions`);
      case 429:
        throw new Error(`${prefix}: Rate limit exceeded - Please try again later`);
      case 500:
        throw new Error(`${prefix}: Server error - Please try again later or contact support if the issue persists`);
      case 502: 
      case 503:
      case 504:
        throw new Error(`${prefix}: Service temporarily unavailable - Please try again in a few minutes`);
      default:
        const suggestion = status >= 500 
          ? 'Please try again later or contact support if the issue persists'
          : 'Please verify your request and try again';
        throw new Error(`${prefix}: ${status} - ${errorData.detail}. ${suggestion}`);
    }
  }

  // Fallback for unexpected errors (no response)
  throw new Error(`Unexpected Error: ${error.message}. Please try again or contact support if the issue persists`);
}
