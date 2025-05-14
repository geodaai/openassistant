import { ExpandableContainer, useDraggable } from '@openassistant/common';
import { generateId } from '@openassistant/utils';

import { useState } from 'react';
import { HistogramOutputData, HistogramPlot } from './histogram-plot';

// type guard for histogram output data
export function isHistogramOutputData(
  data: unknown
): data is HistogramOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'variableName' in data &&
    'histogramData' in data &&
    'barDataIndexes' in data
  );
}

export function HistogramComponent(
  props: HistogramOutputData
): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = useDraggable({
    id: props.id || generateId(),
    type: 'histogram',
    data: props,
  });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 600 : 380}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <HistogramComponent {...props} />
    </ExpandableContainer>
  );
}
