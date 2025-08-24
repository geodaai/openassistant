// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { UIDataTypes, UIMessagePart, UITools } from 'ai';
import { ToolInvocation } from './tools';

interface MessagePartsProps {
  parts: Array<UIMessagePart<UIDataTypes, UITools>>;
  toolAdditionalData: Record<string, unknown>;
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
}

export function MessageParts({
  parts,
  toolAdditionalData,
  getValues,
}: MessagePartsProps) {
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part) => {
        switch (part.type) {
          case 'text':
            return part.text;
          case 'tool-localQuery': {
            const { toolCallId, state, input, output } = part;
            // In Vercel AI v5, toolName is not directly available,
            // but we can infer it from the type or use a default
            const toolName = 'localQuery'; // Since this is the only tool type we handle
            const additionalData = toolAdditionalData[toolCallId];
            return (
              <ToolInvocation
                key={toolCallId}
                toolCallId={toolCallId}
                state={state}
                toolName={toolName}
                additionalData={additionalData}
                getValues={getValues}
              />
            );
          }
          default:
            return null;
        }
      })}
      <br />
    </div>
  );
}
