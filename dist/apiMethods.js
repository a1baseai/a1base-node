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
// src/apiMethods.ts
const api_1 = __importDefault(require("./api"));
const sanitizer_1 = require("./utils/sanitizer");
const timeValidator_1 = require("./utils/timeValidator");
class A1BaseAPI {
    constructor({ credentials, baseURL, }) {
        this.apiService = new api_1.default({ credentials, baseURL });
    }
    /**
     * Send an individual message.
     * @param accountId - The account ID.
     * @param data - Message data.
     */
    sendIndividualMessage(accountId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.from) {
                console.warn("[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send an individual message.");
            }
            if (!data.content) {
                console.warn("[A1BaseAPI] Missing 'content' property: 'content' is required to send an individual message.");
            }
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content), attachment_uri: data.attachment_uri
                    ? (0, sanitizer_1.validateAttachmentUri)(data.attachment_uri)
                    : undefined });
            const url = `/individual/${accountId}/send`;
            return this.apiService.post(url, sanitizedData);
        });
    }
    /**
     * Send a group message.
     * @param accountId - The account ID.
     * @param data - Group message data.
     */
    sendGroupMessage(accountId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.from) {
                console.warn("[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send a group message.");
            }
            if (!data.content) {
                console.warn("[A1BaseAPI] Missing 'content' property: 'content' is required to send a group message.");
            }
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content), attachment_uri: data.attachment_uri
                    ? (0, sanitizer_1.validateAttachmentUri)(data.attachment_uri)
                    : undefined });
            const url = `/group/${accountId}/send`;
            return this.apiService.post(url, sanitizedData);
        });
    }
    /**
     * Get individual message details.
     * @param accountId - The account ID.
     * @param messageId - The message ID.
     */
    getMessageDetails(accountId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/individual/${accountId}/get-details/${messageId}`;
            return this.apiService.get(url);
        });
    }
    /**
     * Get chat group details.
     * @param accountId - The account ID.
     * @param threadId - The thread ID.
     */
    getChatGroupDetails(accountId, threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/threads/${accountId}/get-details/${threadId}`;
            return this.apiService.get(url);
        });
    }
    /**
     * Get recent messages from a thread.
     * @param accountId - The account ID.
     * @param threadId - The thread ID.
     */
    getRecentMessages(accountId, threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/threads/${accountId}/get-recent/${threadId}`;
            return this.apiService.get(url);
        });
    }
    /**
     * Get updates.
     */
    getUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/updates`;
            return this.apiService.get(url);
        });
    }
    /**
     * Handle incoming WhatsApp message.
     * @param data - WhatsApp incoming message data.
     */
    handleWhatsAppIncoming(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate timestamp to prevent replay attacks
            if (!(0, timeValidator_1.isTimestampFresh)(new Date(data.timestamp).getTime())) {
                throw new Error('Webhook request expired: timestamp too old');
            }
            // Sanitize content before processing
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content) });
            const url = '/wa/whatsapp/incoming';
            return this.apiService.post(url, sanitizedData);
        });
    }
}
exports.default = A1BaseAPI;
