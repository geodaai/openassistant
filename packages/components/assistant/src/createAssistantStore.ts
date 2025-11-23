import { AiSliceConfig, AiSliceState, createAiSlice } from '@sqlrooms/ai-core';
import {
  AiSettingsSliceConfig,
  AiSettingsSliceState,
  createAiSettingsSlice,
} from '@sqlrooms/ai-settings';
import {
  createBaseRoomSlice,
  createPersistHelpers,
  createRoomStore,
  BaseRoomStoreState,
  StateCreator,
} from '@sqlrooms/room-store';
import { persist } from 'zustand/middleware';
import { OpenAssistantToolSet } from '@openassistant/utils';
import { AI_SETTINGS } from './config';

type State = BaseRoomStoreState & AiSliceState & AiSettingsSliceState;

export type AssistantOptions = {
  aiSettings?: {
    initialSettings?: Pick<AiSettingsSliceConfig, 'providers'>;
  };
  ai: {
    getInstructions: () => string;
    tools?: unknown;
  };
  persistKey?: string;
};

/**
 * Create a reusable AI assistant store that composes base room, settings, and AI slices.
 */
export function createAssistantStore(options: AssistantOptions) {
  const persistKey = options.persistKey || 'openassistant-ai-state-storage';
  const initialSettings =
    options.aiSettings?.initialSettings ||
    (AI_SETTINGS as Pick<AiSettingsSliceConfig, 'providers'>);

  // Convert tools to proper format by adding name from key
  const convertedTools = Object.entries(options.ai.tools || {}).reduce(
    (acc, [name, tool]) => {
      acc[name] = {
        name,
        ...tool,
      };
      return acc;
    },
    {} as Record<string, unknown>
  );

  const storeResult = createRoomStore<State>(
    persist(
      (set, get, store) => ({
        // Base room slice
        ...createBaseRoomSlice()(set, get, store),

        // AI model configuration slice
        ...createAiSettingsSlice({ config: initialSettings })(set, get, store),

        // AI slice
        ...createAiSlice({
          getInstructions: options.ai.getInstructions,
          tools: convertedTools as unknown as OpenAssistantToolSet,
        })(set, get, store),
      }),

      // Persist settings
      {
        // Local storage key
        name: persistKey,
        // Helper to extract and merge slice configs
        ...createPersistHelpers({
          ai: AiSliceConfig,
          aiSettings: AiSettingsSliceConfig,
        }),
      }
    ) as StateCreator<State>
  );

  // Extract the store and hook from the result
  const { roomStore, useRoomStore } = storeResult;

  // Create a custom hook for actions that works with this store instance
  const useAssistantActions = () => {
    const ai = useRoomStore((state) => (state as State).ai);

    // Simple wrapper functions without complex typing
    const sendMessage = (message: string) => {
      if (!ai) {
        throw new Error(
          'AI slice not initialized. Make sure the Assistant component is properly configured with options.'
        );
      }
      
      if (!ai.chatSendMessage) {
        throw new Error(
          'chatSendMessage not available. The chat system may not be fully initialized yet.'
        );
      }
      
      if (!ai.setAnalysisPrompt || !ai.startAnalysis) {
        throw new Error(
          'Analysis functions not available. The AI slice may not be properly configured.'
        );
      }

      try {
        // Set the analysis prompt first
        ai.setAnalysisPrompt(message);
        // Start analysis - this will use the analysisPrompt from the AI slice state
        ai.startAnalysis(ai.chatSendMessage);
      } catch (error) {
        throw new Error(
          `Failed to send message: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    return {
      // Actions
      sendMessage,
      // Raw store access for advanced use cases
      store: useRoomStore((state) => state),
    };
  };

  return {
    roomStore,
    useRoomStore,
    useAssistantActions,
  };
}
