import { useState } from 'react';
import { ExpandableContainer } from '@openassistant/common';
import { useDraggable } from './hooks/useDraggable';

export type DraggableDroppableContainerProps = {
  initialIsExpanded: boolean;
  isDraggable: boolean;
  id: string;
  type: string;
  data: unknown;
  variables: unknown[];
  children: React.ReactNode;
};

/**
 * DraggableDroppableContainer for rendering chart visualizations within an expandable and draggable container.
 * @param props {@link DraggableDroppableContainerProps} Configuration and data for the container
 * @returns A container component for charts
 */
export function DraggableDroppableContainer({
  initialIsExpanded,
  isDraggable,
  id,
  type,
  data,
  variables,
  children,
}: DraggableDroppableContainerProps): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

  const onDragStart = useDraggable({ id, type, data });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  const calculatedHeight =
    Array.isArray(variables) && variables.length > 0
      ? variables.length * 100 + 120
      : 600;

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 600 : calculatedHeight}
      draggable={isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <>{children}</>
    </ExpandableContainer>
  );
}
