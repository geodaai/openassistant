import {
  isSpatialWeightsOutputData,
  SpatialWeightsComponent,
} from '@openassistant/tables';

export function WeightsTool({ additionalData }: { additionalData: unknown }) {
  if (isSpatialWeightsOutputData(additionalData)) {
    return <SpatialWeightsComponent {...additionalData} />;
  }
  return null;
}
