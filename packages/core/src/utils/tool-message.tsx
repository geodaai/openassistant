import { DragEvent } from 'react';
import { CustomFunctionOutputProps } from '../types';
import { ExpandableContainer, generateId } from '@openassistant/common';

export function isOutputData(outputData: unknown): outputData is {
  id: string;
  type: string;
  data: {
    id: string;
    isDraggable: boolean;
    isExpanded: boolean;
  };
} {
  return Boolean(
    outputData &&
      typeof outputData === 'object' &&
      'data' in outputData &&
      typeof outputData.data === 'object' &&
      outputData.data !== null
  );
}

export function getCustomMessage({
  functionName,
  functionArgs,
  output,
  CustomMessage,
}: {
  functionName: string;
  functionArgs: Record<string, unknown>;
  output: CustomFunctionOutputProps<unknown, unknown>;
  CustomMessage: React.ElementType;
}) {
  if (!isOutputData(output)) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: output.data.id,
        type: 'boxplot',
        data: output.data,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  const id = output.data.id || generateId();
  const isDraggable = output.data.isDraggable || false;

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={isDraggable}
      onDragStart={onDragStart}
    >
      <CustomMessage key={id} {...output.data} />
    </ExpandableContainer>
  );
}
