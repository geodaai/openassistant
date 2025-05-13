import {
  isQueryDuckDBOutputData,
  QueryDuckDBComponent,
  isHistogramOutputData,
  HistogramComponent,
} from '@openassistant/components';
import { getDuckDB } from '@openassistant/duckdb';
import { useRef, useEffect, useMemo } from 'react';

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
    }
  }
  return null;
}

interface LocalQueryToolProps {
  toolCallId: string;
  additionalData: unknown;
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
}

export function LocalQueryTool({
  toolCallId,
  additionalData,
  getValues,
}: LocalQueryToolProps) {
  if (isQueryDuckDBOutputData(additionalData)) {
    return (
      <QueryDuckDBComponent
        key={toolCallId}
        {...additionalData}
        getDuckDB={getDuckDB}
        getValues={getValues}
      />
    );
  }
  return null;
}

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return useMemo(
      () => <HistogramComponent {...additionalData} />,
      [additionalData]
    );
  }
  return null;
}
