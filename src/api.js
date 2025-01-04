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
// src/api.ts
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("./utils/errorHandler");
class APIService {
    //   https://api.a1base.com/v1/messages
    constructor(credentials, baseURL = 'https://api.a1base.com/v1/messages') {
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
    post(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.axiosInstance.post(url, data, config);
                return response.data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    get(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.axiosInstance.get(url, config);
                return response.data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = APIService;
