// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { GetAssistantModelByProvider } from '../lib/model-utils';
import { UseAssistantProps } from '../hooks/use-assistant';
import { Tool, convertToCoreMessages } from 'ai';
import { OpenAssistantTool } from '@openassistant/utils';

function isOpenAssistantTool(tool: Tool | OpenAssistantTool): tool is OpenAssistantTool {
  return tool instanceof OpenAssistantTool;
}

/**
 * Creates an AI assistant instance with the specified configuration
 *
 * @param props - Configuration properties for the assistant. See {@link UseAssistantProps} for more details.
 * @returns Promise that resolves to the configured assistant instance
 *
 * @example
 * ```ts
 * const assistant = await createAssistant({
 *   modelProvider: 'openai',
 *   model: 'gpt-4',
 *   apiKey: 'your-api-key',
 *   instructions: 'You are a helpful assistant',
 *   tools: [
 *     tool({
 *       description: 'Get the weather in a location',
 *       parameters: z.object({ location: z.string() }),
 *       execute: async ({ location }, option) => {
 *         const getStation = options.context?.getStation;
 *         const station = getStation ? await getStation(location) : null;
 *         return { llmResult: `Weather in ${location} from station ${station}.` };
 *       },
 *       context: {
 *         getStation: async (location) => {
 *           return { station: '123' };
 *         },
 *       },
 *       component: WeatherComponent,
 *     })
 *   ]
 * });
 */
export async function createAssistant(props: UseAssistantProps) {
  const AssistantModel = await GetAssistantModelByProvider({
    provider: props.modelProvider,
    chatEndpoint: props.chatEndpoint,
  });

  // configure the assistant model
  AssistantModel.configure({
    chatEndpoint: props.chatEndpoint,
    voiceEndpoint: props.voiceEndpoint,
    model: props.model,
    apiKey: props.apiKey,
    instructions: props.instructions,
    temperature: props.temperature,
    topP: props.topP,
    description: props.description,
    version: props.version,
    toolChoice: props.toolChoice,
    maxSteps: props.maxSteps,
    toolCallStreaming: props.toolCallStreaming,
    ...(props.baseUrl? { baseURL: props.baseUrl} : {}),
    ...(props.headers ? { headers: props.headers } : {}),
    ...(props.raw ? { raw: props.raw } : {}),
  });

  // register custom functions using Vercel Tool format
  const tools = props.tools;

  if (tools) {
    Object.keys(tools).forEach((functionName) => {
      const toolObject = tools![functionName];
      if (isOpenAssistantTool(toolObject)) {
        // Convert OpenAssistantTool to Vercel AI SDK tool format
        const vercelTool = toolObject.toVercelAiTool();

        AssistantModel.registerTool({
          name: functionName,
          tool: vercelTool,
          component: toolObject.component,
        });
      } else {
       AssistantModel.registerTool({
         name: functionName,
         tool: toolObject,
       }); 
      }
    });
  }

  // initialize the assistant model
  const assistant = await AssistantModel.getInstance();

  // restore the history messages
  if (
    props.historyMessages &&
    props.historyMessages.length > 0 &&
    assistant.getMessages().length === 0
  ) {
    assistant.setMessages(convertToCoreMessages(props.historyMessages));
  }

  // set the abort controller
  if (props.abortController) {
    assistant.setAbortController(props.abortController);
  }

  return assistant;
}
