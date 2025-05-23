import {
  isSpatialWeightsOutputData,
  SpatialWeightsToolComponent,
} from 'packages/components/echarts/dist';

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
