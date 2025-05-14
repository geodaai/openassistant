import { LoessResult, RegressionResults } from '@openassistant/echarts';
import { numericFormatter } from '../../utils';

/**
 * @internal
 *
 * Get the regression line used in echarts scatterplot.
 *
 * @param allRegressionResults - The regression results.
 * @param dataMinX - The minimum x value.
 * @param dataMaxX - The maximum x value.
 * @param dataMinY - The minimum y value.
 * @param dataMaxY - The maximum y value.
 * @returns The regression line.
 */
export function getRegressionLine(
  allRegressionResults: RegressionResults,
  dataMinX: number,
  dataMaxX: number,
  dataMinY: number,
  dataMaxY: number
): [number, number][] {
  const regression = allRegressionResults;
  const slope = regression.slope.estimate;
  const intercept = regression.intercept.estimate;

  // Calculate Y values for min and max X
  const y1 = slope * dataMinX + intercept;
  const y2 = slope * dataMaxX + intercept;

  // Find X values where the line intersects Y bounds
  const xAtMinY = (dataMinY - intercept) / slope;
  const xAtMaxY = (dataMaxY - intercept) / slope;

  // Initialize points array
  const points: [number, number][] = [];

  // Add points based on which bounds they intersect
  if (y1 < dataMinY) {
    points.push([xAtMinY, dataMinY]);
  } else if (y1 > dataMaxY) {
    points.push([xAtMaxY, dataMaxY]);
  } else {
    points.push([dataMinX, y1]);
  }

  if (y2 < dataMinY) {
    points.push([xAtMinY, dataMinY]);
  } else if (y2 > dataMaxY) {
    points.push([xAtMaxY, dataMaxY]);
  } else {
    points.push([dataMaxX, y2]);
  }

  // if there is Infinity or NaN return []
  if (points.some((point) => !isFinite(point[0]) || !isFinite(point[1]))) {
    return [];
  }
  return points;
}

/**
 * @internal
 * The properties of the scatterplot chart option.
 *
 * @param xVariableName - The name of the x variable.
 * @param xData - The x data.
 * @param yVariableName - The name of the y variable.
 * @param yData - The y data.
 * @param showRegressionLine - Whether to show the regression line.
 * @param showLoess - Whether to show the loess line.
 * @param allRegressionResults - The regression results.
 * @param selectedRegressionResults - The regression results for the selected points.
 * @param unselectedRegressionResults - The regression results for the unselected points.
 * @param loessResult - The loess result.
 */
export type ScatterplotChartOptionProps = {
  xData: number[];
  yData: number[];
  showRegressionLine: boolean;
  showLoess: boolean;
  allRegressionResults: RegressionResults;
  selectedRegressionResults?: RegressionResults;
  unselectedRegressionResults?: RegressionResults;
  loessResult?: LoessResult;
};

/**
 * Get the scatterplot chart option.
 *
 * @param props - The properties of the scatterplot chart option. See {@link ScatterplotChartOptionProps} for more details.
 * @returns The scatterplot eChart option.
 */
export function getScatterplotChartOption({
  xData,
  yData,
  showRegressionLine,
  showLoess = false,
  allRegressionResults,
  selectedRegressionResults,
  unselectedRegressionResults,
  loessResult,
}: ScatterplotChartOptionProps) {
  // Calculate bounds once
  const bounds = {
    minX: Math.min(...xData),
    maxX: Math.max(...xData),
    minY: Math.min(...yData),
    maxY: Math.max(...yData),
  };

  // Create regression lines using a helper function
  const createRegressionLine = (results: RegressionResults) =>
    getRegressionLine(
      results,
      bounds.minX,
      bounds.maxX,
      bounds.minY,
      bounds.maxY
    );

  // Calculate regression lines conditionally
  const regressionLines =
    showRegressionLine && allRegressionResults
      ? {
          main: createRegressionLine(allRegressionResults),
          selected:
            selectedRegressionResults &&
            createRegressionLine(selectedRegressionResults),
          unselected:
            unselectedRegressionResults &&
            createRegressionLine(unselectedRegressionResults),
        }
      : null;

  // Extract series creation logic
  const createRegressionSeries = () => [
    ...(regressionLines?.selected?.length
      ? [
          {
            type: 'line',
            data: regressionLines.selected,
            showSymbol: false,
            itemStyle: { color: '#ff0000' },
          },
        ]
      : []),
    ...(regressionLines?.unselected?.length
      ? [
          {
            type: 'line',
            showSymbol: false,
            data: regressionLines.unselected,
            itemStyle: { color: '#00ff00' },
          },
        ]
      : []),
    ...(regressionLines?.main?.length
      ? [
          {
            type: 'line',
            data: regressionLines.main,
            showSymbol: false,
            itemStyle: { color: '#0096ff' },
            lineStyle: { width: 2 },
          },
        ]
      : []),
  ];

  // Extract LOESS series creation logic
  const createLoessSeries = () =>
    showLoess && loessResult
      ? [
          {
            type: 'line',
            data: loessResult.fitted,
            showSymbol: false,
            itemStyle: { color: '#800080' },
            lineStyle: { width: 2, type: 'solid' },
          },
          ...(['lower', 'upper'] as const).map((bound: 'lower' | 'upper') => ({
            type: 'line',
            data: loessResult[bound].map((value, index) => [
              loessResult.fitted[index][0],
              value[1],
            ]),
            showSymbol: false,
            lineStyle: { opacity: 0.5, type: 'dotted', width: 1 },
            itemStyle: { color: '#ffffff' },
          })),
        ]
      : [];

  const seriesData = xData.map((x, i) => [x, yData[i]]);

  const option = {
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: {
        formatter: numericFormatter,
      },
    },
    series: [
      {
        data: seriesData,
        type: 'scatter',
        symbolSize: 3,
        symbol: seriesData.length > 1000 ? 'rect' : 'circle',
        itemStyle: {
          color: 'lightblue',
          borderColor: '#555',
          opacity: 0.9,
          borderWidth: 0,
        },
        // highlight
        emphasis: {
          // focus: 'series',
          symbolSize: 6,
          itemStyle: {
            color: 'red',
            borderWidth: 1,
          },
        },
        animationDelay: 0,
      },
      ...createRegressionSeries(),
      ...createLoessSeries(),
    ],
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true,
    },
    // avoid flickering when brushing
    animation: false,
    // to disable progressive rendering permanently
    progressive: 0,
  };

  return option;
}
