export interface SendIndividualMessageData {
    content: string;
    from: string;
    to: string;
    service: string;
    attachment_uri?: string;
    auth_id?: string;
}
export interface SendGroupMessageData {
    content: string;
    from: string;
    thread_id: string;
    service: string;
    attachment_uri?: string;
}
export interface MessageDetails {
    chat_id: string;
    chat_name: string;
    participants: string[];
    account_id: string;
    message_id: string;
    to: string;
    from: string;
    body: string;
    status: string;
    date_created: string;
    direction: string;
    attachment_uri?: string;
}
export interface GroupDetails {
    account_id: string;
    chat_id: string;
    chat_name: string;
    participants: string[];
}
export interface RecentMessage {
    message_id: string;
    content: string;
    from: string;
    to: string;
    service: string;
    date_sent: string;
    status: string;
    direction: string;
    attachment_uri?: string;
}
export interface RecentMessages {
    thread_id: string;
    account_id: string;
    messages: RecentMessage[];
}
export interface WhatsAppIncomingData {
    thread_id: string;
    message_id: string;
    thread_type: 'individual' | 'group' | 'broadcast';
    content: string;
    sender_number: string;
    sender_name: string;
    a1_account_id: string;
    timestamp: string;
    service: 'email' | 'sms' | 'whatsapp';
}
export interface APICredentials {
    apiKey: string;
    apiSecret: string;
}
/**
 * Configuration options for API rate limiting
 */
export interface RateLimitConfig {
    /** Maximum number of requests per second (default: 10) */
    requestsPerSecond?: number;
    /** Maximum number of requests to queue (default: 100) */
    maxQueueSize?: number;
    /** Time to wait before retrying when rate limited (ms) (default: 1000) */
    retryAfter?: number;
}
/**
 * Interface representing the structure for sending an email message.
 */
export interface EmailSendData {
    sender_address: string;
    recipient_address: string;
    subject: string;
    body: string;
    headers?: {
        bcc?: string[];
        cc?: string[];
        'reply-to'?: string;
    };
    attachment_uri?: string;
}
