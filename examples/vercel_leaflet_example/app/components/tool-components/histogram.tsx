import {
  isHistogramOutputData,
  HistogramComponent,
} from 'packages/components/echarts/dist';

export function HistogramTool({ additionalData }: { additionalData: unknown }) {
  if (isHistogramOutputData(additionalData)) {
    return <HistogramComponent {...additionalData} />;
  }
  return null;
}

export default HistogramTool;
