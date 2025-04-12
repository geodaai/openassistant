import React, { useEffect, useState } from 'react';
import {
  boxplot,
  BoxplotComponentContainer,
  BoxplotOutputData,
  BoxplotTool,
  bubbleChart,
  BubbleChartTool,
  histogram,
  HistogramTool,
  pcp,
  PCPTool,
  scatterplot,
  ScatterplotTool,
} from '@openassistant/echarts';
import { AiAssistant } from '@openassistant/ui';
import { tool } from '@openassistant/core';
import { z } from 'zod';
import { SAMPLE_DATASETS } from './dataset';

export default function App() {
  const getValues = async (datasetName: string, variableName: string) => {
    return (SAMPLE_DATASETS[datasetName] as any[]).map(
      (item) => item[variableName]
    );
  };

  // Extends from BoxplotComponentContainer with custom props
  const BoxplotComponentContainerWithCustomProps = (
    props: BoxplotOutputData
  ) => {
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

  const theme = 'light';

  // Create the boxplot tool with the getValues implementation
  const boxplotTool: BoxplotTool = {
    ...boxplot,
    context: {
      ...boxplot.context,
      getValues: getValues,
      config: {
        ...boxplot.context?.config,
        theme,
      },
    },
  };

  // Create the bubble chart tool with the getValues implementation
  const bubbleChartTool: BubbleChartTool = {
    ...bubbleChart,
    context: {
      ...bubbleChart.context,
      getValues: getValues,
      config: {
        ...bubbleChart.context?.config,
        theme,
      },
    },
  };

  const histogramTool: HistogramTool = {
    ...histogram,
    context: {
      ...histogram.context,
      getValues: getValues,
      config: {
        ...histogram.context?.config,
        theme,
      },
    },
  };

  const pcpTool: PCPTool = {
    ...pcp,
    context: {
      ...pcp.context,
      getValues: getValues,
    },
  };

  const scatterplotTool: ScatterplotTool = {
    ...scatterplot,
    context: {
      ...scatterplot.context,
      getValues: getValues,
    },
  };

  const thinkTool = tool({
    description: 'Think about the question and provide a plan',
    parameters: z.object({
      question: z.string().describe('The question to think about'),
    }),
    execute: async ({ question }) => {
      return {
        llmResult: {
          success: true,
          result: {
            question,
            instruction:
              'Please think about the question and provide a plan. Then, execute the plan for using the tools. Before executing the plan, please summarize the plan for using the tools.',
          },
        },
      };
    },
  });

  const welcomeMessage = `
Welcome to the ECharts Tools Example! You can ask me to create boxplots of the sample dataset. Try to use the boxplot tool to create the boxplot. For example,

1. check the distribution of population of myVenues using box plot
2. create a bubble chart using latitude and longitude of myVenues, use revenue as the bubble size
3. summarize the dataset myVenues
4. create a histogram of the population of myVenues
5. create a parallel coordinate plot of the population and revenue of myVenues
6. create a scatterplot of the population and revenue of myVenues
`;

  const instructions = `
You are a helpful assistant that can create boxplots using ECharts.

Please note:

- Please ALWAYS use the think tool to think about the question and provide a plan before calling any tools to solve the question.
- Before using any tools, please make a summary of the plan in a markdown format.
- When executing the plan, please try to fix the error if there is any.
- After executing the plan, please summarize the result and provide the result in a markdown format.

Please use the following datasets:

datasetName: myVenues
variables:
- location
- latitude
- longitude
- revenue
- population
`;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ECharts Tools Example</h1>
        <div className="rounded-lg shadow-lg p-6 h-[800px]">
          <AiAssistant
            name="ECharts Assistant"
            modelProvider="openai"
            model="gpt-4"
            apiKey={process.env.OPENAI_API_KEY || ''}
            version="1.0.0"
            instructions={instructions}
            functions={{
              boxplot: boxplotTool,
              think: thinkTool,
              bubbleChart: bubbleChartTool,
              histogram: histogramTool,
              pcp: pcpTool,
              scatterplot: scatterplotTool,
            }}
            welcomeMessage={welcomeMessage}
            theme={theme}
            useMarkdown={true}
            // botMessageClassName="bg-content2"
          />
        </div>
      </div>
    </div>
  );
}
