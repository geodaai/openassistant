import { CustomFunctionCall } from '@openassistant/core';

import { HistogramOutputData } from './component/histogram-plot';
import {
  ExpandableContainer,
  generateId,
  useDraggable,
} from '@openassistant/common';
import { HistogramComponent } from './component/histogram-plot';

/**
 * @internal
 * @deprecated Use {@link HistogramComponentContainer} instead
 */
export function HistogramCallbackMessage(
  props: CustomFunctionCall
): JSX.Element | null {
  const id = generateId();

  const onDragStart = useDraggable({
    id: `bubble-${id}`,
    type: 'bubble',
    data: props.output.data,
  });

  const data = props.output.data as HistogramOutputData | undefined;

  if (!data?.variableName || !data?.histogramData || !data?.barDataIndexes) {
    return null;
  }

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={data.isDraggable || false}
      onDragStart={onDragStart}
    >
      <HistogramComponent {...data} />
    </ExpandableContainer>
  );
}
