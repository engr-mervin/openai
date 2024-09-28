# Open AI App

## Description

Welcome to the OpenAI Chat App! This application allows users to interact with the OpenAI API through a WebSocket connection, offering a real-time chat experience.

## Tech Stack

- **Node.js** - Server-side JavaScript runtime
- **WebSockets** - Full-duplex communication channels over a single TCP connection
- **OpenAI Package + Streaming API** - For interacting with OpenAI's API
- **React** - Frontend library for building user interfaces
- **useWebSocket** - React hook for managing WebSocket connections
- **TypeScript** - A superset of JavaScript that adds static typing
- **npm Monorepo** - For managing multiple packages via npm

## Getting Started

### Prerequisites

You will need to have Node.js and npm installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/engr-mervin/openai.git
   cd openai
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Adding your api-key

1. Open server app

   ```bash
   cd /apps/server
   ```

2. Create a new .env file and set the env variable

   ```bash
   OPENAI_API_KEY = your-api-key
   ```

### Running the App

To run the application, you'll need to start both the server and the client:

1. Start the development server:

   ```bash
   npm run dev-server
   ```

2. In a separate terminal window, open the same openai folder and start the development client:

   ```bash
   cd openai
   npm run dev-client
   ```

3. Open your web browser and go to **[http://localhost:5173](http://localhost:5173)**. You can now interact with OpenAI through the app.

## Usage

Once you've navigated to the app in your web browser, you can type your messages in the input area, and the app will send them to OpenAI for processing. The responses will be displayed in the conversation area, allowing for a natural dialogue.

## Contributing

If you'd like to contribute to this project, feel free to submit a pull request or open an issue for any bugs or feature requests.

---
