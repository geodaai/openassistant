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
    <div className="overflow-auto resize pb-3 w-full h-[300px]">
      <div className="relative h-full w-full flex flex-col rounded-lg gap-2 pt-6 text-gray-900 shadow-secondary-1  dark:text-gray-100">
        <div className="relative h-full py-2 flex-grow ">
          <div className="absolute left-0 top-0 h-full w-full">
            <BubbleChart {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}

// export function BubbleChartComponentContainer(
//   props: BubbleChartOutputData
// ): JSX.Element | null {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const onDragStart = useDraggable({
//     id: props.id || generateId(),
//     type: 'bubble',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 600 : 380}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <BubbleChartComponent {...props} />
//     </ExpandableContainer>
//   );
// }
