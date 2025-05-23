import {
  isSpatialWeightsOutputData,
  SpatialWeightsToolComponent,
} from 'packages/components/echarts/dist';
import { useMemo } from 'react';

interface WeightsToolProps {
  additionalData: unknown;
}

export function WeightsTool({ additionalData }: WeightsToolProps) {
  if (isSpatialWeightsOutputData(additionalData)) {
    return useMemo(
      () => <SpatialWeightsToolComponent {...additionalData} />,
      [additionalData]
    );
  }
  return null;
}
