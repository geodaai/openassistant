/**
 * The getValues function is used to get the values of the variable from dataset.
 */
export type GetValues = (
  /**
   * The name of the dataset.
   */
  datasetName: string,
  /**
   * The name of the variable.
   */
  variableName: string
) => Promise<number[]>;

/**
 * The onSelected function is used to handle the selected indices of the histogram.
 */
export type OnSelected = (
  /**
   * The name of the dataset.
   */
  datasetName: string,
  /**
   * The selected indices of the histogram.
   */
  selectedIndices: number[]
) => void;

/**
 * The context you should provided to run the ECharts tool.
 */
export type EChartsToolContext = {
  /**
   * The function to get the values of the variable from dataset.
   */
  getValues: GetValues;
  /**
   * The function to handle the selected indices of the ECharts. This can be used to get what's highlighted in the ECharts and you can use it to sync the highlight in your own app.
   */
  onSelected?: OnSelected;
  /**
   * The filtered indices of the ECharts. This can be used to initialize what has been filtered in the ECharts.
   */
  filteredIndex?: number[];
  /**
   * The config for the ECharts.
   */
  config?: {
    /**
     * Whether the ECharts is draggable.
     */
    isDraggable?: boolean;
    /**
     * The theme of the ECharts.
     */
    theme?: string;
    /**
     * Whether the ECharts is expanded.
     */
    isExpanded?: boolean;
    /**
     * Whether to show the loess line. Only for scatter plot.
     */
    showLoess?: boolean;
    /**
     * Whether to show the regression line. Only for scatter plot.
     */
    showRegressionLine?: boolean;
  };
};

export function isEChartsToolContext(
  context: unknown
): context is EChartsToolContext {
  return (
    typeof context === 'object' && context !== null && 'getValues' in context
  );
}
