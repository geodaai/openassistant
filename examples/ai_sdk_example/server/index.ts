import express from 'express';
import cors from 'cors';
import { streamText, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const app = express();
const PORT = 3001;

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY environment variable is not set');
  console.error('Please set it with: export OPENAI_API_KEY=your-api-key-here');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Define weather tool directly in the server
const weatherTool = tool({
  description: 'Get the current weather for a specific location',
  inputSchema: z.object({
    location: z.string().describe('The city and state/country, e.g., "San Francisco, CA" or "London, UK"'),
    unit: z.enum(['celsius', 'fahrenheit']).optional().describe('Temperature unit (default: celsius)'),
  }),
  execute: async ({ location, unit = 'celsius' }) => {
    // Mock weather data - in a real app, you would call a weather API
    const mockTemperatures: Record<
      string,
      { celsius: number; fahrenheit: number }
    > = {
      'san francisco': { celsius: 18, fahrenheit: 64 },
      london: { celsius: 12, fahrenheit: 54 },
      tokyo: { celsius: 22, fahrenheit: 72 },
      'new york': { celsius: 15, fahrenheit: 59 },
    };

    const locationKey = location.toLowerCase();
    const temp = mockTemperatures[locationKey] || {
      celsius: Math.floor(Math.random() * 30) + 5,
      fahrenheit: Math.floor(Math.random() * 54) + 41,
    };

    const temperature = unit === 'fahrenheit' ? temp.fahrenheit : temp.celsius;
    const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';
    const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][
      Math.floor(Math.random() * 4)
    ];

    return `The weather in ${location} is ${conditions} with a temperature of ${temperature}${tempUnit}.`;
  },
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = streamText({
      model: openai('gpt-4.1'),
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      tools: {
        get_weather: weatherTool,
      },
      stopWhen: stepCountIs(5),
    });

    // Set headers for streaming (Vercel AI SDK format)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response in Vercel AI SDK format
    const stream = result.toTextStreamResponse();
    const reader = stream.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
      }
    }

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
});

