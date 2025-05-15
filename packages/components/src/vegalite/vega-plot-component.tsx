import { useState } from 'react';
import { VegaLitePlotAdditionalData } from '@openassistant/plots';
import { ExpandableContainer } from '../common/expandable-container';
import { useDraggable } from '../hooks/use-draggable';
import { generateId } from '@openassistant/utils';
import { VegaLite } from 'react-vega';

export type VegaLiteOutputData = VegaLitePlotAdditionalData & {
  id?: string;
  theme?: string;
  showMore?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  height?: number;
  width?: number;
};

export function isVegaLiteOutputData(
  data: unknown
): data is VegaLiteOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'vegaLiteSpec' in data &&
    'datasetName' in data &&
    'variableNames' in data
  );
}

export function VegaPlotComponent(props: VegaLiteOutputData) {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const id = props.id || generateId();

  const onDragStart = useDraggable({
    id,
    type: 'vega-lite',
    data: props,
  });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 600 : 400}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <VegaPlot {...props} />
    </ExpandableContainer>
  );
}

export function VegaPlot(props: VegaLiteOutputData) {
  const spec = props.vegaLiteSpec ? JSON.parse(props.vegaLiteSpec) : {};

  return (
    <div className="h-full w-full  text-gray-900 shadow-secondary-1 dark:text-gray-100">
      <VegaLite
        spec={{
          ...spec,
          width: 'container',
          height: 'container',
          autosize: {
            type: 'fit',
            contains: 'padding',
          },
        }}
        theme={
          (props.theme || 'ggplot2') as
            | 'dark'
            | 'excel'
            | 'fivethirtyeight'
            | 'ggplot2'
            | 'latimes'
            | 'quartz'
            | 'vox'
            | 'urbaninstitute'
            | 'googlecharts'
            | 'powerbi'
            | 'carbonwhite'
            | 'carbong10'
            | 'carbong90'
            | 'carbong100'
        }
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
