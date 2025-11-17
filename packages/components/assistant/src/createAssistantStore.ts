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

  return createRoomStore<State>(
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
}
