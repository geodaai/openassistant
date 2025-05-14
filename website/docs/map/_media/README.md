# OpenAssistant CLI Example

This is a simple command-line interface example that demonstrates how to use OpenAssistant in a Node.js application.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Setup

1. Navigate to the project directory:
   ```bash
   cd examples/cli_example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your OpenAI API key:
   - Copy the `.env.example` file to `.env`
   - Replace `your-api-key-here` with your actual OpenAI API key

## Usage

To start the CLI application:

```bash
npm start
```

The application will initialize the OpenAssistant and provide an interactive command-line interface where you can:

- Type your messages to interact with the assistant
- Type "exit" or "quit" to end the conversation

## Features

- Interactive command-line interface
- Real-time streaming responses
- Error handling
- Environment variable configuration
- Simple exit commands

## Example

```
$ npm start
Initializing OpenAssistant CLI...
OpenAssistant CLI is ready!
Type "exit" or "quit" to end the conversation.

You: Hello, how are you?
Assistant: Hello! I'm doing well, thank you for asking. How can I assist you today?

You: Can you help me with a coding problem?
Assistant: Of course! I'd be happy to help you with your coding problem. Please describe what you're working on and what specific issues you're encountering.

You: exit
Goodbye! 