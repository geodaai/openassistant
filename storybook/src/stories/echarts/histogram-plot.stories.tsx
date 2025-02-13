import type { Meta, StoryObj } from '@storybook/react';
import {
  HistogramComponent,
  HistogramCallbackMessage,
} from '@openassistant/echarts';
import { ResizableThemeWrapper } from './common';

const meta: Meta<typeof HistogramComponent> = {
  title: 'Charts/Histogram',
  component: HistogramComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    docs: {
      description: {
        component: `
A histogram component that visualizes data distribution in bins.
`,
      },
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof HistogramComponent>;

const output = {
  type: 'function',
  name: 'histogram',
  result: 'success',
  data: {
    variableName: 'Sample Histogram',
    histogramData: [
      { bin: 0, binStart: 0, binEnd: 10 },
      { bin: 1, binStart: 10, binEnd: 20 },
      { bin: 2, binStart: 20, binEnd: 30 },
    ],
    barDataIndexes: [
      [1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    datasetName: 'sample',
    onSelected: (datasetName: string, indexes: number[]) => {
      console.log('Selected:', datasetName, indexes);
    },
  },
};

export const Default: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="light">
      <HistogramCallbackMessage
        functionName="histogram"
        functionArgs={{}}
        output={{
          ...output,
          data: {
            ...output.data,
            theme: 'light',
          },
        }}
      />
    </ResizableThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the histogram component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="dark">
      <HistogramCallbackMessage
        functionName="histogram"
        functionArgs={{}}
        output={{
          ...output,
          data: {
            ...output.data,
            theme: 'dark',
          },
        }}
      />
    </ResizableThemeWrapper>
  ),
};
