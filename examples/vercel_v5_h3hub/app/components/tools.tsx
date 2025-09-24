// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import dynamic from 'next/dynamic';

const LocalQueryTool = dynamic(
  () =>
    import('./local-query').then((mod) => ({
      default: mod.LocalQueryTool,
    })),
  {
    ssr: false,
  }
);

interface ToolInvocationProps {
  toolCallId: string;
  state: string;
  toolName: string;
  additionalData: unknown;
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
}

export function ToolInvocation({
  toolCallId,
  state,
  toolName,
  additionalData,
  getValues,
}: ToolInvocationProps) {
  // In Vercel AI v5, the state is "output-available" instead of "result"
  if ((state === 'result' || state === 'output-available') && additionalData) {
    if (toolName === 'localQuery') {
      return (
        <LocalQueryTool
          key={toolCallId}
          toolCallId={toolCallId}
          additionalData={additionalData}
          getValues={getValues}
        />
      );
    }
  }
  return null;
}
