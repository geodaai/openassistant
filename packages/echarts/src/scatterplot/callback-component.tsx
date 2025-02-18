import { CustomFunctionCall } from '@openassistant/core';
import { ScatterplotComponent } from './component/scatter-plot-component';
import { ScatterplotOutputData } from './callback-function';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { DragEvent } from 'react';

// type guard
function isScatterplotOutputData(data: unknown): data is ScatterplotOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'xData' in data &&
    'yData' in data &&
    'xVariableName' in data &&
    'yVariableName' in data &&
    'datasetName' in data
  );
}

/**
 * ScatterplotCallbackComponent is a component that displays a scatterplot.
 * It is used to display the output of the scatterplot callback function.
 * @param props - The props for the component. See {@link CustomFunctionCall} for more information.
 * @returns The scatterplot component.
 */
export function ScatterplotCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  const id = generateId();
  const data = props.output.data as ScatterplotOutputData | undefined;

  if (!data || !isScatterplotOutputData(data)) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `scatterplot-${id}`,
        type: 'scatterplot',
        data: data,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={data.isDraggable || false}
      onDragStart={onDragStart}
    >
      <ScatterplotComponent {...data} id={id} />
    </ExpandableContainer>
  );
}
