import { LocalQueryTool } from './tool-components/local-query';
import { HistogramTool } from './tool-components/histogram';
import { WeightsTool } from './tool-components/weights-info';
import { KeplerGlTool } from './tool-components/keplergl';

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
    switch (toolName) {
      case 'localQuery':
        return (
          <LocalQueryTool
            key={toolCallId}
            toolCallId={toolCallId}
            additionalData={additionalData}
            getValues={getValues}
          />
        );
      case 'histogram':
        return (
          <HistogramTool key={toolCallId} additionalData={additionalData} />
        );
      case 'spatialWeights':
        return <WeightsTool key={toolCallId} additionalData={additionalData} />;
      case 'keplergl':
        return (
          <KeplerGlTool key={toolCallId} additionalData={additionalData} />
        );
    }
  }
  return null;
}
