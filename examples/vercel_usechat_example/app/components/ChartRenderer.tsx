'use client';

import { histogram, getVercelAiTool } from '@openassistant/echarts';

// Create a context object for the tools
const context = {
  getValues: async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  },
};

const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
  console.log('toolCallId', toolCallId);
  console.log('additionalData', additionalData);
};


// Get the echarts tools
export const histogramTool = histogram;
