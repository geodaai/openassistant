import { CustomFunctionCall } from '@openassistant/core';
import { SpatialCountOutputData } from './callback-function';
import { SpatialCountComponent } from './component/spatial-count-component';

// type guard
function isSpatialCountOutputData(
  data: unknown
): data is SpatialCountOutputData {
  return typeof data === 'object' && data !== null && 'joinResult' in data;
}

export function SpatialCountCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  const data = props.output.data as SpatialCountOutputData | undefined;

  if (!data || !isSpatialCountOutputData(data)) {
    return null;
  }

  return <SpatialCountComponent {...data} />;
}
