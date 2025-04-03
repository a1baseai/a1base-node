import type { APICredentials, GroupDetails, MessageDetails, RecentMessages, SendGroupMessageData, SendIndividualMessageData, WhatsAppIncomingData, EmailSendData, EmailCreateData, EmailIncomingData, ThreadList } from './types';
declare class A1BaseAPI {
    private apiService;
    constructor({ credentials, baseURL, }: {
        credentials: APICredentials;
        baseURL?: string;
    });
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
    /**
     * Send an email message.
     * @param accountId - The account ID.
     * @param data - The email-related data.
     * @returns The response from the API.
     */
    sendEmailMessage(accountId: string, data: EmailSendData): Promise<unknown>;
    /**
     * Create an email address.
     * @param accountId - The account ID.
     * @param data - The email address creation data.
     * @returns The response from the API.
     */
    createEmailAddress(accountId: string, data: EmailCreateData): Promise<unknown>;
    /**
     * Handle incoming email webhook data.
     * @param data - Email incoming data from webhook.
     */
    handleEmailIncoming(data: EmailIncomingData): Promise<any>;
    /**
     * Get all threads for an account.
     * @param accountId - The account ID.
     */
    getAllThreads(accountId: string): Promise<ThreadList>;
    /**
     * Get all threads for a specific phone number.
     * @param accountId - The account ID.
     * @param phoneNumber - The phone number to filter threads by.
     */
    getAllThreadsByNumber(accountId: string, phoneNumber: string): Promise<ThreadList>;
}
export default A1BaseAPI;
