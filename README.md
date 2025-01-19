# A1Base

[![NPM Version](https://img.shields.io/npm/v/a1base-node.svg?style=flat-square)](https://www.npmjs.com/package/a1base-node)
[![NPM Downloads](https://img.shields.io/npm/dt/a1base-node.svg?style=flat-square)](https://www.npmjs.com/package/a1base-node)
[![GitHub License](https://img.shields.io/github/license/A1Base/a1base-node.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/A1Base/a1base-node/ci.yml?style=flat-square)](https://github.com/A1Base/a1base-node/actions)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/A1Base/a1base-node?style=flat-square)](https://coveralls.io/github/A1Base/a1base-node)

A powerful and easy-to-use Node.js client for interacting with the [A1Base](https://www.a1base.com) API. Give your AI agents a phone number, an email, and real autonomy on the internet.

---

## Features

- Send individual messages via WhatsApp
- Send group messages with attachments
- Retrieve message and thread details
- Get recent messages from threads
- Handle incoming WhatsApp messages
- Built-in security features:
  - HTTPS-only communication
  - Rate limiting (10 req/s default)
  - Input sanitization
  - Webhook security
  - Safe error handling

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Initializing the Client](#initializing-the-client)
- [Security Features](#security-features)
  - [HTTPS Enforcement](#https-enforcement)
  - [Rate Limiting](#rate-limiting)
  - [Input Sanitization](#input-sanitization)
  - [Webhook Security](#webhook-security)
  - [Error Handling](#error-handling)
- [API Reference](#api-reference)
  - [Individual Messages](#individual-messages)
    - [sendIndividualMessage](#sendindividualmessage)
    - [getMessageDetails](#getmessagedetails)
  - [Group Messages](#group-messages)
    - [sendGroupMessage](#sendgroupmessage)
    - [getChatGroupDetails](#getchatgroupdetails)
  - [Thread Management](#thread-management)
    - [getRecentMessages](#getrecentmessages)
    - [getAllThreads](#getallthreads)
    - [getAllThreadsByNumber](#getallthreadsbynumber)
  - [Webhooks](#webhooks)
    - [handleWhatsAppIncoming](#handlewhatsappincoming)

## Installation

```bash
npm install a1base-node
```

## Security Features

### HTTPS Enforcement

All API communication is enforced over HTTPS to ensure data security in transit. The package automatically upgrades all HTTP requests to HTTPS.

### Rate Limiting

Built-in rate limiting protects against abuse and ensures fair API usage:

- Default limit: 10 requests per second
- Configurable through client initialization
- Automatic request queuing and retry mechanism

### Input Sanitization

Automatic sanitization of all user inputs:

- Message content validation and sanitization
- Attachment URI validation
- Phone number format verification
- Service type validation (whatsapp/telegram)

### Webhook Security

Enhanced webhook security measures:

- Timestamp validation to prevent replay attacks
- Secret key verification
- Request signature validation
- IP allowlist support

### Error Handling

Secure error handling implementation:

- Sanitized error messages
- No sensitive data exposure
- Detailed logging (without sensitive information)
- Custom error types for better debugging

## Features

Importing the Library
You can import the A1BaseAPI class using CommonJS or ES Module syntax.

```javascript
// CommonJS
const { A1BaseAPI } = require('a1base-node');

// ES Module
import { A1BaseAPI } from 'a1base-node';
```

## Initializing the Client

Initialize the A1BaseAPI client with your API credentials. Both apiKey and apiSecret are required for authentication.

```javascript
const credentials = {
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
};

// HTTPS is enforced for security
const baseURL = 'https://api.a1base.com/v1';

const client = new A1BaseAPI({ credentials, baseURL });
```

## API Reference

sendIndividualMessage
Sends an individual message to a specific recipient.

```javascript
const messageData = {
  content: "Hello, World!", // Message body text
  from: "+1234567890", // Sender phone number
  to: "+0987654321", // Recipient phone number
  service: "whatsapp", // 'whatsapp' or 'telegram'
  attachment_uri: "https://...", // Optional file/media attachment
};

try {
  const response = await client.sendIndividualMessage("accountId", messageData);
  console.log("Message sent:", response);
  // Response: { "to": "61433174782", "from": "61421868490", "body": "Hello, World!", "status": "queued" }
} catch (error) {
  console.error("Error:", error.message);
}
```

sendGroupMessage
Sends a message to a group thread.

```javascript
const groupMessageData = {
  content: "Hello, Group!", // Message body text
  from: "+1234567890", // Sender's phone number
  thread_id: "123", // Thread ID
  service: "whatsapp", // Chat service (whatsapp/telegram)
  attachment_uri: "https://...", // Optional file/media attachment
};

try {
  const response = await client.sendGroupMessage("accountId", groupMessageData);
  console.log("Group message sent:", response);
  // Response: { "thread_id": "123", "body": "Hello, Group!", "status": "queued" }
} catch (error) {
  console.error("Error:", error.message);
}
```

getMessageDetails
Retrieves detailed information about a specific individual message.

```javascript
try {
  const details = await client.getMessageDetails("accountId", "messageId");
  console.log("Message Details:", details);
} catch (error) {
  console.error("Error:", error.message);
}
```

getChatGroupDetails
Retrieves comprehensive details about a specific chat group thread.

```javascript
try {
  const groupDetails = await client.getChatGroupDetails(
    "accountId",
    "threadId"
  );
  console.log("Thread Details:", groupDetails);
} catch (error) {
  console.error("Error:", error.message);
}
```

getRecentMessages
Retrieves recent messages from a specific chat thread.

```javascript
try {
  const messages = await client.getRecentMessages("accountId", "threadId");
  console.log("Recent Messages:", messages);
} catch (error) {
  console.error("Error:", error.message);
}
```

getAllThreads
Retrieves all chat threads for an account.

```javascript
try {
  const threads = await client.getAllThreads("accountId");
  console.log("All Threads:", threads);
} catch (error) {
  console.error("Error:", error.message);
}
```

getAllThreadsByNumber
Retrieves all chat threads for a specific phone number.

```javascript
try {
  const threads = await client.getAllThreadsByNumber(
    "accountId",
    "phoneNumber"
  );
  console.log("Threads for Number:", threads);
} catch (error) {
  console.error("Error:", error.message);
}
```

handleWhatsAppIncoming
Handles incoming WhatsApp webhook data.

```javascript
// Webhook data structure
const webhookData = {
  external_thread_id: "3456098@s.whatsapp",
  external_message_id: "2asd5678cfvgh123",
  chat_type: "group", // 'group', 'individual', or 'broadcast'
  content: "Hello!",
  sender_name: "Bobby",
  sender_number: "61421868490",
  participants: ["61421868490", "61433174782"],
  a1_account_number: "61421868490",
  timestamp: 1734486451000,
  secret_key: "xxx",
};

try {
  const result = await client.handleWhatsAppIncoming(webhookData);
  console.log("Webhook processed:", result);
} catch (error) {
  console.error("Error:", error.message);
}
```

## Error Handling
The A1BaseAPI client throws descriptive errors based on API responses. It's essential to handle these errors gracefully in your application.
Example with try-catch:

```javascript
try {
  const response = await client.sendIndividualMessage('account123', messageData);
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
}

try {
  const response = await client.sendIndividualMessage('account123', messageData);
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
}
```
