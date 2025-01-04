// src/apiMethods.ts
import APIService, { APICredentials } from './api';
import { 
  SendIndividualMessageData, 
  SendGroupMessageData, 
  MessageDetails, 
  GroupDetails,
  RecentMessages,
  WhatsAppIncomingData
} from './types';

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
    const url = `/individual/${accountId}/send`;
    return this.apiService.post(url, data);
  }

  /**
   * Send a group message.
   * @param accountId - The account ID.
   * @param data - Group message data.
   */
  public async sendGroupMessage(accountId: string, data: SendGroupMessageData): Promise<any> {
    const url = `/group/${accountId}/send`;
    return this.apiService.post(url, data);
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
    const url = '/wa/whatsapp/incoming';
    return this.apiService.post(url, data);
  }
}

export default MessageAPI;
