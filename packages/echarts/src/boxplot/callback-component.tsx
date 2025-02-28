import { ReactNode, DragEvent } from 'react';
import { CustomFunctionCall } from '@openassistant/core';
import { ExpandableContainer } from '@openassistant/common';
import { BoxplotComponent } from './component/box-plot-component';
import { BoxplotOutputData } from './component/box-plot';

export function BoxplotCallbackMessage(
  props: CustomFunctionCall
): ReactNode | null {
  const outputData = props.output.data as BoxplotOutputData | undefined;

  if (!outputData?.boundIQR || !outputData.boxplotData || !outputData.data) {
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
      draggable={outputData.isDraggable || false}
      onDragStart={onDragStart}
    >
      <BoxplotComponent {...outputData} />
    </ExpandableContainer>
  );
}
