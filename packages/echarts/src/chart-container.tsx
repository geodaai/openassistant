import { Children, useState } from "react";
import { ExpandableContainer } from "@openassistant/common";

export type DraggableDroppableContainerProps = {
  isExpanded: boolean;
  isDraggable: boolean;
  id: string;
  children: React.ReactNode;
};

/**
 * BoxplotComponentContainer for rendering box plot visualizations with expandable container.
 * With expandable container, the box plot can be:
 * - expanded to a modal dialog with box plots rendered in vertical direction and with detailed statistics table.
 * - dragged and dropped to other places.
 * - resized.
 * - have a tooltip with detailed statistics.
 *
 * @param props {@link BoxplotOutputData} Configuration and data for the box plot
 * @returns Box plot visualization with optional detailed statistics table
 */
export function DraggableDroppableContainer(props: DraggableDroppableContainerProps): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: props.id,
        type: 'boxplot',
        data: props,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 600 : props.variables.length * 100 + 120}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      {Children} 
    </ExpandableContainer>
  );
}
