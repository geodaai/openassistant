import type { Meta, StoryObj } from '@storybook/react';
import {
  MoranScatterComponent,
  MoranScatterCallbackComponent,
} from '@openassistant/geoda';
import { ResizableThemeWrapper } from '../echarts/common';

const meta: Meta<typeof MoranScatterComponent> = {
  title: 'Geoda/MoranScatter',
  component: MoranScatterComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A Moran scatterplot component that visualizes the relationship between a variable and its spatial lag.
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof MoranScatterComponent>;

const values = [3.0, 3.0, 0.0, 9.0, 8.0, 8.5];
const weights = [[1], [0], [], [4, 5], [3, 5], [3, 4]];
const weightsMeta = {
  id: 'sample_weights',
};
const lagValues = values.map((value, index) => {
  const neighborIndexes = weights[index];
  const neighborValues = neighborIndexes.map((neighborIndex) => values[neighborIndex]);
  return neighborValues.reduce((sum, neighborValue) => sum + neighborValue, 0) / neighborIndexes.length;
});

const output = {
  type: 'function',
  name: 'moranScatter',
  result: 'success',
  data: {
    variableName: 'Sample Moran Scatterplot',
    datasetName: 'sample',
    values,
    lagValues,
    weights,
    weightsMeta,
    regression: {
      slope: 0.5,
      intercept: 0,
      r2: 0.5,
    },
  },
};

export const Default: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="light">
      <MoranScatterCallbackComponent
        functionName="moranScatter"
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
          'This is a basic example of the Moran scatterplot component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ResizableThemeWrapper forcedTheme="dark">
      <MoranScatterCallbackComponent
        functionName="moranScatter"
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
