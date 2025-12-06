# Vercel AI SDK Example

This example shows how to use the OpenAssistant tools with the Vercel AI SDK.

## Overview

This example demonstrates:

- Creating a Vercel AI SDK tool (weatherTool) using the `tool` function
- Using the `useChat` hook from `ai/react` for a chat interface
- Setting up a streaming API endpoint with Express

## Prerequisites

- Node.js 18+ and Yarn
- OpenAI API key (set as `OPENAI_API_KEY` environment variable)

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set your OpenAI API key:

   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```

3. Start the API server (in one terminal):

   ```bash
   yarn dev:server
   ```

4. Start the Vite dev server (in another terminal):

   ```bash
   yarn dev
   ```

5. Open your browser to `http://localhost:5173` (or the port Vite assigns)

## Project Structure

- `server/index.ts` - Express API server with weather tool definition
- `server/index.ts` - Express API server with streaming endpoint
- `src/App.tsx` - React component using `useChat` hook
- `vite.config.ts` - Vite configuration with proxy to API server

## How It Works

1. The `weatherTool` is defined directly using Vercel AI SDK's `tool` function with Zod schemas
2. The `useChat` hook connects to `/api/chat` which proxies to the Express server
3. The server streams responses using Vercel AI SDK's `streamText` function
4. The React component displays the chat interface with streaming messages

## Try It Out

Ask questions like:

- "What's the weather in San Francisco?"
- "Tell me the weather in London in fahrenheit"
- "How's the weather in Tokyo?"
