# Vercel useChat Example with ECharts

This is a Next.js example project that demonstrates how to use the `useChat` hook from the Vercel AI SDK with ECharts tools for data visualization.

## Features

- Next.js 14 with App Router
- Vercel AI SDK integration
- ECharts tools for data visualization
- Streaming chat responses
- Modern UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type a message in the chat input asking for a chart visualization, for example:
   - "Create a histogram of HR60 in dataset Natregimes"
   - "Show me a line chart of temperature data"

2. The assistant will use the ECharts tools to generate the visualization and respond with the chart.

## Project Structure

- `app/api/chat/route.ts` - API route for handling chat requests
- `app/page.tsx` - Main page component with chat interface
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Global styles with Tailwind CSS 