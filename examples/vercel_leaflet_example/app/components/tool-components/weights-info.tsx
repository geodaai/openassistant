import {
  isSpatialWeightsOutputData,
  SpatialWeightsToolComponent,
} from '@openassistant/components';

interface WeightsToolProps {
  additionalData: unknown;
}

export function WeightsTool({ additionalData }: WeightsToolProps) {
  if (isSpatialWeightsOutputData(additionalData)) {
    return <SpatialWeightsToolComponent {...additionalData} />;
  }
  return null;
}

export default WeightsTool;