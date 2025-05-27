import {
  TextUIPart,
  ReasoningUIPart,
  ToolInvocationUIPart,
  SourceUIPart,
  FileUIPart,
  StepStartUIPart,
} from '@ai-sdk/ui-utils';
import { ToolInvocation } from './tools';

export function MessageParts({
  parts,
  toolAdditionalData,
  getValues,
}: {
  parts: Array<
    | TextUIPart
    | ReasoningUIPart
    | ToolInvocationUIPart
    | SourceUIPart
    | FileUIPart
    | StepStartUIPart
  >;
  toolAdditionalData: Record<string, unknown>;
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
}) {
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
