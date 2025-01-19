"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("./utils/errorHandler");
/**
 * APIService handles all HTTP communication with the A1Base API
 * @remarks
 * All communication with the API must be over HTTPS for security.
 * Non-HTTPS URLs will be rejected.
 */
class APIService {
    /**
     * Creates an instance of APIService
     * @param credentials - API credentials for authentication
     * @param baseURL - Base URL for API requests (must use HTTPS)
     * @throws {Error} If baseURL does not use HTTPS protocol
     */
    constructor({ credentials, baseURL = 'https://api.a1base.com/v1', rateLimitConfig = {} }) {
        var _a, _b, _c;
        this.requestQueue = [];
        this.processingQueue = false;
        this.lastRequestTime = 0;
        if (!baseURL.toLowerCase().startsWith('https://')) {
            throw new Error('APIService requires HTTPS. Non-HTTPS URLs are not allowed for security reasons.');
        }
        // Initialize rate limit configuration with defaults
        this.rateLimitConfig = {
            requestsPerSecond: (_a = rateLimitConfig.requestsPerSecond) !== null && _a !== void 0 ? _a : 10,
            maxQueueSize: (_b = rateLimitConfig.maxQueueSize) !== null && _b !== void 0 ? _b : 100,
            retryAfter: (_c = rateLimitConfig.retryAfter) !== null && _c !== void 0 ? _c : 1000
        };
        this.credentials = credentials;
        this.baseURL = baseURL;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.credentials.apiKey,
                'X-API-Secret': this.credentials.apiSecret,
            },
        });
        // Add interceptors if needed
        this.axiosInstance.interceptors.response.use((response) => response, (error) => {
            return (0, errorHandler_1.handleError)(error);
        });
    }
    /**
     * Process the request queue while respecting rate limits
     * @private
     */
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.processingQueue || this.requestQueue.length === 0)
                return;
            this.processingQueue = true;
            while (this.requestQueue.length > 0) {
                const now = Date.now();
                const timeSinceLastRequest = now - this.lastRequestTime;
                const minTimeBetweenRequests = 1000 / this.rateLimitConfig.requestsPerSecond;
                if (timeSinceLastRequest < minTimeBetweenRequests) {
                    yield new Promise(resolve => setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest));
                }
                const request = this.requestQueue.shift();
                if (!request)
                    continue;
                try {
                    let response;
                    if (request.method === 'get') {
                        response = yield this.axiosInstance.get(request.url, request.config);
                    }
                    else {
                        response = yield this.axiosInstance.post(request.url, request.data, request.config);
                    }
                    request.resolve(response.data);
                }
                catch (error) {
                    if (axios_1.default.isAxiosError(error)) {
                        request.reject((0, errorHandler_1.handleError)(error));
                    }
                    else if (error instanceof Error) {
                        request.reject(error);
                    }
                    else {
                        request.reject(new Error('Unknown error occurred'));
                    }
                }
                this.lastRequestTime = Date.now();
            }
            this.processingQueue = false;
        });
    }
    /**
     * Add a request to the rate-limited queue
     * @private
     * @param request - Request configuration
     * @returns Promise that resolves with the API response
     * @throws Error if queue is full
     */
    enqueueRequest(request) {
        return new Promise((resolve, reject) => {
            if (this.requestQueue.length >= this.rateLimitConfig.maxQueueSize) {
                reject(new Error(`Request queue full (max size: ${this.rateLimitConfig.maxQueueSize})`));
                return;
            }
            const queuedRequest = Object.assign(Object.assign({}, request), { resolve,
                reject, timestamp: Date.now() });
            this.requestQueue.push(queuedRequest);
            this.processQueue();
        });
    }
    post(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.enqueueRequest({
                method: 'post',
                url,
                data,
                config
            });
        });
    }
    get(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.enqueueRequest({
                method: 'get',
                url,
                config
            });
        });
    }
}
exports.default = APIService;
