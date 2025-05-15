import type { Meta, StoryObj } from '@storybook/react';
import {
  ParallelCoordinateComponent,
  ParallelCoordinateCallbackMessage,
  createParallelCoordinateOption,
  processParallelCoordinateData,
} from '@openassistant/plots';
import { ResizableThemeWrapper } from './common';

const meta: Meta<typeof ParallelCoordinateComponent> = {
  title: 'Charts/Parallel Coordinate',
  component: ParallelCoordinateComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    docs: {
      description: {
        component: `
A boxplot component that visualizes data distribution in bins.
`,
      },
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof ParallelCoordinateComponent>;

const data = {
  rate1: [
    1, 2.3, 3.1, 4.2, 5.5, 6.1, 7.3, 8.4, 9.2, 10.1, 11.5, 12.2, 13.4, 14.7,
    15.1, 16.3, 17.8, 18.2, 19.5, 20,
  ],
  rate2: [
    2.1, 3.8, 4.2, 5.1, 5.8, 6.7, 7.2, 7.8, 8.9, 9.3, 8.7, 10.2, 11.5, 10.8,
    12.3, 13.1, 14.2, 13.8, 15.2, 14.9,
  ],
};

const pcp = processParallelCoordinateData(data);

const outputData = {
  id: 'boxplot',
  datasetName: 'sample',
  variables: ['rate1', 'rate2'],
  pcp,
  rawData: data,
  theme: 'light',
  isDraggable: true,
};

export const Default: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="light">
      <ParallelCoordinateCallbackMessage
        functionName="parallelCoordinate"
        functionArgs={{}}
        output={{
          type: 'boxplot',
          name: 'boxplot',
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
          'This is a basic example of the parallel coordinate component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="dark">
      <ParallelCoordinateCallbackMessage
        functionName="parallelCoordinate"
        functionArgs={{}}
        output={{
          type: 'boxplot',
          name: 'boxplot',
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

export const Light: Story = Default;
