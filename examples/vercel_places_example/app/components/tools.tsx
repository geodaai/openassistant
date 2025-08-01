// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import dynamic from 'next/dynamic';

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
}: ToolInvocationProps) {
  if (state === 'result' && additionalData) {
    switch (toolName) {
      case 'keplergl':
        return (
          <KeplerGlTool
            key={toolCallId}
            toolCallId={toolCallId}
            additionalData={additionalData}
          />
        );
      case 'geotagging':
      case 'placeSearch':
      case 'geocoding':
      case 'routing':
      case 'isochrone':
      case 'buffer':
      case 'downloadMapData':
        // For these tools, we'll just display the result as JSON for now
        return (
          <div key={toolCallId} className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2 capitalize">{toolName} Result:</h3>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(additionalData, null, 2)}
            </pre>
          </div>
        );
    }
  }
  return null;
} 