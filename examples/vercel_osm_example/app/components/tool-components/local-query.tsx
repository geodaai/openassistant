import { isQueryDuckDBOutputData, QueryDuckDBComponent } from 'packages/components/echarts/dist';
import { getDuckDB } from 'packages/tools/duckdb/dist';

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