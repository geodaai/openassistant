import type { Meta, StoryObj } from '@storybook/react';
import {
  BubbleChartComponent,
  BubbleChartCallbackMessage,
} from '@openassistant/echarts';
import { ResizableThemeWrapper } from './common';

const meta: Meta<typeof BubbleChartComponent> = {
  title: 'Charts/Bubble Chart',
  component: BubbleChartComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A bubble chart component that visualizes relationships between multiple variables using x-position, y-position, size, and optionally color.
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof BubbleChartComponent>;

// Sample data for the bubble chart
const data = {
  variableX: {
    name: 'GDP per Capita',
    values: [5000, 15000, 25000, 35000, 45000, 55000, 65000],
  },
  variableY: {
    name: 'Life Expectancy',
    values: [65, 70, 75, 78, 80, 82, 85],
  },
  variableSize: {
    name: 'Population',
    values: [5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000],
  },
  variableColor: {
    name: 'Region',
    values: ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Asia', 'Europe'],
  },
};

const outputData = {
  id: 'bubble-chart',
  datasetName: 'sample',
  data,
  theme: 'light',
  isDraggable: true,
};

export const Default: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="light">
      <BubbleChartCallbackMessage
        functionName="bubbleChart"
        functionArgs={{}}
        output={{
          type: 'bubbleChart',
          name: 'bubbleChart',
          result: 'success',
          data: outputData,
        }}
      />
    </ResizableThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the bubble chart component with sample data showing the relationship between GDP, life expectancy, population, and regions.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="dark">
      <BubbleChartCallbackMessage
        functionName="bubbleChart"
        functionArgs={{}}
        output={{
          type: 'bubbleChart',
          name: 'bubbleChart',
          result: 'success',
          data: {
            ...outputData,
            theme: 'dark',
          },
        }}
      />
    </ResizableThemeWrapper>
  ),
};
