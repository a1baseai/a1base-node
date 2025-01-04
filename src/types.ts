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
  a1_account_number: string;
  chat_type: 'individual' | 'group' | 'broadcast' | string;
  content: string;
  external_message_id: string;
  external_thread_id: string;
  participants: string[];
  sender_name: string;
  sender_number: string;
  secret_key: string;
  timestamp: number;
}

/**
 * Interface for API Credentials
 */
export interface APICredentials {
  apiKey: string;
  apiSecret: string;
}
