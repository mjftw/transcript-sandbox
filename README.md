Absolutely! Here's a `README.md` for your sandbox project:

---

# Video Call Live Closed Captioning Sandbox

This project demonstrates a live closed captioning system for video calls using NextJS for the frontend, Speechly for audio transcription, and Phoenix with PubSub for backend real-time interactions.

## System Flow

Here's a visual representation of the system flow using a Mermaid diagram:

```mermaid
sequenceDiagram
    participant SpeechlyAPI as Speechly API
    participant BrowserA as Browser A
    participant BrowserB as Browser B
    participant NextJSServer as NextJS Server
    participant PhoenixServer as Phoenix Server

    BrowserA->>+NextJSServer: Request page load
    NextJSServer->>BrowserA: Serve page
    BrowserA->>+PhoenixServer: Connect WebSocket (Room: 1234, User: A)
    PhoenixServer->>BrowserA: Acknowledge Connection

    BrowserB->>+NextJSServer: Request page load
    NextJSServer->>BrowserB: Serve page
    BrowserB->>+PhoenixServer: Connect WebSocket (Room: 1234, User: B)
    PhoenixServer->>BrowserB: Acknowledge Connection

    BrowserA->>+SpeechlyAPI: Send audio stream
    SpeechlyAPI->>BrowserA: Return live audio transcript
    BrowserA->>+PhoenixServer: Send transcript (User: A)
    PhoenixServer->>BrowserB: Broadcast transcript from User A

    BrowserB->>+SpeechlyAPI: Send audio stream
    SpeechlyAPI->>BrowserB: Return live audio transcript
    BrowserB->>+PhoenixServer: Send transcript (User: B)
    PhoenixServer->>BrowserA: Broadcast transcript from User B
```

### Workflow Explanation:

1. **Page Load**: Each user (Browser A & Browser B in this example) initially loads the application via the NextJS Backend.
2. **WebSocket Connection**: Once loaded, each browser establishes a WebSocket connection with the Phoenix Server to be part of a room, identified by a room ID.
3. **Audio to Transcript**: For closed captioning, each user sends their audio stream to Speechly API, which returns a live audio transcript.
4. **Transcript Broadcasting**: The returned transcript is then sent to the Phoenix Server, which broadcasts it to all connected users in the room.

## Prerequisites

### Using `asdf` for Version Management

This project relies on `asdf` for version management. To ensure consistent behavior across different environments, we use the `.tool-versions` file to specify the required versions for NodeJS and Elixir.

1. If you don't have `asdf` installed, follow the [official installation guide](https://asdf-vm.com/#/core-manage-asdf?id=install).
2. Navigate to the project root directory and install the required versions using: `asdf install`
3. After installing the required versions, the respective language or runtime (NodeJS or Elixir) can be used based on the version specified in the `.tool-versions` file.

## Directory Structure

- `nextjs-app/` - Contains the NextJS frontend application.
- `phoenix-app/` - Houses the Phoenix backend application with PubSub for real-time interactions.

## Getting Started

To set up and run the project, follow these instructions:

### NextJS App

```bash
cd nextjs-app
npm install
npm run dev
```

### Phoenix App

First, ensure you have Elixir and Phoenix installed.

```bash
cd phoenix-app
mix deps.get
mix ecto.setup
mix phx.server
```

### Running Both Applications for Development

For a streamlined local development experience, we've provided a script that runs both the Phoenix and NextJS applications simultaneously.
Using the Development Script:

```shell
./start-dev.sh
```

Both the Phoenix and NextJS servers will start, and their logs will display in your terminal. To stop both servers, use CTRL+C in your terminal, which will terminate both processes.

## Chat Route (/chat)

### Overview

The Chat route at [/chat](localhost:3000/chat) provides users with an interactive platform to engage in real-time conversations.

### Features

- Live Messaging: Users can exchange messages in real-time.
- Dynamic Username: Before sending messages, each participant can specify their desired username.
- Connection Status: The "Send Message" button is intuitive. It remains inactive until a websocket connection is established and a username is input, ensuring that messages are only sent when conditions are optimal.

### How to Access

From the main dashboard or homepage, locate and click on the "Chat" link or button.
Alternatively, you can access it directly by typing in the /chat endpoint in the browser's address bar.

### Technical Details

This route employs Phoenix Channels websocket for real-time bi-directional communication. When the backend broadcasts messages, they are captured and promptly displayed on the frontend for all active participants in the chat room.
