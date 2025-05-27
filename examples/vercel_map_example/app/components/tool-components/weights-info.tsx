import {
  isSpatialWeightsOutputData,
  SpatialWeightsComponent,
} from '@openassistant/tables';

interface WeightsToolProps {
  additionalData: unknown;
}

export function WeightsTool({ additionalData }: WeightsToolProps) {
  if (isSpatialWeightsOutputData(additionalData)) {
    return <SpatialWeightsComponent {...additionalData} />;
  }
  return null;
}

export default WeightsTool;
