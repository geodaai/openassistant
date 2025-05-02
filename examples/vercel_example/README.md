# ToolManager Example

This example demonstrates how to use the ToolManager from OpenAssistant to create and manage custom tools.

## Features

- Demonstrates ToolManager initialization and usage
- Implements a simple calculator tool
- Shows how to integrate tools with the OpenAssistant core

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Example

Start the example with:
```bash
npm start
```

## Usage

Once running, you can interact with the assistant and use the calculator tool. Try asking questions like:

- "What is 5 plus 3?"
- "Can you multiply 10 by 7?"
- "What is 20 divided by 4?"

The assistant will use the calculator tool to perform these operations.

## How it Works

The example demonstrates:

1. ToolManager initialization
2. Tool registration and context management
3. Tool execution with proper parameter handling
4. Integration with OpenAssistant core

## Project Structure

- `index.js` - Main application file
- `package.json` - Project dependencies and configuration
- `.env` - Environment variables (create this file) 