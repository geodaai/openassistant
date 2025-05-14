import {
  isHistogramOutputData,
  HistogramComponent,
} from '@openassistant/components';
import { useMemo } from 'react';

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return useMemo(
      () => <HistogramComponent {...additionalData} />,
      [additionalData]
    );
  }
  return null;
}
