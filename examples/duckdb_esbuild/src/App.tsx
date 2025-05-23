import { AiAssistant } from '@openassistant/ui';
import { localQuery, LocalQueryTool, getDuckDB } from '@openassistant/duckdb';
import {
  QueryDuckDBComponent,
  QueryDuckDBOutputData,
} from '@openassistant/tables';
import { SAMPLE_DATASETS } from './dataset';

import '@openassistant/ui/dist/index.css';
import '@openassistant/tables/dist/index.css';

import './styles.css';

function getValues(datasetName: string, variableName: string) {
  return Promise.resolve(
    SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS].map(
      (item) => item[variableName as keyof typeof item]
    )
  );
}

function QueryToolComponent(props: QueryDuckDBOutputData) {
  return (
    <QueryDuckDBComponent
      {...props}
      getDuckDB={getDuckDB}
      getValues={getValues}
    />
  );
}

const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues,
  },
  component: QueryToolComponent,
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
    <div className="app-container">
      <div className="content-container">
        <h1 className="title">DuckDB Tools Example</h1>
        <div className="chat-container">
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
      </div>
    </div>
  );
}
