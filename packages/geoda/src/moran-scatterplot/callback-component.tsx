import { ExpandableContainer, generateId } from "@openassistant/common";
import { CustomFunctionCall } from "@openassistant/core";
import { DragEvent } from 'react';
import { isMoranScatterOutputData, MoranScatterOutputData } from "./component/moran-scatter-plot";
import { MoranScatterComponent } from "./component/moran-scatter-plot";

export function MoranScatterCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  const id = generateId();
  const data = props.output.data as MoranScatterOutputData | undefined;

  if (!isMoranScatterOutputData(data)) {
    return null;
  }

  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `moran-scatterplot-${id}`,
        type: 'moran-scatterplot',
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
      <MoranScatterComponent {...data} id={id} />
    </ExpandableContainer>
  );
}