export const codeTailwind = `import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
}
`;

export const codeGetStarted = `import { AiAssistant } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}`;

export const codeGetStartedDark = `import { AiAssistant } from '@openassistant/ui';
import { ThemeProvider } from 'next-themes';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark"> 
      <AiAssistant
        modelProvider="openai"
        model="gpt-4"
        apiKey="your-api-key"
        welcomeMessage="Hello! How can I help you today?"
        // enable dark mode for e.g. charts, maps, etc.
        theme="dark"
      />
    </ThemeProvider>
  );
}`;

export const codeConfig = `import { ConfigPanel, AiAssistantConfig } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function AiConfigPanel() {
  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    temperature: 0.8,
    topP: 1.0,
  });

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
    // check if the config is ready and start the chat
  };

  return (
    <ConfigPanel
      initialConfig={aiConfig}
      onConfigChange={onAiConfigChange}
    />
  );
}`;

export const codeScreenCapture = `import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <div className="h-[600px] w-[400px] m-4">
        <AiAssistant
          modelProvider="openai"
          model="gpt-4"
          apiKey="your-api-key"
          welcomeMessage="Hello! How can I help you today?"
          // enable screen capture
          enableScreenCapture={true}
          screenCapturedBase64={screenCaptured}
          onScreenshotClick={() => setStartScreenCapture(true)}
          onRemoveScreenshot={() => setScreenCaptured('')}
        />
      </div>
    </ScreenshotWrapper>
  );
}`;

export const codeVoiceToText = `import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <div className="h-[600px] w-[400px] m-4">
        <AiAssistant
          modelProvider="openai"
          model="gpt-4"
          apiKey="your-api-key"
          welcomeMessage="Hello! How can I help you today?"
          // enable voice to text
          enableVoice={true}
          // enable screen capture
          enableScreenCapture={true}
          screenCapturedBase64={screenCaptured}
          onScreenshotClick={() => setStartScreenCapture(true)}
          onRemoveScreenshot={() => setScreenCaptured('')}
        />
      </div>
    </ScreenshotWrapper>
  );
}`;

/**
 * This is a test data for the code block
 * rows: 10 rows
 * column names:
 * - latitude (float)
 * - longtitude (float)
 * - price (float)
 * - population (int)
 */
export const testData = `[
    {
      "name": "venue 1",
      "longitude": -73.99389648,
      "latitude": 40.75011063,
      "revenue": 1000000,
      "population": 1000000
    },
    {
      "name": "venue 2",
      "longitude": -73.97642517,
      "latitude": 40.73981094,
      "revenue": 2000000,
      "population": 2000000
    },
    {
      "name": "venue 3",
      "longitude": -73.96870422,
      "latitude": 40.75424576,
      "revenue": 3000000,
      "population": 3000000
    },
    {
      "name": "venue 4",
      "longitude": -73.95987634,
      "latitude": 40.76012845,
      "revenue": 4000000,
      "population": 4000000
    },
    {
      "name": "venue 5",
      "longitude": -73.96543210,
      "latitude": 40.75789321,
      "revenue": 5000000,
      "population": 5000000
    }
  ]`;

export const codeFunctionCalling = `import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';
import { CustomFunctionContext } from '@openassistant/core';
import { calculateEntropy } from './my-function';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

type EntropyFunctionContextValues = {
  getData: (variableName: string) => number[];
};

const testData = {
  "temperature": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
};

function App() {
  const entropyFunction = (context: CustomFunctionContext<EntropyFunctionContextValues>) => {
    return {
      name: 'entropy',
      description: 'Calculate the Shannon entropy of an array of numbers',
      properties: {
        variableName: { type: 'string', description: 'The name of the variable to calculate the entropy' },
      },
      required: ['variableName'],
      callbackFunction: (functionName, functionArgs, functionContext) => {
        try {
          const { variableName } = functionArgs;
          const data = functionContext.getData(variableName);
          const entropy = calculateEntropy(data);
          return {
            type: 'success',
            name: functionName,
            result: {
              success: true,
              details: \`The entropy of the variable \${variableName} is \${entropy}\`,
            },
          };
        } catch (error) {
          return {
            type: 'error',
            name: functionName,
            result: {
              success: false,
              details: \`Failed to calculate entropy: \${error.message}\`,
            },
          };
        }
      },
      callbackFunctionContext: context
    };
  };

  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
      functions={[entropyFunction({getData: (variableName: string) => {
        // get the data from the dataset
        return testData.map((item) => item[variableName]);
      }})]}
    />
  );
}`;

export const codeMyFunction = `
/**
 * Calculates the Shannon entropy of an array of numbers
 * @param numbers Array of numerical values
 * @returns The entropy value
 */
export function calculateEntropy(numbers: number[]): number {
    // Return 0 if array is empty
    if (numbers.length === 0) return 0;

    // Calculate frequency of each number
    const frequencies = new Map<number, number>();
    for (const num of numbers) {
        frequencies.set(num, (frequencies.get(num) || 0) + 1);
    }

    // Calculate probabilities and entropy
    const totalCount = numbers.length;
    let entropy = 0;

    for (const count of frequencies.values()) {
        const probability = count / totalCount;
        // Using log base 2 for information theory convention
        entropy -= probability * Math.log2(probability);
    }

    return entropy;
}
`;

export const codeMap = `import { AiAssistant } from '@openassistant/ui';
import { createMapFunctionDefinition } from '@openassistant/keplergl';
import { testData } from './my-datasets';

export function App() {
  const myFunctions = [
    createMapFunctionDefinition({
      getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => {
        return testData[datasetName];
      },
    })
  ];

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: 'your-api-key',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: \`You are a data analyst. You can help users to create a mapfrom a dataset.
      You can use the the following datasets:
      - Dataset name: myVenues
      - Fields: location, latitude, longitude, revenue, population
      \`,
    functions: myFunctions,
  };

  return (
    <AiAssistant {...assistantProps} />
  );
}
`;

export const codeHistogram = `import { AiAssistant } from '@openassistant/ui';
import { histogramFunctionDefinition } from '@openassistant/echarts';
import { testData } from './my-datasets';

export function App() {
  const myFunctions = [
    histogramFunctionDefinition({
      getValues: (datasetName: string, variableName: string) => {
        return testData[datasetName].map((item) => item[variableName]);
      },
    })
  ];

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: 'your-api-key',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: \`You are a data analyst. You can help users to create a histogram from a dataset.
      You can use the the following datasets:
      - Dataset name: myVenues
      - Fields: location, latitude, longitude, revenue, population
      \`,
    functions: myFunctions,
  };

  return (
    <AiAssistant {...assistantProps} />
  );
}
`;

export const codeSQL = `import { AiAssistant } from '@openassistant/ui';
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';
import { testData } from './my-datasets';

export function App() {
  const myFunctions = [
    queryDuckDBFunctionDefinition({
      getValues: (datasetName: string, variableName: string) => {
        return testData[datasetName].map((item) => item[variableName]);
      },
    })
  ];

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: 'your-api-key',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: \`You are a data analyst. You can help users to query data from a dataset.
    For SQL query, please help to generate select query clause using the content of the dataset:
    - please use double quotes for table name
    - please only use the columns that are in the dataset context
    - please try to use the aggregate functions if possible
    You can use the the following datasets:
    - Dataset name: myVenues
    - Fields: location, latitude, longitude, revenue, population
      \`,
    functions: myFunctions,
  };

  return (
    <AiAssistant {...assistantProps} />
  );
}
`;

export const codeSampleDataset = `export const SAMPLE_DATASETS = {
  myVenues: [
    {
      location: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      revenue: 12500000,
      population: 8400000,
    },
    {
      location: 'Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      revenue: 9800000,
      population: 3900000,
    },
    {
      location: 'Chicago',
      latitude: 41.8781,
      longitude: -87.6298,
      revenue: 7200000,
      population: 2700000,
    },
    {
      location: 'Houston',
      latitude: 29.7604,
      longitude: -95.3698,
      revenue: 6800000,
      population: 2300000,
    },
    {
      location: 'Phoenix',
      latitude: 33.4484,
      longitude: -112.074,
      revenue: 5400000,
      population: 1600000,
    },
    {
      location: 'Philadelphia',
      latitude: 39.9526,
      longitude: -75.1652,
      revenue: 5900000,
      population: 1580000,
    },
    {
      location: 'San Antonio',
      latitude: 29.4241,
      longitude: -98.4936,
      revenue: 4800000,
      population: 1540000,
    },
    {
      location: 'San Diego',
      latitude: 32.7157,
      longitude: -117.1611,
      revenue: 5200000,
      population: 1420000,
    },
  ],
};
`;
