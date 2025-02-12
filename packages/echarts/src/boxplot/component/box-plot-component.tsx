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
import { Boxplot, BoxplotOutputData } from './box-plot';
import { BoxplotDataProps } from 'src';

export function BoxplotComponent(props: BoxplotOutputData): JSX.Element | null {
  const [showMore, setShowMore] = useState(props.isExpanded);

  const handleMorePress = useCallback(() => {
    setShowMore(!showMore);
    props.setIsExpanded?.(!props.isExpanded);
  }, [showMore, props]);

  const createTableCells = (
    metric: string,
    boxplot: BoxplotDataProps,
    index: number
  ) => {
    const tableCells: JSX.Element[] = [];
    tableCells.push(<TableCell key="metric-label">{metric}</TableCell>);
    boxplot.boxData.forEach((data) => {
      tableCells.push(
        <TableCell key={data.name}>{data.value[index].toFixed(4)}</TableCell>
      );
    });
    return tableCells;
  };

  const generateStatsRows = (boxplot: BoxplotDataProps) => {
    const metrics = ['Min', 'Q1', 'Median', 'Q3', 'Max'];

    return metrics.map((metric, index) => (
      <TableRow key={`${metric.toLowerCase()}-stats-${index}`}>
        {createTableCells(metric, boxplot, index)}
      </TableRow>
    ));
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }} className="relative">
          <div className="h-full w-full flex flex-col rounded-lg gap-2 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">Boxplot</p>
              <small className="truncate text-default-500">
                {props.variables.join(', ')}
              </small>
            </div>
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <Boxplot {...props} />
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
                    aria-label="Box Plot Statistics"
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
                    <TableBody>{generateStatsRows(props.boxplot)}</TableBody>
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
