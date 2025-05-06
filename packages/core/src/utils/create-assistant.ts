import { GetAssistantModelByProvider } from '../lib/model-utils';
import { UseAssistantProps } from '../hooks/use-assistant';

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
  const AssistantModel = GetAssistantModelByProvider({
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
    ...(props.baseUrl ? { baseURL: props.baseUrl } : {}),
  });

  // register custom functions using Vercel Tool format
  const tools = props.tools;

  if (tools) {
    Object.keys(tools).forEach((functionName) => {
      const func = tools![functionName];
      const { execute, context, component, ...rest } = func;

      AssistantModel.registerTool({
        name: functionName,
        tool: rest,
        func: createCallbackFunction(execute),
        context,
        component: component as React.ComponentType,
      });
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
    assistant.setMessages(props.historyMessages);
  }

  // set the abort controller
  if (props.abortController) {
    assistant.setAbortController(props.abortController);
  }

  return assistant;
}

function isExecuteFunctionResult(result: unknown) {
  return typeof result === 'object' && result !== null && 'llmResult' in result;
}

function createCallbackFunction(execute) {
  const callbackFunction = async (props) => {
    const { functionArgs, functionContext, functionName, previousOutput } =
      props;
    const args = functionArgs;
    const context = functionContext;

    try {
      const result = await execute?.(args, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context: context as any,
        previousExecutionOutput: previousOutput,
      });

      // check result type: {llmResult, outputData}
      if (!isExecuteFunctionResult(result)) {
        return {
          name: functionName,
          result: {
            success: false,
            details:
              'Failed to execute function. Executaion results are not valid.',
          },
        };
      }

      return {
        name: functionName,
        result: result.llmResult,
        data: 'additionalData' in result ? result.additionalData : undefined,
      };
    } catch (error) {
      return {
        type: 'error',
        name: functionName,
        result: {
          success: false,
          details: `Failed to execute function. ${error}`,
        },
      };
    }
  };

  return callbackFunction;
}
