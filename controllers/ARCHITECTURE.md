# Swap Requests Messaging System Architecture

## Overview
This document outlines the architecture for the Kiyo SkillSwap Marketplace messaging system. We utilize a hybrid approach: REST APIs for data persistence and history retrieval, combined with WebSockets (`Socket.io`) for real-time, peer-to-peer message delivery.

## Database Schema (MongoDB)
* **Conversation Collection:** Represents an active chat session tied to a specific `SwapRequest`. Tracks participants, the last message sent, and unread counts per user.
* **Message Collection:** Stores individual messages, referencing the parent `ConversationId` and `SenderId`.

## Communication Flow
1. **Initialization:** When a Swap Request is accepted, a `Conversation` document is created via a REST POST request.
2. **Real-time Chat:** * The client connects to the Socket.io server and emits a `join_chat` event with the `conversationId`.
   * When a user types a message, the client emits a `send_message` event over the socket (for instant UI updates for the receiver).
   * Simultaneously, the client makes a REST POST request to `/api/messages` to persist the message to MongoDB.
3. **History Retrieval:** On component mount, the client fetches chat history via `GET /api/messages/:conversationId`.

## Testing
* **Framework:** Jest + Supertest.
* **Focus:** Integration testing for the REST endpoints (`/api/messages`) to ensure data is properly saved, retrieved, and linked to the correct conversation. Run tests using `npm test`.