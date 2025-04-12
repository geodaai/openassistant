import { CustomFunctionCall } from '@openassistant/core';
import { ScatterplotComponent } from './component/scatter-plot-component';
import { ScatterplotOutputData } from './callback-function';
import { ExpandableContainer, generateId } from '@openassistant/common';
import { useDraggable } from '../hooks/useDraggable';

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
 * @internal
 * @deprecated Use {@link ScatterplotComponentContainer} instead
 */
export function ScatterplotCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  const data = props.output.data as ScatterplotOutputData | undefined;
  const id = data?.id || generateId();

  const onDragStart = useDraggable({
    id,
    type: 'scatterplot',
    data: data,
  });

  if (!data || !isScatterplotOutputData(data)) {
    return null;
  }

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
