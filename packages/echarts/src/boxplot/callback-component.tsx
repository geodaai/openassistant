import { ReactNode, useState } from 'react';
import { CustomFunctionCall } from '@openassistant/core';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { BoxplotComponent } from './component/box-plot-component';
import { BoxplotOutputData } from './component/box-plot';
import { useDraggable } from '../hooks/useDraggable';

export function BoxplotCallbackMessage(
  props: CustomFunctionCall
): ReactNode | null {
  const outputData = props.output.data as BoxplotOutputData | undefined;
  const [isExpanded, setIsExpanded] = useState(outputData?.isExpanded || false);

  const onDragStart = useDraggable({
    id: outputData?.id || generateId(),
    type: 'boxplot',
    data: outputData,
  });

  if (!outputData?.boundIQR || !outputData.boxplotData || !outputData.data) {
    return null;
  }

  const variables = outputData.variables;

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 300 : undefined}
      defaultHeight={isExpanded ? 600 : variables.length * 120 + 150}
      draggable={outputData.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <BoxplotComponent {...outputData} />
    </ExpandableContainer>
  );
}
