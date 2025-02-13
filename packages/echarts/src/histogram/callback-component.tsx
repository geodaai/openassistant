import { DragEvent } from 'react';
import { CustomFunctionCall } from '@openassistant/core';

import { HistogramOutputData } from './component/histogram-plot';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { HistogramComponent } from './component/histogram-plot';

export function HistogramCallbackMessage(
  props: CustomFunctionCall
): JSX.Element | null {
  const id = generateId();
  const data = props.output.data as HistogramOutputData | undefined;

  if (!data?.variableName || !data?.histogramData || !data?.barDataIndexes) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `histogram-${id}`,
        type: 'histogram',
        data: data,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={data.isDraggable || false}
      onDragStart={onDragStart}
    >
      <HistogramComponent {...data} />
    </ExpandableContainer>
  );
}
