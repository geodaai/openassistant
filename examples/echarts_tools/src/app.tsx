import React, { useEffect, useState } from 'react';
import {
  boxplot,
  BoxplotComponentContainer,
  BoxplotOutputData,
  BoxplotTool,
} from '@openassistant/echarts';
import { AiAssistant } from '@openassistant/ui';
import { SAMPLE_DATASETS } from './dataset';

const getValues = async (datasetName: string, variableName: string) => {
  return (SAMPLE_DATASETS[datasetName] as any[]).map(
    (item) => item[variableName]
  );
};

// Extends from BoxplotComponentContainer with custom props
const BoxplotComponentContainerWithCustomProps = (props: BoxplotOutputData) => {
  const [rawData, setRawData] = useState<Record<string, number[]>>({});

  useEffect(() => {
    // get raw data from the props.datasetName and props.variables
    const fetchData = async () => {
      const promises = props.variables.map(async (variable) => {
        const values = await getValues(props.datasetName, variable);
        return { [variable]: values };
      });
      const resolvedDataArray = await Promise.all(promises);
      const formattedData = resolvedDataArray.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setRawData(formattedData);
    };

    fetchData();
  }, [props.datasetName, props.variables]);

  return <BoxplotComponentContainer {...props} data={rawData} />;
};

// Create the boxplot tool with the getValues implementation
const boxplotTool: BoxplotTool = {
  ...boxplot,
  context: {
    ...boxplot.context,
    getValues: getValues,
  },
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ECharts Tools Example</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 h-[800px]">
          <AiAssistant
            name="ECharts Assistant"
            modelProvider="openai"
            model="gpt-4"
            apiKey={process.env.OPENAI_API_KEY || ''}
            version="1.0.0"
            instructions="You are a helpful assistant that can create boxplots using ECharts."
            functions={{ boxplot: boxplotTool }}
            welcomeMessage="Welcome to the ECharts Tools Example! You can ask me to create boxplots of the sample dataset. Try to use the boxplot tool to create the boxplot. For example, check the distribution of population of myVenues using box plot"
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}
