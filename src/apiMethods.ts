// src/apiMethods.ts
import APIService from './api';
import type {
  APICredentials,
  GroupDetails,
  MessageDetails,
  RecentMessages,
  SendGroupMessageData,
  SendIndividualMessageData,
  WhatsAppIncomingData,
  EmailSendData,
  EmailCreateData,
  EmailIncomingData,
  Thread,
  ThreadList,
} from './types';
import { sanitizeInput, validateAttachmentUri } from './utils/sanitizer';
import { isTimestampFresh } from './utils/timeValidator';

class A1BaseAPI {
  private apiService: APIService;

  constructor({
    credentials,
    baseURL,
  }: {
    credentials: APICredentials;
    baseURL?: string;
  }) {
    this.apiService = new APIService({ credentials, baseURL });
  }

  /**
   * Send an individual message.
   * @param accountId - The account ID.
   * @param data - Message data.
   */
  public async sendIndividualMessage(
    accountId: string,
    data: SendIndividualMessageData
  ): Promise<any> {
    if (!data.from) {
      throw new Error(
        "[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send an individual message."
      );
    }

    if (!data.content) {
      throw new Error(
        "[A1BaseAPI] Missing 'content' property: 'content' is required to send an individual message."
      );
    }

    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content),
      attachment_uri: data.attachment_uri
        ? validateAttachmentUri(data.attachment_uri)
        : undefined,
    };
    const url = `/messages/individual/${accountId}/send`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Send a group message.
   * @param accountId - The account ID.
   * @param data - Group message data.
   */
  public async sendGroupMessage(
    accountId: string,
    data: SendGroupMessageData
  ): Promise<any> {
    if (!data.from) {
      throw new Error(
        "[A1BaseAPI] Missing 'from' property: a valid 'from' number is required to send a group message."
      );
    }

    if (!data.content) {
      throw new Error(
        "[A1BaseAPI] Missing 'content' property: 'content' is required to send a group message."
      );
    }

    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content),
      attachment_uri: data.attachment_uri
        ? validateAttachmentUri(data.attachment_uri)
        : undefined,
    };
    const url = `/messages/group/${accountId}/send`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Get individual message details.
   * @param accountId - The account ID.
   * @param messageId - The message ID.
   */
  public async getMessageDetails(
    accountId: string,
    messageId: string
  ): Promise<MessageDetails> {
    const url = `/messages/individual/${accountId}/get-details/${messageId}`;
    return this.apiService.get(url);
  }

  /**
   * Get chat group details.
   * @param accountId - The account ID.
   * @param threadId - The thread ID.
   */
  public async getChatGroupDetails(
    accountId: string,
    threadId: string
  ): Promise<GroupDetails> {
    const url = `/messages/threads/${accountId}/get-details/${threadId}`;
    return this.apiService.get(url);
  }

  /**
   * Get recent messages from a thread.
   * @param accountId - The account ID.
   * @param threadId - The thread ID.
   */
  public async getRecentMessages(
    accountId: string,
    threadId: string
  ): Promise<RecentMessages> {
    const url = `/messages/threads/${accountId}/get-recent/${threadId}`;
    return this.apiService.get(url);
  }

  /**
   * Get updates.
   */
  public async getUpdates(): Promise<any> {
    const url = `/messages/updates`;
    return this.apiService.get(url);
  }

  /**
   * Handle incoming WhatsApp message.
   * @param data - WhatsApp incoming message data.
   */
  public async handleWhatsAppIncoming(
    data: WhatsAppIncomingData
  ): Promise<any> {
    // Validate timestamp to prevent replay attacks
    if (!isTimestampFresh(new Date(data.timestamp).getTime())) {
      throw new Error('Webhook request expired: timestamp too old');
    }

    // Sanitize content and message_content.text if present
    const sanitizedData = {
      ...data,
      content: sanitizeInput(data.content),
      message_content: {
        ...data.message_content,
        text: data.message_content.text ? sanitizeInput(data.message_content.text) : undefined,
      },
    };

    const url = '/messages/wa/whatsapp/incoming';
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Send an email message.
   * @param accountId - The account ID.
   * @param data - The email-related data.
   * @returns The response from the API.
   */
  public async sendEmailMessage(accountId: string, data: EmailSendData) {
    // Sanitize relevant fields
    const sanitizedData = {
      ...data,
      subject: sanitizeInput(data.subject),
      body: sanitizeInput(data.body),
      attachment_uri: data.attachment_uri
        ? validateAttachmentUri(data.attachment_uri)
        : undefined,
    };
    const url = `/emails/${accountId}/send`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Create an email address.
   * @param accountId - The account ID.
   * @param data - The email address creation data.
   * @returns The response from the API.
   */
  public async createEmailAddress(accountId: string, data: EmailCreateData) {
    if (!data.address || data.address.length < 5 || data.address.length > 30) {
      throw new Error(
        "[A1BaseAPI] Invalid 'address': email address must be between 5 and 30 characters long."
      );
    }
    
    if (data.address.startsWith('.') || data.address.endsWith('.')) {
      throw new Error(
        "[A1BaseAPI] Invalid 'address': email address cannot start or end with a dot."
      );
    }
    
    if (data.address.includes('..')) {
      throw new Error(
        "[A1BaseAPI] Invalid 'address': email address cannot have consecutive dots."
      );
    }
    
    if (data.address.includes(' ') || data.address.includes(',')) {
      throw new Error(
        "[A1BaseAPI] Invalid 'address': email address cannot contain spaces or commas."
      );
    }
    
    const validCharsRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validCharsRegex.test(data.address)) {
      throw new Error(
        "[A1BaseAPI] Invalid 'address': email address can only contain letters, numbers, and characters '.', '_', '-'."
      );
    }
    
    if (!data.domain_name || (data.domain_name !== 'a1send.com' && data.domain_name !== 'a101.bot')) {
      throw new Error(
        "[A1BaseAPI] Invalid 'domain_name': free tier domains are limited to a1send.com and a101.bot."
      );
    }
    
    const sanitizedData = {
      ...data,
      address: sanitizeInput(data.address),
    };
    
    const url = `/emails/${accountId}/create-email`;
    return this.apiService.post(url, sanitizedData);
  }

  /**
   * Handle incoming email webhook data.
   * @param data - Email incoming data from webhook.
   */
  public async handleEmailIncoming(data: EmailIncomingData): Promise<any> {
    // Validate timestamp to prevent replay attacks
    if (!isTimestampFresh(new Date(data.timestamp).getTime())) {
      throw new Error('Webhook request expired: timestamp too old');
    }
    
    const sanitizedData = {
      ...data,
      subject: sanitizeInput(data.subject),
      sender_address: sanitizeInput(data.sender_address),
      recipient_address: sanitizeInput(data.recipient_address),
    };
    
    
    return sanitizedData;
  }

  /**
   * Get all threads for an account.
   * @param accountId - The account ID.
   */
  public async getAllThreads(accountId: string): Promise<ThreadList> {
    const url = `/messages/threads/${accountId}/get-all`;
    return this.apiService.get(url);
  }

  /**
   * Get all threads for a specific phone number.
   * @param accountId - The account ID.
   * @param phoneNumber - The phone number to filter threads by.
   */
  public async getAllThreadsByNumber(
    accountId: string,
    phoneNumber: string
  ): Promise<ThreadList> {
    const url = `/messages/threads/${accountId}/get-all/${phoneNumber}`;
    return this.apiService.get(url);
  }
}

export default A1BaseAPI;
