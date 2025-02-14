import { ReactNode, DragEvent } from 'react';
import { CustomFunctionCall } from '@openassistant/core';
import { ExpandableContainer } from '@openassistant/common';
import { ParallelCoordinateOutputData } from './component/pcp';
import { ParallelCoordinateComponent } from './component/pcp-component';

export function ParallelCoordinateCallbackMessage(
  props: CustomFunctionCall
): ReactNode | null {
  const outputData = props.output.data as
    | ParallelCoordinateOutputData
    | undefined;

  if (!outputData?.pcp || !outputData.rawData) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: outputData.id,
        type: 'boxplot',
        data: outputData,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

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
