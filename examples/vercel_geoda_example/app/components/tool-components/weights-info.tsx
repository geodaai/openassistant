import {
  isSpatialWeightsOutputData,
  SpatialWeightsToolComponent,
} from '@openassistant/components';
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
