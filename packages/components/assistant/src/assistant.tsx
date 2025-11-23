import React from 'react';
import {
  RoomStateProvider,
  type RoomStateProviderProps,
} from '@sqlrooms/room-store';
import { MainView } from './components/MainView';
import { roomStore as defaultRoomStore } from './store';
import { createAssistantStore, AssistantOptions } from './createAssistantStore';

type AssistantProps = {
  options?: AssistantOptions;
  children?: React.ReactNode;
};

// Context to provide the actions hook to child components
const AssistantActionsContext = React.createContext<(() => ReturnType<ReturnType<typeof createAssistantStore>['useAssistantActions']>) | null>(null);

export const Assistant: React.FC<AssistantProps> = ({ options, children }) => {
  // Lazy initialization: create store once and preserve across re-renders
  // Falls back to defaultRoomStore if no options provided
  const storeRef = React.useRef<ReturnType<typeof createAssistantStore>>();
  if (!storeRef.current && options) {
    storeRef.current = createAssistantStore(options);
  }
  const effectiveStore = storeRef.current?.roomStore ?? defaultRoomStore;
  const useAssistantActions = storeRef.current?.useAssistantActions ?? null;

  // Cast provider to a valid JSX component type (library types return ReactNode)
  const RoomProvider = RoomStateProvider as unknown as React.ComponentType<
    RoomStateProviderProps<
      typeof effectiveStore extends { getState: () => infer S } ? S : never
    >
  >;

  return (
    <AssistantActionsContext.Provider value={useAssistantActions}>
      <RoomProvider roomStore={effectiveStore}>
        {children ?? <MainView />}
      </RoomProvider>
    </AssistantActionsContext.Provider>
  );
};

/**
 * Hook to access assistant actions from within the Assistant component tree.
 * This allows child components to programmatically interact with the assistant.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { sendMessage, sendPrompt, isProcessing } = useAssistantActions();
 *   
 *   const handleClick = () => {
 *     sendMessage("Analyze the data");
 *   };
 *   
 *   return <button onClick={handleClick} disabled={isProcessing}>Send Message</button>;
 * }
 * ```
 */
export const useAssistantActions = () => {
  const useActionsHook = React.useContext(AssistantActionsContext);
  if (!useActionsHook) {
    throw new Error('useAssistantActions must be used within an Assistant component with options provided');
  }
  return useActionsHook();
};
