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
                throw new Error("[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send an individual message.");
            }
            if (!data.content) {
                throw new Error("[A1BaseAPI] Missing 'content' property: 'content' is required to send an individual message.");
            }
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content), attachment_uri: data.attachment_uri
                    ? (0, sanitizer_1.validateAttachmentUri)(data.attachment_uri)
                    : undefined });
            const url = `/messages/individual/${accountId}/send`;
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
                throw new Error("[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send a group message.");
            }
            if (!data.content) {
                throw new Error("[A1BaseAPI] Missing 'content' property: 'content' is required to send a group message.");
            }
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content), attachment_uri: data.attachment_uri
                    ? (0, sanitizer_1.validateAttachmentUri)(data.attachment_uri)
                    : undefined });
            const url = `/messages/group/${accountId}/send`;
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
            const url = `/messages/individual/${accountId}/get-details/${messageId}`;
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
            const url = `/messages/threads/${accountId}/get-details/${threadId}`;
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
            const url = `/messages/threads/${accountId}/get-recent/${threadId}`;
            return this.apiService.get(url);
        });
    }
    /**
     * Get updates.
     */
    getUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/messages/updates`;
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
            // Sanitize content and message_content.text if present
            const sanitizedData = Object.assign(Object.assign({}, data), { content: (0, sanitizer_1.sanitizeInput)(data.content), message_content: Object.assign(Object.assign({}, data.message_content), { text: data.message_content.text ? (0, sanitizer_1.sanitizeInput)(data.message_content.text) : undefined }) });
            const url = '/messages/wa/whatsapp/incoming';
            return this.apiService.post(url, sanitizedData);
        });
    }
    /**
     * Send an email message.
     * @param accountId - The account ID.
     * @param data - The email-related data.
     * @returns The response from the API.
     */
    sendEmailMessage(accountId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize relevant fields
            const sanitizedData = Object.assign(Object.assign({}, data), { subject: (0, sanitizer_1.sanitizeInput)(data.subject), body: (0, sanitizer_1.sanitizeInput)(data.body), attachment_uri: data.attachment_uri
                    ? (0, sanitizer_1.validateAttachmentUri)(data.attachment_uri)
                    : undefined });
            const url = `/emails/${accountId}/send`;
            return this.apiService.post(url, sanitizedData);
        });
    }
    /**
     * Get all threads for an account.
     * @param accountId - The account ID.
     */
    getAllThreads(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/messages/threads/${accountId}/get-all`;
            return this.apiService.get(url);
        });
    }
    /**
     * Get all threads for a specific phone number.
     * @param accountId - The account ID.
     * @param phoneNumber - The phone number to filter threads by.
     */
    getAllThreadsByNumber(accountId, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/messages/threads/${accountId}/get-all/${phoneNumber}`;
            return this.apiService.get(url);
        });
    }
}
exports.default = A1BaseAPI;
