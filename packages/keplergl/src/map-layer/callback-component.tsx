'use client';

import { CustomFunctionCall } from '@openassistant/core';
import { KeplerGlComponentWithProvider } from './component/keplergl-component';
import { FileCacheItem } from '@kepler.gl/processors';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { DragEvent } from 'react';

export type CreateMapOutputData = {
  datasetName: string;
  datasetForKepler: FileCacheItem[];
  theme?: string;
  isDraggable?: boolean;
};

// type guard
function isCreateMapOutputData(data: unknown): data is CreateMapOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'datasetForKepler' in data
  );
}

/**
 * CreateMapCallbackComponent is a component that displays a map.
 * It is used to display the output of the create map callback function.
 * @param props - The props for the component. See {@link CustomFunctionCall} for more information.
 * @returns The map component.
 */
export function CreateMapCallbackComponent(props: CustomFunctionCall) {
  const id = generateId();
  const data = props.output.data as CreateMapOutputData | undefined;

  if (!data || !isCreateMapOutputData(data)) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `map-${id}`,
        type: 'map',
        data: data,
      })
    );
  };

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={data.isDraggable || false}
      onDragStart={onDragStart}
    >
      <KeplerGlComponentWithProvider {...data} />
    </ExpandableContainer>
  );
}
