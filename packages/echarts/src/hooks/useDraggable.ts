import { DragEvent } from 'react';

export type DraggableData = {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export function useDraggable({
  id,
  type,
  data,
}: DraggableData): (e: DragEvent<HTMLElement>) => void {
  const onDragStart = (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: id,
        type: type,
        data: data,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  return onDragStart;
} 