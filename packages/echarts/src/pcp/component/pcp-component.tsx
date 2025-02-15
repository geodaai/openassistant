import AutoSizer from 'react-virtualized-auto-sizer';
import { ParallelCoordinateOutputData, ParallelCoordinatePlot } from './pcp';

/**
 * Props for the ParallelCoordinateComponent, extending ParallelCoordinateOutputData
 * which contains the data and configuration for the parallel coordinate plot
 *
 * This component is used with the callback-component which is part of the LLM function
 * tool to visualize the parallel coordinate plot and its statistics. See definition of
 * callback-component in the LLM function tool documentation for more details.
 *
 */
export function ParallelCoordinateComponent(
  props: ParallelCoordinateOutputData
): JSX.Element | null {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }} className="relative">
          <div className="h-full w-full flex flex-col rounded-lg gap-2 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <ParallelCoordinatePlot {...props} />
              </div>
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
