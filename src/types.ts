// src/types.ts

export interface SendIndividualMessageData {
  content: string;
  from: string;
  to: string;
  service: string;
  attachment_uri?: string;
  auth_id?: string; // Optional, as it's added internally
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
  service: 'whatsapp' | 'telegram';
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document';
  is_from_agent: boolean;
  message_content: {
    text?: string;
    // Add other content types as needed
  };
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

// Add new interfaces for thread management
export interface Thread {
  thread_id: string;
  thread_type: 'individual' | 'group' | 'broadcast';
  chat_name: string;
  participants: string[];
  last_message?: {
    content: string;
    timestamp: string;
    sender_name: string;
  };
  created_at: string;
}

export interface ThreadList {
  threads: Thread[];
  total_count: number;
  has_more: boolean;
}

/**
 * Interface representing the structure for creating an email address.
 */
export interface EmailCreateData {
  address: string;
  domain_name: string;
}

/**
 * Interface representing the structure for incoming email webhook data.
 */
export interface EmailIncomingData {
  email_id: string;
  subject: string;
  sender_address: string;
  recipient_address: string;
  timestamp: string;
  service: 'email';
  raw_email_data: string;
}
