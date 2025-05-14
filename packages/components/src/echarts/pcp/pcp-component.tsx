import { useState } from 'react';
import { generateId } from '@openassistant/utils';

import { ExpandableContainer } from '../../common/expandable-container';
import { useDraggable } from '../../hooks/use-draggable';

import { ParallelCoordinateOutputData, ParallelCoordinatePlot } from './pcp';

/**
 * Props for the ParallelCoordinateComponent, extending ParallelCoordinateOutputData
 * which contains the data and configuration for the parallel coordinate plot
 *
 * This component is used with the callback-component which is part of the LLM function
 * tool to visualize the parallel coordinate plot and its statistics. See definition of
 * callback-component in the LLM function tool documentation for more details.
 *
 */
export function ParallelCoordinateComponent(
  props: ParallelCoordinateOutputData
): JSX.Element | null {
  return (
    <div className="relative h-full w-full flex flex-col rounded-lg gap-2 pt-6 text-gray-900 shadow-secondary-1  dark:text-gray-100">
      <div className="relative h-full py-2 flex-grow ">
        <div className="absolute left-0 top-0 h-full w-full">
          <ParallelCoordinatePlot {...props} />
        </div>
      </div>
    </div>
  );
}

export function ParallelCoordinateComponentContainer(
  props: ParallelCoordinateOutputData
): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = useDraggable({
    id: props.id || generateId(),
    type: 'pcp',
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
      <ParallelCoordinatePlot {...props} />
    </ExpandableContainer>
  );
}
