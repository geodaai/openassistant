import {
  isQueryDuckDBOutputData,
  QueryDuckDBComponent,
} from '@openassistant/tables';
import { getDuckDB } from '@openassistant/duckdb';

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
