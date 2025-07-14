// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

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
