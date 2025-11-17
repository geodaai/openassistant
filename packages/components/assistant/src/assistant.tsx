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

export const Assistant: React.FC<AssistantProps> = ({ options, children }) => {
  // Lazy initialization: create store once and preserve across re-renders
  // Falls back to defaultRoomStore if no options provided
  const storeRef = React.useRef<ReturnType<typeof createAssistantStore>>();
  if (!storeRef.current && options) {
    storeRef.current = createAssistantStore(options);
  }
  const effectiveStore = storeRef.current?.roomStore ?? defaultRoomStore;

  // Cast provider to a valid JSX component type (library types return ReactNode)
  const RoomProvider = RoomStateProvider as unknown as React.ComponentType<
    RoomStateProviderProps<
      typeof effectiveStore extends { getState: () => infer S } ? S : never
    >
  >;

  return (
    <RoomProvider roomStore={effectiveStore}>
      {children ?? <MainView />}
    </RoomProvider>
  );
};
