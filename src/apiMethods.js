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
class MessageAPI {
    constructor(credentials, baseURL) {
        this.apiService = new api_1.default(credentials, baseURL);
    }
    /**
     * Send an individual message.
     * @param accountId - The account ID.
     * @param data - Message data.
     */
    sendIndividualMessage(accountId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/individual/${accountId}/send`;
            return this.apiService.post(url, data);
        });
    }
    /**
     * Send a group message.
     * @param accountId - The account ID.
     * @param data - Group message data.
     */
    sendGroupMessage(accountId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/group/${accountId}/send`;
            return this.apiService.post(url, data);
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
}
exports.default = MessageAPI;
