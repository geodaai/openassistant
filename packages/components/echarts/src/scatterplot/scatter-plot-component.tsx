import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  RegressionResults,
  computeRegression,
  ComputeRegressionResult,
  OnSelected,
} from '@openassistant/plots';

import { ScatterRegressionPlot } from './scatter-regression-plot';
import { SimpleScatterPlot } from './simple-scatter-plots';

/**
 * The data of the scatterplot function.
 *
 * @param id - The id of the scatterplot.
 * @param datasetName - The name of the dataset.
 * @param xVariableName - The name of the x variable.
 * @param yVariableName - The name of the y variable.
 * @param xData - The x data.
 * @param yData - The y data.
 * @param regressionResults - The regression results.
 * @param filteredIndex - The indices of the selected points.
 * @param onSelected - The callback function can be used to sync the selections of the scatterplot with the original dataset.
 * @param theme - The theme of the scatterplot.
 * @param showLoess - Whether to show the loess regression.
 * @param showRegressionLine - Whether to show the regression line.
 */
export type ScatterplotOutputData = {
  id?: string;
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  xData: number[];
  yData: number[];
  regressionResults: ComputeRegressionResult;
  filteredIndex?: number[];
  onSelected?: OnSelected;
  theme?: string;
  showLoess?: boolean;
  showRegressionLine?: boolean;
  isExpanded?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  isDraggable?: boolean;
};

/**
 * @internal
 */
export function ScatterplotComponent({
  id,
  datasetName,
  filteredIndex,
  regressionResults: regression,
  xData,
  yData,
  xVariableName,
  yVariableName,
  onSelected,
  theme,
  isExpanded = false,
  setIsExpanded,
}: ScatterplotOutputData): JSX.Element | null {
  const [showMore, setShowMore] = useState(isExpanded);

  // state for the filtered indexes: simple scatter plot will set this state and the regression plot will rerender based on this state
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>(
    filteredIndex ?? []
  );

  // state for regression results
  const [regressionResults, setRegressionResults] = useState<
    ComputeRegressionResult | undefined
  >(regression);

  // update regression results when filtered indexes change
  useEffect(() => {
    const newRegressionResults = computeRegression({
      xData: xData ?? [],
      yData: yData ?? [],
      filteredIndex: filteredIndexes,
    });
    setRegressionResults(newRegressionResults);
  }, [xData, yData, filteredIndexes]);

  // slope title
  const slopeTitle = useMemo(() => {
    if (!regression) return undefined;
    const slope = regression.regression.slope.estimate;
    const pValue = regression.regression.slope.pValue;
    return `- Slope: ${slope.toFixed(3)}${pValue < 0.01 ? '**' : pValue < 0.05 ? '*' : ''}`;
  }, [regression]);

  const handleMorePress = useCallback(() => {
    setShowMore(!showMore);
    setIsExpanded?.(!isExpanded);
  }, [showMore, isExpanded, setIsExpanded]);

  const generateRegressionRows = (
    type: string,
    regressionData?: RegressionResults
  ) => [
    <TableRow key={`${type.toLowerCase()}-intercept`}>
      <TableCell>{type}: Intercept</TableCell>
      <TableCell>
        {regressionData ? regressionData.intercept.estimate.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.intercept.pValue.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData
          ? regressionData.intercept.standardError.toFixed(4)
          : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData
          ? regressionData.intercept.tStatistic.toFixed(4)
          : 'N/A'}
      </TableCell>
    </TableRow>,
    <TableRow key={`${type.toLowerCase()}-slope`}>
      <TableCell>{type}: Slope</TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.estimate.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.pValue.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.standardError.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.tStatistic.toFixed(4) : 'N/A'}
      </TableCell>
    </TableRow>,
  ];

  return (
    <div className="relative h-full w-full flex flex-col rounded-lg pt-6 text-gray-900 shadow-secondary-1  dark:text-gray-100">
      <div className="flex-col items-start p-2">
        <p className="text-tiny font-bold uppercase">Scatterplot</p>
        <small className="truncate text-default-500">
          {xVariableName} vs {yVariableName} {slopeTitle}
        </small>
      </div>
      <div className="relative h-full py-2 flex-grow ">
        <div className="absolute left-0 top-0 h-full w-full">
          <ScatterRegressionPlot
            filteredIndex={filteredIndex}
            regressionResults={regressionResults}
            xData={xData}
            yData={yData}
            showLoess={false}
            showRegressionLine={true}
            theme={theme}
            filteredIndexes={filteredIndexes}
          />
        </div>
        <div className="absolute left-0 top-0 h-full w-full">
          <SimpleScatterPlot
            id={id}
            datasetName={datasetName}
            variableX={xVariableName}
            xData={xData}
            variableY={yVariableName}
            yData={yData}
            theme={theme}
            onSelected={onSelected}
            setFilteredIndexes={setFilteredIndexes}
          />
        </div>
      </div>
      <div className="footer text-xs">
        {!isExpanded && (
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
        {showMore && regression && (
          <div className="w-full text-tiny">
            <div className="mb-2">
              <small className="text-tiny text-default-500">
                R² (All) = {regression.regression.rSquared.toFixed(4)}
                {regressionResults?.regressionSelected &&
                  ` | R² (Selected) = ${regressionResults.regressionSelected.rSquared.toFixed(4)}`}
                {regressionResults?.regressionUnselected &&
                  ` | R² (Unselected) = ${regressionResults.regressionUnselected.rSquared.toFixed(4)}`}
              </small>
            </div>
            <Table
              aria-label="Regression Results"
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
                <TableColumn>Parameter</TableColumn>
                <TableColumn>Estimate</TableColumn>
                <TableColumn>p-Value</TableColumn>
                <TableColumn>Std. Error</TableColumn>
                <TableColumn>t-Statistic</TableColumn>
              </TableHeader>
              <TableBody>
                {[
                  // All Data Results
                  ...generateRegressionRows('All', regression.regression),
                  // Selected Data Results
                  ...generateRegressionRows(
                    'Selected',
                    regressionResults?.regressionSelected
                  ),
                  // Unselected Data Results
                  ...generateRegressionRows(
                    'Unselected',
                    regressionResults?.regressionUnselected
                  ),
                ]}
              </TableBody>
            </Table>

            <div className="mt-2">
              <small className="text-tiny text-default-500">
                Chow test for sel/unsel regression subsets: distrib=F(2,{' '}
                {yData.length - 4}
                ), ratio=
                {regressionResults?.chowResults?.fStat.toFixed(4) || 'N/A'},
                p-val=
                {regressionResults?.chowResults?.pValue.toFixed(4) || 'N/A'}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// /**
//  * @internal
//  */
// export function ScatterplotComponentContainer(
//   props: ScatterplotOutputData
// ): JSX.Element | null {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const onDragStart = useDraggable({
//     id: props.id || generateId(),
//     type: 'scatterplot',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 600 : 400}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <ScatterplotComponent {...props} />
//     </ExpandableContainer>
//   );
// }
