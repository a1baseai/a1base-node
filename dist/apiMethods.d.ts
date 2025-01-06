import type { APICredentials } from './types';
import type { SendIndividualMessageData, SendGroupMessageData, MessageDetails, GroupDetails, RecentMessages, WhatsAppIncomingData } from './types';
declare class A1BaseAPI {
    private apiService;
    constructor(credentials: APICredentials, baseURL?: string);
    /**
     * Send an individual message.
     * @param accountId - The account ID.
     * @param data - Message data.
     */
    sendIndividualMessage(accountId: string, data: SendIndividualMessageData): Promise<any>;
    /**
     * Send a group message.
     * @param accountId - The account ID.
     * @param data - Group message data.
     */
    sendGroupMessage(accountId: string, data: SendGroupMessageData): Promise<any>;
    /**
     * Get individual message details.
     * @param accountId - The account ID.
     * @param messageId - The message ID.
     */
    getMessageDetails(accountId: string, messageId: string): Promise<MessageDetails>;
    /**
     * Get chat group details.
     * @param accountId - The account ID.
     * @param threadId - The thread ID.
     */
    getChatGroupDetails(accountId: string, threadId: string): Promise<GroupDetails>;
    /**
     * Get recent messages from a thread.
     * @param accountId - The account ID.
     * @param threadId - The thread ID.
     */
    getRecentMessages(accountId: string, threadId: string): Promise<RecentMessages>;
    /**
     * Get updates.
     */
    getUpdates(): Promise<any>;
    /**
     * Handle incoming WhatsApp message.
     * @param data - WhatsApp incoming message data.
     */
    handleWhatsAppIncoming(data: WhatsAppIncomingData): Promise<any>;
}
export default A1BaseAPI;
