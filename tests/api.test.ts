// tests/api.test.ts
import MessageAPI from '../src/apiMethods';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { RecentMessages, APICredentials } from '../src/types';

const mock = new MockAdapter(axios);

const credentials: APICredentials = {
  apiKey: 'test_api_key',
  apiSecret: 'test_api_secret',
};
const accountId = 'test_account';
const messageId = 'test_message';
const threadId = 'test_thread';

const client = new MessageAPI(credentials, 'https://api.a1base.com/v1/messages');

describe('MessageAPI', () => {
  afterEach(() => {
    mock.reset();
  });


  it('should send an individual message successfully', async () => {
    const data = {
      content: 'Hello, World!',
      from: '+1234567890',
      to: '+0987654321',
      service: 'whatsapp',
    };

    mock.onPost(`/individual/${accountId}/send`).reply((config) => {
      // Type Guard: Ensure headers are defined
      if (!config.headers) {
        throw new Error('Headers are missing');
      }
      expect(config.headers['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, { success: true }];
    });

    const response = await client.sendIndividualMessage(accountId, data);
    expect(response).toEqual({ success: true });
  });

  it('should fetch individual message details', async () => {
    const mockData = {
      chat_id: 'chat123',
      chat_name: 'Test Chat',
      participants: ['+1234567890', '+0987654321'],
      account_id: accountId,
      message_id: messageId,
      to: '+0987654321',
      from: '+1234567890',
      body: 'Hello, World!',
      status: 'sent',
      date_created: '2024-11-16T00:00:00Z',
      direction: 'outbound-api',
    };

    mock.onGet(`/individual/${accountId}/get-details/${messageId}`).reply(config => {
      // Type Guard: Ensure headers are defined
      if (!config.headers) {
        throw new Error('Headers are missing');
      }
      expect(config.headers['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, mockData];
    });

    const response = await client.getMessageDetails(accountId, messageId);
    expect(response).toEqual(mockData);
  });

  // New Test for getRecentMessages
  it('should fetch recent messages from a thread', async () => {
    const mockData: RecentMessages = {
      thread_id: threadId,
      account_id: accountId,
      messages: [
        {
          message_id: 'msg1',
          content: 'First message',
          from: '+1234567890',
          to: '+0987654321',
          service: 'whatsapp',
          date_sent: '2024-11-17T12:00:00Z',
          status: 'sent',
          direction: 'outbound-api',
        },
        {
          message_id: 'msg2',
          content: 'Second message',
          from: '+0987654321',
          to: '+1234567890',
          service: 'whatsapp',
          date_sent: '2024-11-17T12:05:00Z',
          status: 'sent',
          direction: 'inbound',
        },
        // Add up to 5 messages as per API specification
      ],
    };

    mock.onGet(`/threads/${accountId}/get-recent/${threadId}`).reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, mockData];
    });

    const response = await client.getRecentMessages(accountId, threadId);
    expect(response).toEqual(mockData);
    expect(response.messages.length).toBeLessThanOrEqual(5); // Assuming API returns up to 5 messages
  });

  it('should handle error when fetching recent messages fails', async () => {
    mock.onGet(`/threads/${accountId}/get-recent/${threadId}`).reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [404, {
        detail: 'Thread not found',
      }];
    });

    await expect(client.getRecentMessages(accountId, threadId)).rejects.toThrow(
      'API Error: 404 - Thread not found'
    );
  });

  // Existing tests...

  it('should send a group message successfully', async () => {
    const data = {
      content: 'Hello, Group!',
      thread_id: 'thread123',
      service: 'whatsapp',
    };

    mock.onPost(`/group/${accountId}/send`).reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, { success: true }];
    });

    const response = await client.sendGroupMessage(accountId, data);
    expect(response).toEqual({ success: true });
  });

  it('should fetch chat group details', async () => {
    const mockData = {
      account_id: accountId,
      chat_id: 'chat123',
      chat_name: 'Test Chat Group',
      participants: ['+1234567890', '+0987654321'],
    };

    mock.onGet(`/threads/${accountId}/get-details/${threadId}`).reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, mockData];
    });

    const response = await client.getChatGroupDetails(accountId, threadId);
    expect(response).toEqual(mockData);
  });

  it('should handle error when fetching chat group details fails', async () => {
    mock.onGet(`/threads/${accountId}/get-details/${threadId}`).reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [404, {
        detail: 'Chat group not found',
      }];
    });

    await expect(client.getChatGroupDetails(accountId, threadId)).rejects.toThrow(
      'API Error: 404 - Chat group not found'
    );
  });

  it('should get updates successfully', async () => {
    mock.onGet('/updates').reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, { status: 'success' }];
    });

    const response = await client.getUpdates();
    expect(response).toEqual({ status: 'success' });
  });

  it('should handle error when getting updates fails', async () => {
    mock.onGet('/updates').reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [500, { detail: 'Internal Server Error' }];
    });

    await expect(client.getUpdates()).rejects.toThrow(
      'API Error: 500 - Internal Server Error'
    );
  });

  it('should handle incoming WhatsApp messages successfully', async () => {
    const incomingData = {
      external_thread_id: '3456098@s.whatsapp',
      external_message_id: '2asd5678cfvgh123',
      chat_type: 'group',
      content: 'Hi there!',
      sender_name: 'Bobby',
      sender_number: '61421868490',
      participants: ['61421868490', '61433174782'],
      a1_account_number: '61421868490',
      timestamp: 1734486451000,
      secret_key: 'xxx',
    };

    mock.onPost('/wa/whatsapp/incoming').reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [200, { status: 'received' }];
    });

    const response = await client.handleWhatsAppIncoming(incomingData);
    expect(response).toEqual({ status: 'received' });
  });

  it('should handle error when incoming WhatsApp message fails', async () => {
    const incomingData = {
      external_thread_id: '3456098@s.whatsapp',
      external_message_id: '2asd5678cfvgh123',
      chat_type: 'group',
      content: 'Hi there!',
      sender_name: 'Bobby',
      sender_number: '61421868490',
      participants: ['61421868490', '61433174782'],
      a1_account_number: '61421868490',
      timestamp: 1734486451000,
      secret_key: 'xxx',
    };

    mock.onPost('/wa/whatsapp/incoming').reply(config => {
      // Verify headers
      expect(config.headers!['X-API-Key']).toBe(credentials.apiKey);
      expect(config.headers!['X-API-Secret']).toBe(credentials.apiSecret);
      return [400, { detail: 'Invalid message format' }];
    });

    await expect(client.handleWhatsAppIncoming(incomingData)).rejects.toThrow(
      'API Error: 400 - Invalid message format'
    );
  });
});
