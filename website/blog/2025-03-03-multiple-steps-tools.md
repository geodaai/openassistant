---
slug: multiple-steps-tools
title: Building Multi-Step AI Tools with OpenAssistant
authors: [XunLi]
tags: [openassistant, function-tools]
---

OpenAssistant now provides enhanced support for creating multi-step AI tools using Zod, enabling LLMs to break down complex tasks into manageable steps while maintaining context throughout the process. Let's explore how this powerful feature works and how you can implement it in your applications.

<!--truncate-->

## Understanding Multi-Step AI Tools

Multi-step tools in OpenAssistant allow Large Language Models (LLMs) to:

- Call the same or different tools multiple times to gather necessary information
- Compare results from multiple tool calls
- Make intelligent decisions based on collected data
- Maintain context across multiple steps
- Provide comprehensive visual feedback

## How Multi-Step Tools Work

Let's explore a practical example: comparing temperatures between cities. When a user asks "Is Chicago warmer than New York?", the LLM needs to:

1. Get Chicago's temperature
2. Get New York's temperature
3. Compare the results and provide a conclusion

### 1. Defining the Tool Structure

Here's a temperature tool that can be called multiple times:

```tsx
const functions = {
  temperature: tool({
    description: 'Get the temperature in a city from a weather station',
    parameters: z.object({
      cityName: z.string(),
      reason: z.string(), // Why the temperature is being requested
    }),
    execute: async ({ cityName, reason }, options) => {
      // Step 1: Get the weather station information
      const getStation = options.context?.getStation;
      const station = getStation ? await getStation(cityName) : null;

      // Step 2: Retrieve temperature data
      const getTemperature = options.context?.getTemperature;
      const temperature = getTemperature
        ? await getTemperature(cityName)
        : null;

      return {
        llmResult: `The temperature in ${cityName} is ${temperature} degrees from weather station ${station}.`,
        output: {
          cityName,
          temperature,
          station,
          reason,
        },
      };
    },
    context: {
      getStation: async (cityName: string) => {
        const stations = {
          'New York': '123',
          'Los Angeles': '456',
          Chicago: '789',
        };
        return stations[cityName];
      },
      getTemperature: async (cityName: string) => {
        const temperatures = {
          'New York': 70,
          'Los Angeles': 80,
          Chicago: 60,
        };
        return temperatures[cityName];
      },
    },
    component: WeatherStation,
  }),
};
```

## Example Multi-Step Interaction

Let's walk through how the LLM handles the question "Is Chicago warmer than New York?":

1. **First Tool Call**:

   ```typescript
   // LLM calls temperature tool for Chicago
   await temperature({
     cityName: 'Chicago',
     reason: 'Comparing temperature with New York',
   });
   // Returns: temperature = 60°F
   ```

2. **Second Tool Call**:

   ```typescript
   // LLM calls temperature tool for New York
   await temperature({
     cityName: 'New York',
     reason: 'Comparing temperature with Chicago',
   });
   // Returns: temperature = 70°F
   ```

3. **LLM Analysis**:
   - Chicago: 60°F
   - New York: 70°F
   - Conclusion: "No, Chicago (60°F) is not warmer than New York (70°F). New York is currently 10 degrees warmer."

Each tool call generates its own visual feedback using the WeatherStation component:

```tsx
function WeatherStation({ temperature, station, cityName, reason }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-2 bg-gray-100">
      <div>{reason}</div>
      <div className="flex flex-row gap-2">
        <div>{cityName}</div>
        <div>{temperature}°F</div>
        <div>Station: {station}</div>
      </div>
    </div>
  );
}
```

## Benefits of Multi-Step Tool Execution

- **Sequential Data Gathering**: Tools can be called multiple times to collect all necessary information
- **Comparative Analysis**: LLM can compare results from multiple tool calls
- **Context Awareness**: Each tool call can reference previous results
- **Progressive UI Updates**: Users see results appear as each step completes
- **Flexible Problem Solving**: Complex queries can be broken down into multiple tool calls

## Example Conversation Flow

## Integration with OpenAssistant

Implement the multi-step tool in your application:

```tsx
export function App() {
  return (
    <div className="w-[400px] h-[800px] m-4">
      <AiAssistant
        name="My Assistant"
        apiKey={process.env.OPENAI_TOKEN || ''}
        version="v1"
        modelProvider="openai"
        model="gpt-4"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant. Explain the steps you are taking to solve the user's problem."
        functions={functions}
        useMarkdown={true}
      />
    </div>
  );
}
```

## Conclusion

Multi-step tools in OpenAssistant provide a powerful framework for creating sophisticated AI interactions. By breaking down complex tasks into discrete steps, maintaining context, and providing visual feedback, you can create more reliable and user-friendly AI-powered applications.

Whether you're building a weather service, a data analysis tool, or any other multi-step process, OpenAssistant's tool system provides the structure and flexibility you need to create effective AI solutions.
