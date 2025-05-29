import {
  isHistogramOutputData,
  HistogramPlotComponent,
} from '@openassistant/echarts';

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return <HistogramPlotComponent {...additionalData} />;
  }
  return null;
}

export default HistogramTool;
