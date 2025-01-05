// src/apiMethods.ts
import type { APICredentials } from './types';
import APIService from './api';
import type { 
  SendIndividualMessageData, 
  SendGroupMessageData, 
  MessageDetails, 
  GroupDetails,
  RecentMessages,
  WhatsAppIncomingData
} from './types';
import { sanitizeInput, validateAttachmentUri } from './utils/sanitizer';
import { isTimestampFresh } from './utils/timeValidator';

class MessageAPI {
  private apiService: APIService;

  constructor(credentials: APICredentials, baseURL?: string) {
    this.apiService = new APIService(credentials, baseURL);
  }

  /**
   * Send an individual message.
   * @param accountId - The account ID.
   * @param data - Message data.
   */
  public async sendIndividualMessage(accountId: string, data: SendIndividualMessageData): Promise<any> {
    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content),
      attachment_uri: data.attachment_uri ? validateAttachmentUri(data.attachment_uri) : undefined
    };
    const url = `/individual/${accountId}/send`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Send a group message.
   * @param accountId - The account ID.
   * @param data - Group message data.
   */
  public async sendGroupMessage(accountId: string, data: SendGroupMessageData): Promise<any> {
    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content),
      attachment_uri: data.attachment_uri ? validateAttachmentUri(data.attachment_uri) : undefined
    };
    const url = `/group/${accountId}/send`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Get individual message details.
   * @param accountId - The account ID.
   * @param messageId - The message ID.
   */
  public async getMessageDetails(accountId: string, messageId: string): Promise<MessageDetails> {
    const url = `/individual/${accountId}/get-details/${messageId}`;
    return this.apiService.get(url);
  }

  /**
   * Get chat group details.
   * @param accountId - The account ID.
   * @param threadId - The thread ID.
   */
  public async getChatGroupDetails(accountId: string, threadId: string): Promise<GroupDetails> {
    const url = `/threads/${accountId}/get-details/${threadId}`;
    return this.apiService.get(url);
  }

  /**
   * Get recent messages from a thread.
   * @param accountId - The account ID.
   * @param threadId - The thread ID.
   */
  public async getRecentMessages(accountId: string, threadId: string): Promise<RecentMessages> {
    const url = `/threads/${accountId}/get-recent/${threadId}`;
    return this.apiService.get(url);
  }

  /**
   * Get updates.
   */
  public async getUpdates(): Promise<any> {
    const url = `/updates`;
    return this.apiService.get(url);
  }

  /**
   * Handle incoming WhatsApp message.
   * @param data - WhatsApp incoming message data.
   */
  public async handleWhatsAppIncoming(data: WhatsAppIncomingData): Promise<any> {
    // Validate timestamp to prevent replay attacks
    if (!isTimestampFresh(data.timestamp)) {
      throw new Error('Webhook request expired: timestamp too old');
    }

    // Sanitize content before processing
    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content)
    };

    const url = '/wa/whatsapp/incoming';
    return this.apiService.post(url, sanitizedData);
  }
}

export default MessageAPI;
