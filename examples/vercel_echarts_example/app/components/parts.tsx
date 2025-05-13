import { JSONValue } from 'ai';
import { ToolInvocation } from './tools';
import { useCallback, useRef } from 'react';

interface MessagePartsProps {
  parts: any[];
  toolAdditionalData: Record<string, unknown>;
  annotations?: JSONValue[];
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
}

export function MessageParts({
  parts,
  toolAdditionalData,
  annotations,
  getValues,
}: MessagePartsProps) {
  // preserve the tool data between renders
  const toolDataRef = useRef<Record<string, unknown>>({});

  // compose toolAdditionalData and annotations into a single object for rendering tools
  const getToolData = useCallback(() => {
    // go through toolAdditionalData and update the toolDataRef
    Object.entries(toolAdditionalData).forEach(([key, value]) => {
      if (toolDataRef.current[key] === undefined) {
        toolDataRef.current[key] = value;
      }
    });
    // go through annotations and update the toolDataRef
    annotations?.forEach((annotation) => {
      if (typeof annotation === 'object' && annotation !== null) {
        Object.entries(annotation).forEach(([key, value]) => {
          if (toolDataRef.current[key] === undefined) {
            toolDataRef.current[key] = value;
          }
        });
      }
    });
    return toolDataRef.current;
  }, [toolAdditionalData, annotations]);

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part) => {
        switch (part.type) {
          case 'text':
            return part.text;
          case 'tool-invocation': {
            const { toolCallId, state, toolName } = part.toolInvocation;
            const additionalData = getToolData()[toolCallId];
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
        }
      })}
      <br />
    </div>
  );
}
