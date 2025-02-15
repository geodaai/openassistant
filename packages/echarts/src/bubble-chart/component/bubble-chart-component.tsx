import AutoSizer from 'react-virtualized-auto-sizer';
import { BubbleChartOutputData, BubbleChart } from './bubble-chart';

/**
 * A React component that renders an interactive bubble chart visualization.
 * 
 * @param props BubbleChartOutputData - The configuration and data for the bubble chart:
 *   - datasetName: string - The name of the dataset being visualized
 *   - data: object - The chart data containing:
 *     - variableX: number[] - X-axis values for each bubble
 *     - variableY: number[] - Y-axis values for each bubble
 *     - variableSize: number[] - Size values for each bubble
 *     - variableColor?: (number | string)[] - Optional color values for each bubble
 *   - theme?: string - Optional theme setting for the chart
 *   - isExpanded?: boolean - Optional flag to control chart expansion state
 *   - isDraggable?: boolean - Optional flag to enable/disable drag functionality
 * 
 * @returns A responsive bubble chart wrapped in an auto-sizing container
 * 
 * @example
 * <BubbleChartComponent
 *   datasetName="Sample Dataset"
 *   data={{
 *     variableX: [1, 2, 3],
 *     variableY: [4, 5, 6],
 *     variableSize: [10, 20, 30],
 *     variableColor: ['#ff0000', '#00ff00', '#0000ff']
 *   }}
 * />
 */
export function BubbleChartComponent(
  props: BubbleChartOutputData
): JSX.Element | null {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }} className="relative">
          <div className="h-full w-full flex flex-col rounded-lg gap-2 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <BubbleChart {...props} />
              </div>
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
