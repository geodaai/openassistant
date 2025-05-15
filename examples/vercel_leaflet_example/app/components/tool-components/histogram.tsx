import {
  isHistogramOutputData,
  HistogramComponent,
} from '@openassistant/components';

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return <HistogramComponent {...additionalData} />;
  }
  return null;
}

export default HistogramTool;
