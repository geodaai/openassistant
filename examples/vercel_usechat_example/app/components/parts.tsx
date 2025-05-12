import { ToolInvocation } from './tools';

interface MessagePartsProps {
  parts: any[];
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
          case 'tool-invocation': {
            const { toolCallId, state, toolName } = part.toolInvocation;
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
        }
      })}
      <br />
    </div>
  );
}
