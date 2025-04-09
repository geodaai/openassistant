import { ExpandableContainer, generateId } from '@openassistant/common';

import { useState } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { HistogramOutputData, HistogramComponent } from './histogram-plot';

export function HistogramComponentContainer(
  props: HistogramOutputData
): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = useDraggable({
    id: props.id || generateId(),
    type: 'bubble',
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
