import {
  VegaPlotComponent,
  isVegaLiteOutputData,
} from '@openassistant/components';

interface ToolInvocationProps {
  toolCallId: string;
  state: string;
  toolName: string;
  additionalData: unknown;
  getValues?: () => Promise<number[]>;
}

export function ToolInvocation({
  toolCallId,
  state,
  toolName,
  additionalData,
}: ToolInvocationProps) {
  if (state === 'result' && additionalData) {
    switch (toolName) {
      case 'vegaLitePlot':
        return (
          <VegaPlotTool key={toolCallId} additionalData={additionalData} />
        );
    }
  }
  return null;
}

function VegaPlotTool({ additionalData }: { additionalData: unknown }) {
  if (isVegaLiteOutputData(additionalData)) {
    return <VegaPlotComponent {...additionalData} />;
  }
  return null;
}
