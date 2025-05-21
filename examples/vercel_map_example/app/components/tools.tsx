'use client';

import dynamic from 'next/dynamic';

import { LocalQueryTool } from './tool-components/local-query';

const HistogramTool = dynamic(() => import('./tool-components/histogram'), {
  ssr: false,
});

const WeightsTool = dynamic(() => import('./tool-components/weights-info'), {
  ssr: false,
});

const KeplerGlTool = dynamic(() => import('./tool-components/keplergl'), {
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
  ssr: false,
});

interface ToolInvocationProps {
  toolCallId: string;
  state: string;
  toolName: string;
  additionalData: unknown;
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
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
