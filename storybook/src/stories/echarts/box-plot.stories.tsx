import type { Meta, StoryObj } from '@storybook/react';
import {
  BoxplotComponent,
  BoxplotCallbackMessage,
  createBoxplot,
} from '@openassistant/echarts';
import { SimpleThemeWrapper } from './common';

const meta: Meta<typeof BoxplotComponent> = {
  title: 'Charts/Boxplot',
  component: BoxplotComponent,
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
type Story = StoryObj<typeof BoxplotComponent>;

const data = {
  rate: [
    1, 2.3, 3.1, 4.2, 5.5, 6.1, 7.3, 8.4, 9.2, 10.1, 11.5, 12.2, 13.4, 14.7,
    15.1, 16.3, 17.8, 18.2, 19.5, 20,
  ],
};

const multipleData = {
  rate: [
    1, 2.3, 3.1, 4.2, 5.5, 6.1, 7.3, 8.4, 9.2, 10.1, 11.5, 12.2, 13.4, 14.7,
    15.1, 16.3, 17.8, 18.2, 19.5, 20,
  ],
  rate2: [
    2.1, 3.8, 4.2, 5.1, 5.8, 6.7, 7.2, 7.8, 8.9, 9.3, 8.7, 10.2, 11.5, 10.8,
    12.3, 13.1, 14.2, 13.8, 15.2, 14.9,
  ],
};

const boxplot = createBoxplot({
  data,
  boundIQR: 1.5,
});

const outputData = {
  id: 'boxplot',
  datasetName: 'sample',
  variables: ['rate'],
  boxplotData: boxplot,
  data,
  boundIQR: 1.5,
  theme: 'light',
  isDraggable: true,
};

const multipleBoxplot = createBoxplot({
  data: multipleData,
  boundIQR: 1.5,
});

const multipleOutputData = {
  id: 'boxplot',
  datasetName: 'sample',
  variables: ['rate', 'rate2'],
  boxplotData: multipleBoxplot,
  data: multipleData,
  boundIQR: 1.5,
  theme: 'light',
  isDraggable: true,
};

export const Default: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="light" width="400px" height="300px">
      <BoxplotCallbackMessage
        functionName="boxplot"
        functionArgs={{}}
        output={{
          type: 'boxplot',
          name: 'boxplot',
          result: 'success',
          data: outputData,
        }}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the boxplot component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="dark" width="400px" height="300px">
      <BoxplotCallbackMessage
        functionName="boxplot"
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
    </SimpleThemeWrapper>
  ),
};

export const MultipleBoxplots: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="light" width="400px" height="300px">
      <BoxplotCallbackMessage
        functionName="boxplot"
        functionArgs={{}}
        output={{
          type: 'boxplot',
          name: 'boxplot',
          result: 'success',
          data: multipleOutputData,
        }}
      />
    </SimpleThemeWrapper>
  ),
};
