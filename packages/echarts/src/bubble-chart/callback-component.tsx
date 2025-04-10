import { CustomFunctionCall } from '@openassistant/core';

import { BubbleChartOutputResult } from './callback-function';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { BubbleChartOutputData } from './component/bubble-chart';
import { BubbleChartComponent } from './component/bubble-chart-component';
import { useDraggable } from '../hooks/useDraggable';

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
  const onDragStart = useDraggable({
    id: `bubble-${id}`,
    type: 'bubble',
    data: props.output.data,
  });

  const data = props.output.data as BubbleChartOutputData | undefined;
  if (!isBubbleChartOutputData(data)) {
    return null;
  }

  return (
    
    <ExpandableContainer
      defaultWidth={undefined}
      defaultHeight={380}
      draggable={data.isDraggable || false}
      onDragStart={onDragStart}
    >
      <BubbleChartComponent {...data} id={id} />
    </ExpandableContainer>
  );
}
