import { CanvasRenderer } from "echarts/renderers";
import { ParallelChart } from "echarts/charts";
import * as echarts from 'echarts/core';
import { ECHARTS_DARK_THEME } from "../../echarts-theme";
import { ParallelCoordinateDataProps } from "./utils";
import { createParallelCoordinateOption } from "./pcp-option";
import { useMemo } from "react";

// Register the required components
echarts.use([CanvasRenderer, ParallelChart]);
echarts.registerTheme('dark', ECHARTS_DARK_THEME);

export type ParallelCoordinateOutputData = {
  id: string;
  datasetName: string;
  variables: string[];
  pcp: ParallelCoordinateDataProps;
  rawData: Record<string, number[]>;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
};

export function ParallelCoordinatePlot(props: ParallelCoordinateOutputData) {
  const {id, datasetName, variables, pcp, rawData, theme, isDraggable, isExpanded, setIsExpanded} = props;

  const option = useMemo(() => {
    return createParallelCoordinateOption({
      variableNames: variables,
      rawDataArray: Object.values(rawData),
    });
  }, [variables, rawData]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

    const { brush, componentId } = useBrushLink({
    defaultDataId: datasetName,
    componentId: id,
    onLink: (highlightedRows, sourceDataId) => {
      console.log(
        `Chart One (${componentId}) received update for ${sourceDataId}:`,
        highlightedRows
      );
      if (
        rendered &&
        eChartsRef.current &&
        highlightedRows &&
        componentId !== sourceDataId
      ) {
        const chartInstance = eChartsRef.current?.getEchartsInstance();
        chartInstance?.dispatchAction({ type: 'downplay' });
        if (highlightedRows.length < Object.values(rawData)[0].length) {
          // chartInstance.dispatchAction({type: 'brush', command: 'clear', areas: []});
          chartInstance?.dispatchAction({
            type: 'highlight',
            dataIndex: highlightedRows,
            ...(seriesIndex ? { seriesIndex } : {}),
          });
          // const updatedOption = getChartOption(filteredIndexes, props);
          // chartInstance.setOption(updatedOption, true);
        }
      }
    },
  });

  return <ReactEChartsCore option={option} />;
}
