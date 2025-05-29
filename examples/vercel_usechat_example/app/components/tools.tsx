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
  if (state === 'result' && additionalData) {
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
