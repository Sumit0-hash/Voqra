# Voqra

<p align="center">
<strong>A modern real-time messaging app built with Expo, Express,
MongoDB, Clerk, Cloudinary, and WebSockets.</strong>
</p>
<p align="center">
<a href="https://github.com/Sumit0-hash/Voqra">Repository</a> ·
<a href="#features">Features</a> · <a href="#getting-started">Getting
Started</a> · <a href="#api-reference">API Reference</a>
</p>

------------------------------------------------------------------------

## Overview

**Voqra** is a full-stack real-time communication application with a
React Native/Expo mobile client and a TypeScript/Express backend.

The project combines persistent messaging with real-time WebSocket
events, Clerk-based authentication, Cloudinary media storage, user
profiles, and 24-hour stories.

> **Status:** Active development. Core authentication, user discovery,
> one-to-one messaging, media sharing, stories, profile editing, and
> real-time presence are implemented. Calling features and several
> profile settings screens are currently placeholders.

## Features

### Authentication

- Email/password sign in and registration with Clerk
- Email verification during registration
- Email verification and MFA handling during sign in when required
- Protected application routes
- Clerk bearer tokens automatically attached to API requests
- Lazy synchronization of authenticated Clerk users into MongoDB

### Messaging

- Search users by name, email, or handle
- Start or reuse one-to-one conversations
- Conversation list ordered by recent activity
- Text messaging
- Image and video attachments
- Persistent message history
- Destructive conversation deletion
- Real-time incoming message events

### Real-time communication

- Online/offline presence
- Last-seen timestamps
- Typing indicators
- Real-time message delivery
- Profile update broadcasts
- Conversation deletion events
- Token-authenticated WebSocket connections

### Stories

- Upload image or video stories
- Full-screen story viewer
- Five-second story progression
- Previous/next tap navigation
- Stories grouped by user
- 24-hour story visibility and MongoDB TTL expiration

### Profiles

- View profile
- Edit name
- Edit username/handle
- Edit bio
- Change avatar
- Server-side handle uniqueness validation
- Real-time propagation of profile changes
- Sign out

## Tech Stack

| Area               | Technology                    |
|--------------------|-------------------------------|
| Mobile             | React Native                  |
| App framework      | Expo 57                       |
| Navigation         | Expo Router                   |
| Language           | TypeScript                    |
| Authentication     | Clerk                         |
| Backend            | Node.js + Express 5           |
| Database           | MongoDB + Mongoose            |
| Real-time          | WebSocket (`ws`)              |
| Media storage      | Cloudinary                    |
| File uploads       | Multer                        |
| HTTP client        | Axios                         |
| Video              | Expo Video                    |
| Image/media picker | Expo Image Picker             |
| Icons              | Expo Vector Icons             |
| UI                 | React Native + Expo libraries |

## System Architecture

<p align="center">
  <img src="./public/Voqra%20architecture.png" alt="Voqra System Architecture" width="900"/>
</p>

## How Messaging Works

1.  A signed-in user searches for another user.
2.  The client requests the conversation endpoint.
3.  The backend finds an existing two-person conversation or creates
    one.
4.  Existing messages are loaded from MongoDB.
5.  New messages are submitted through the REST API.
6.  If media is attached, Multer keeps it in memory and streams it to
    Cloudinary.
7.  The resulting message is persisted in MongoDB.
8.  The client sends a WebSocket event to notify the recipient.
9.  The recipient receives the event through the authenticated WebSocket
    connection.
10. Typing and presence events are handled through the same WebSocket
    layer.
<p align="center">
  <img src="./public/Voqra%20messaging.png" alt="Voqra Messaging" width="900"/>
</p>

## Authentication Flow

Voqra uses Clerk as the authentication provider while MongoDB stores
application-specific user information.

<p align="center">
  <img src="./public/Voqra%20authentication%20flow.png" alt="Voqra Authentication Flow" width="900"/>
</p>

When an authenticated user reaches a protected server route for the
first time, the backend checks whether a corresponding local MongoDB
user exists. If not, it fetches the user’s Clerk information and creates
the local record.

## Repository Structure

``` text
Voqra/
│
├── client/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── index.tsx
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   ├── search.tsx
│   │   │   ├── profile.tsx
│   │   │   └── _layout.tsx
│   │   ├── chat/
│   │   │   └── [id].tsx
│   │   └── _layout.tsx
│   │
│   ├── components/
│   ├── context/
│   │   └── AppContext.tsx
│   ├── constants/
│   ├── assets/
│   │   └── styles/
│   ├── utils/
│   ├── app.json
│   └── package.json
│
└── server/
    ├── config/
    │   ├── cloudinary.ts
    │   └── db.ts
    ├── controllers/
    │   ├── messageController.ts
    │   ├── storyController.ts
    │   └── userController.ts
    ├── middlewares/
    │   ├── auth.ts
    │   └── upload.ts
    ├── models/
    │   ├── User.ts
    │   ├── Conversation.ts
    │   ├── Message.ts
    │   └── Story.ts
    ├── routes/
    │   ├── userRoutes.ts
    │   ├── messageRoutes.ts
    │   └── storyRoutes.ts
    ├── socket/
    │   └── socketManager.ts
    ├── server.ts
    └── package.json
```

## Getting Started

### Prerequisites

Install/configure:

- Node.js and npm
- MongoDB
- Clerk application
- Cloudinary account
- Android Studio/emulator, iOS simulator, or a physical device for
  mobile development as appropriate

### 1. Clone

``` bash
git clone https://github.com/Sumit0-hash/Voqra.git
cd Voqra
```

### 2. Install client dependencies

``` bash
cd client
npm install
```

### 3. Install server dependencies

``` bash
cd ../server
npm install
```

## Environment Variables

### Client

Create:

``` text
client/.env
```

Add:

``` env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Server

Create:

``` text
server/.env
```

Add:

``` env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit real credentials.

## Run the Backend

From `server/`:

### Development

``` bash
npm run server
```

### Start

``` bash
npm start
```

### Build

``` bash
npm run build
```

The backend exposes the REST API and attaches the WebSocket server at:

``` text
/ws
```

A basic health endpoint is also available:

``` text
GET /
```

## Run the Expo Client

From `client/`:

``` bash
npm start
```

Or:

``` bash
npm run android
npm run ios
npm run web
```

For linting:

``` bash
npm run lint
```

## Physical Device Configuration

The current development configuration uses a LAN IP for Android/iOS and
`localhost` for other targets.

In:

``` text
client/constants/config.ts
```

update the host to the local IP address of the computer running the
backend:

``` ts
const HOST = Platform.select({
  ios: "YOUR_MACHINE_LAN_IP",
  android: "YOUR_MACHINE_LAN_IP",
  default: "localhost",
});
```

The client then communicates with:

``` text
http://<host>:3000
ws://<host>:3000/ws
```

For a physical device, the phone and development computer normally need
to be reachable on the same local network.

## API Reference

Protected endpoints require a valid Clerk bearer token.

### Users

| Method | Endpoint                      | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/api/users`                  | List users except the authenticated user |
| GET    | `/api/users/search?query=...` | Search by name, email, or handle         |
| GET    | `/api/users/profile`          | Get the current user’s profile           |
| PUT    | `/api/users/profile`          | Update profile and optional avatar       |

### Conversations & Messages

| Method | Endpoint                                               | Description                              |
|--------|--------------------------------------------------------|------------------------------------------|
| GET    | `/api/messages/conversations`                          | Get current user’s conversations         |
| GET    | `/api/messages/conversations/with/:targetUserId`       | Find or create a one-to-one conversation |
| GET    | `/api/messages/conversations/:conversationId/messages` | Get conversation messages                |
| POST   | `/api/messages/send`                                   | Send text and/or image/video media       |
| DELETE | `/api/messages/conversations/:conversationId`          | Delete a conversation and its messages   |

### Stories

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/api/stories` | Upload an image/video story        |
| GET    | `/api/stories` | Get recent stories grouped by user |

## WebSocket API

Connect using:

``` text
ws://<host>:3000/ws?token=<clerk_token>
```

### Client Events

#### `message`

Used to notify the recipient of a newly persisted message.

``` json
{
  "type": "message",
  "receiverId": "user_id",
  "conversationId": "conversation_id",
  "payload": {}
}
```

#### `typing`

``` json
{
  "type": "typing",
  "receiverId": "user_id",
  "isTyping": true
}
```

### Server Events

| Event           | Purpose                                             |
|-----------------|-----------------------------------------------------|
| `message`       | Deliver a real-time message                         |
| `typing`        | Notify a participant that someone is typing         |
| `online_status` | Broadcast presence changes                          |
| `user_update`   | Broadcast profile changes                           |
| `chat_deleted`  | Notify participants that a conversation was deleted |

## Data Models

### User

``` text
_id
name
email
handle
avatar
bio
isOnline
lastSeen
createdAt
updatedAt
```

`email` and `handle` are unique.

### Conversation

``` text
participants[]
lastMessage
createdAt
updatedAt
```

The current implementation is designed for two-person conversations.

### Message

``` text
sender
receiver
conversationId
text
mediaUrl
mediaType
read
createdAt
updatedAt
```

`mediaType` can be:

``` text
image
video
```

### Story

``` text
user
mediaUrl
mediaType
createdAt
updatedAt
```

Stories use a 24-hour TTL configuration and are also filtered by the API
to the most recent 24 hours.

## Media Handling

Uploads use Multer’s memory storage:

``` text
Device
  │
  ▼
Multer memory buffer
  │
  ▼
Cloudinary upload stream
  │
  ▼
Secure Cloudinary URL
  │
  ▼
MongoDB document
```

The configured server-side upload limit is **5 MB per file**.

Current Cloudinary folders:

``` text
voqra_chat_avatars
voqra_chat
voqra_chat_stories
```

## Client State Management

`AppContext` acts as the central client-side state layer.

It coordinates:

- Authentication state
- Current user
- User discovery
- Stories
- Conversations
- Selected conversation
- Messages
- Typing state
- WebSocket lifecycle
- Profile updates

Axios authentication is centralized through an interceptor so API
requests automatically receive the current Clerk token.

## Development Scripts

### Client

``` bash
npm start       # Start Expo
npm run android # Run Android
npm run ios     # Run iOS
npm run web     # Run web
npm run lint    # Run ESLint
```

### Server

``` bash
npm run server  # Development server with Nodemon
npm start       # Start with tsx
npm run build   # Build TypeScript
```

## Current Limitations

Voqra is still under development. The current codebase has several known
boundaries:

- Messaging is currently one-to-one; group chat is not implemented.
- Call and video-call buttons exist in the chat UI but do not currently
  initiate calls.
- Settings, Notifications, Privacy & Security, and Help & Support
  profile rows are UI placeholders.
- The development API/WebSocket host is hard-coded and should be moved
  to environment/build configuration for production.
- WebSocket presence is maintained in process memory, so a horizontally
  scaled deployment would require shared presence infrastructure.
- The current WebSocket architecture is intentionally lightweight and is
  not yet designed for a multi-instance production deployment.
- No project license is currently declared.

## Recommended Production Improvements

Before deploying Voqra at scale, consider:

1.  Move API and WebSocket URLs to environment/build-time configuration.
2.  Use HTTPS and WSS.
3.  Add request validation and consistent error handling.
4.  Add rate limiting for authentication-adjacent and messaging
    endpoints.
5.  Add message pagination instead of loading an entire conversation.
6.  Add indexes for frequent MongoDB queries.
7.  Replace the in-memory WebSocket registry with a shared solution such
    as Redis when running multiple server instances.
8.  Add automated tests for authentication, messaging, conversations,
    uploads, and WebSocket events.
9.  Add proper group-chat support if required.
10. Implement calling/video calling separately from the current chat UI.
11. Add a production logging/monitoring strategy.
12. Review upload MIME-type validation and production media-size
    policies.

## Security

- Keep `.env` files out of version control.
- Never expose `CLERK_SECRET_KEY` or Cloudinary API secrets to the
  client.
- Restrict MongoDB access in production.
- Use HTTPS/WSS in production.
- Keep protected API routes behind authentication middleware.
- Validate uploaded files and request payloads before processing them in
  production.
- Consider rate limiting and abuse protection before public deployment.

## License

No license is currently declared for this repository.

If you intend to distribute Voqra as open source, add an appropriate
`LICENSE` file.

## Author

**Sumit Bhatia**

GitHub: https://github.com/Sumit0-hash

------------------------------------------------------------------------

<p align="center">
Built with TypeScript, React Native, Expo, Express, MongoDB, Clerk,
Cloudinary, and WebSockets.
</p>
