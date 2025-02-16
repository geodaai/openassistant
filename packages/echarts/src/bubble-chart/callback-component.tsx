import { DragEvent } from 'react';
import { CustomFunctionCall } from '@openassistant/core';

import { BubbleChartOutputResult } from './callback-function';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { BubbleChartOutputData } from './component/bubble-chart';
import { BubbleChartComponent } from './component/bubble-chart-component';

function isBubbleChartOutputData(
  outputData: unknown
): outputData is BubbleChartOutputResult {
  return (
    typeof outputData === 'object' &&
    outputData !== null &&
    'datasetName' in outputData &&
    outputData['data'] &&
    'variableX' in outputData['data'] &&
    'variableY' in outputData['data'] &&
    'variableSize' in outputData['data']
  );
}

export function BubbleChartCallbackMessage(
  props: CustomFunctionCall
): JSX.Element | null {
  const id = generateId();
  const data = props.output.data as BubbleChartOutputData | undefined;

  if (!isBubbleChartOutputData(data)) {
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
      <BubbleChartComponent {...data} id={id} />
    </ExpandableContainer>
  );
}
