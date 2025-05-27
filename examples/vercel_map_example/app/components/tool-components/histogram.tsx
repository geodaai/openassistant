import { isHistogramOutputData, HistogramComponent } from '@openassistant/echarts';

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return <HistogramComponent {...additionalData} />;
  }
  return null;
}

export default HistogramTool;