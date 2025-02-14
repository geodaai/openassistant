import { useCallback, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
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
  const [showMore, setShowMore] = useState(props.isExpanded);

  /**
   * Handles the press event for the "More" button
   * Toggles the expanded state and calls the parent's setIsExpanded callback if provided
   */
  const handleMorePress = useCallback(() => {
    setShowMore(!showMore);
    props.setIsExpanded?.(!props.isExpanded);
  }, [showMore, props]);

  /**
   * Creates table cells for a given metric and its corresponding data values
   * @param metric - The name of the metric (e.g., 'min', 'max', 'mean', 'std')
   * @param pcpData - Array of numeric values for the metric across all variables
   * @returns Array of JSX table cells containing the metric label and values
   */
  const createTableCells = (metric: string, pcpData: number[]) => {
    const tableCells: JSX.Element[] = [];
    tableCells.push(<TableCell key="metric-label">{metric}</TableCell>);
    pcpData.forEach((value, index) => {
      tableCells.push(
        <TableCell key={`${props.variables[index]}-${metric}`}>
          {value.toFixed(4)}
        </TableCell>
      );
    });
    return tableCells;
  };

  /**
   * Generates table rows for statistics (min, max, mean, std)
   * Each row contains cells with the statistic values for each variable
   * @returns Array of JSX table rows containing statistics
   */
  const generateStatsRows = () => {
    const metrics = ['min', 'max', 'mean', 'std'];
    return metrics.map((metric, index) => (
      <TableRow key={`${metric.toLowerCase()}-stats-${index}`}>
        {createTableCells(
          metric,
          props.pcp.map((p) => p[metric])
        )}
      </TableRow>
    ));
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }} className="relative">
          <div className="h-full w-full flex flex-col rounded-lg gap-2 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">
                Parallel Coordinates
              </p>
              <small className="truncate text-default-500">
                {props.variables.join(', ')}
              </small>
            </div>
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <ParallelCoordinatePlot {...props} />
              </div>
            </div>
            <div className="footer text-xs">
              {!props.isExpanded && (
                <div className="flex w-full justify-end">
                  <Button
                    size="sm"
                    variant="light"
                    startContent={
                      <Icon
                        icon="material-symbols-light:query-stats"
                        width="18"
                        height="18"
                      />
                    }
                    endContent={
                      showMore && (
                        <Icon
                          icon="solar:alt-arrow-up-line-duotone"
                          width="18"
                          height="18"
                        />
                      )
                    }
                    onPress={handleMorePress}
                  >
                    More
                  </Button>
                </div>
              )}
              {showMore && (
                <div className="w-full text-tiny">
                  <Table
                    aria-label="Parallel Coordinate Statistics"
                    classNames={{
                      base: 'overflow-scroll p-0 m-0 text-tiny',
                      table: 'p-0 m-0 text-tiny',
                      wrapper: 'p-0 pr-2',
                      th: 'text-tiny',
                      td: 'text-tiny text-default-500',
                    }}
                    isCompact={true}
                    removeWrapper={true}
                  >
                    <TableHeader>
                      <>
                        <TableColumn key="metric"> </TableColumn>
                        {props.variables.map((variable) => (
                          <TableColumn key={variable}>{variable}</TableColumn>
                        ))}
                      </>
                    </TableHeader>
                    <TableBody>{generateStatsRows()}</TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
