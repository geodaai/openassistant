import React from 'react';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';
import {
  overtureQueryTool,
  getStateOrProvinceBoundariesTool,
} from '@openassistant/duckdb';
import { z } from 'zod';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => 'You are a helpful assistant.',
    tools: {
      getStateOrProvinceBoundaries: getStateOrProvinceBoundariesTool,
    },
  },
};

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={config} />
      </div>
    </div>
  );
}
