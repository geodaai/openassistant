import { boxplot } from '@openassistant/echarts';
import { AiAssistant } from '@openassistant/ui';

// Sample dataset
const SAMPLE_DATASET = {
  myVenues: [
    { revenue: 1000, population: 100, location: 'A' },
    { revenue: 2000, population: 200, location: 'B' },
    { revenue: 3000, population: 300, location: 'C' },
    { revenue: 4000, population: 400, location: 'D' },
    { revenue: 5000, population: 500, location: 'E' },
  ],
};

// Create the boxplot tool with the getValues implementation
const boxplotTool = {
  ...boxplot,
  context: {
    ...boxplot.context,
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASET[datasetName].map((item) => item[variableName]);
    },
  },
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ECharts Tools Example</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AiAssistant
            name="ECharts Assistant"
            modelProvider="openai"
            model="gpt-4"
            apiKey={process.env.OPENAI_API_KEY || ''}
            version="1.0.0"
            instructions="You are a helpful assistant that can create boxplots using ECharts."
            functions={{ boxplot: boxplotTool }}
            welcomeMessage="Welcome to the ECharts Tools Example! You can ask me to create boxplots of the sample dataset."
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}
