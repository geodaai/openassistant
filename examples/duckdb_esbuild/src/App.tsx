import { AiAssistant } from '@openassistant/ui';
import { localQuery } from '@openassistant/duckdb';
import { SAMPLE_DATASETS } from './dataset';

import '@openassistant/ui/dist/index.css';
import '@openassistant/duckdb/dist/index.css';

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (
      datasetName: keyof typeof SAMPLE_DATASETS,
      variableName: string
    ) => {
      return (SAMPLE_DATASETS[datasetName] as any[]).map(
        (item) => item[variableName]
      );
    },
  },
};

const instructions = `
You are a DuckDB expert. Help users query and analyze the venue data using SQL. Explain the steps you are taking to solve the user's problem.

Here is dataset available for you to use:

- dataset name: myVenues
- dataset schema:
  - location: string
  - latitude: float
  - longitude: float
  - revenue: float
  - population: int
`;
export function App() {
  return (
    <div className="w-[800px] h-[600px] m-4" style={{ height: '800px' }}>
      <AiAssistant
        name="DuckDB Assistant"
        apiKey={process.env.OPENAI_API_KEY || ''}
        version="v1"
        modelProvider="openai"
        model="gpt-4"
        welcomeMessage="Hello! I'm your DuckDB expert. I can help you query and analyze the venue data. Try asking questions like 'Show me the revenue per capita for each location' or 'Which city has the highest revenue?'"
        instructions={instructions}
        tools={{ localQuery: localQueryTool }}
        useMarkdown={true}
      />
    </div>
  );
}
