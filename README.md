# A1BASE

Give your AI agents a phone number, an email and real autonomy on the internet.

A powerful and easy-to-use client for interacting with the A1Base API.

## Features

- Send individual messages
- Send group messages
- Retrieve message details
- Retrieve group details
- Retrieve recent messages from a thread


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Initializing the Client](#initializing-the-client)
- [API Reference](#api-reference)
  - [sendIndividualMessage](#sendindividualmessage)
  - [sendGroupMessage](#sendgroupmessage)
  - [getMessageDetails](#getmessagedetails)
  - [getChatGroupDetails](#getchatgroupdetails)
  - [getRecentMessages](#getrecentmessages)
  - [getUpdates](#getupdates)
- [Error Handling](#error-handling)

## Installation

```bash
npm install a1base-api
```

## Features
Importing the Library
You can import the A1BaseAPI class using CommonJS or ES Module syntax.

```bash
# CommonJS
const { A1BaseAPI } = require('a1base-api');

# ES Module
import { A1BaseAPI } from 'a1base-api';
```

## Initializing the Client
Initialize the A1BaseAPI client with your API credentials. Both apiKey and apiSecret are required for authentication.
```bash
    const credentials = {
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
    };
    const baseURL = 'https://api.a1base.com/v1';

    const client = new A1BaseAPI(credentials, baseURL);
```

## API Reference

sendIndividualMessage
Sends an individual message to a specific recipient.
 ```bash
 const messageData = {
  content: 'Hello, World!',
  from: '+1234567890',
  to: '+0987654321',
  service: 'whatsapp',
};

client.sendIndividualMessage('accountId', messageData)
  .then(response => {
    console.log('Individual Message Sent:', response);
  })
  .catch(error => {
    console.error('Error Sending Individual Message:', error.message);
  });
 ```

sendGroupMessage
Sends a message to a group thread.
```bash
const groupMessageData = {
  content: 'Hello, Group!',
  thread_id: 'thread123',
  service: 'whatsapp',
};

client.sendGroupMessage('accountId', groupMessageData)
  .then(response => {
    console.log('Group Message Sent:', response);
  })
  .catch(error => {
    console.error('Error Sending Group Message:', error.message);
  });
```

getMessageDetails
Retrieves detailed information about a specific individual message.
```bash
client.getMessageDetails('accountId', 'messageId')
  .then(details => {
    console.log('Message Details:', details);
  })
  .catch(error => {
    console.error('Error Fetching Message Details:', error.message);
  });
```

getChatGroupDetails
Retrieves comprehensive details about a specific chat group thread.
```bash
client.getChatGroupDetails('accountId', 'threadId')
  .then(groupDetails => {
    console.log('Group Details:', groupDetails);
  })
  .catch(error => {
    console.error('Error Fetching Group Details:', error.message);
  });
```

getRecentMessages
Retrieves the latest five messages from a specific chat thread.
```bash
client.getRecentMessages('accountId', 'threadId')
  .then(recentMessages => {
    console.log('Recent Messages:', recentMessages);
  })
  .catch(error => {
    console.error('Error Fetching Recent Messages:', error.message);
  });
```

##Error Handling
The A1BaseAPI client throws descriptive errors based on API responses. It's essential to handle these errors gracefully in your application.
Example with try-catch:

```bash
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