import {
  isHistogramOutputData,
  HistogramComponent,
} from '@openassistant/components';
import { useMemo } from 'react';

interface HistogramToolProps {
  additionalData: unknown;
}

export function HistogramTool({ additionalData }: HistogramToolProps) {
  if (isHistogramOutputData(additionalData)) {
    return useMemo(
      () => <HistogramComponent {...additionalData} />,
      [additionalData]
    );
  }
  return null;
}
