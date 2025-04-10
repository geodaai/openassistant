import { ReactNode } from 'react';
import { CustomFunctionCall } from '@openassistant/core';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { ParallelCoordinateOutputData } from './component/pcp';
import { ParallelCoordinateComponent } from './component/pcp-component';
import { useDraggable } from '../hooks/useDraggable';

export function ParallelCoordinateCallbackMessage(
  props: CustomFunctionCall
): ReactNode | null {
  const outputData = props.output.data as
    | ParallelCoordinateOutputData
    | undefined;

  const onDragStart = useDraggable({
    id: outputData?.id || generateId(),
    type: 'boxplot',
    data: outputData,
  });

  if (!outputData?.pcp || !outputData.rawData) {
    return null;
  }

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={outputData.isDraggable || false}
      onDragStart={onDragStart}
    >
      <ParallelCoordinateComponent {...outputData} />
    </ExpandableContainer>
  );
}
