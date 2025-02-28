import { useEffect, useCallback, useRef } from 'react';

interface BrushLinkOptions {
  defaultDataId?: string;
  onLink?: (highlightedRows: number[], sourceDataId: string) => void;
  componentId?: string; // Optional, will be auto-generated if not provided
}

export type OnBrushedCallback = (
  highlightRowIndices: number[],
  dataId: string
) => void;

// Add this static registry at the top level, outside the hook
const brushLinkRegistry = new Map<
  string,
  {
    onLink?: (highlightedRows: number[], sourceDataId: string) => void;
    defaultDataId?: string;
  }
>();

/**
 * A hook that enables brush data synchronization between different components using localStorage.
 * This allows multiple charts or components to share selection/highlighting states.
 *
 * @remarks
 * The hook manages brush data in localStorage, enabling cross-component and cross-tab communication.
 * Each component can either monitor a specific dataset (using defaultDataId) or all datasets.
 *
 * @example
 * ```tsx
 * // --- Basic Usage ---
 * const MyChart = () => {
 *   const { brush, clearBrush } = useBrushLink({
 *     defaultDataId: 'myChart',
 *     onLink: (highlightedRows, sourceDataId) => {
 *       // Update your chart's highlighting here
 *       setHighlightedData(highlightedRows);
 *     }
 *   });
 *
 *   // Trigger brush events
 *   const onBrushSelection = (selectedIndices) => {
 *     brush(selectedIndices, 'myChart');
 *   };
 * };
 *
 * // --- Multiple Linked Charts ---
 * const ChartA = () => {
 *   const { brush, clearBrush } = useBrushLink({
 *     defaultDataId: 'chartA',
 *     onLink: (highlightedRows, sourceDataId) => {
 *       // React to brush events from any chart
 *       updateChartAHighlights(highlightedRows);
 *     }
 *   });
 * };
 *
 * const ChartB = () => {
 *   const { brush, clearBrush } = useBrushLink({
 *     defaultDataId: 'chartB',
 *     onLink: (highlightedRows, sourceDataId) => {
 *       // sourceDataId tells you which chart triggered the update
 *       if (sourceDataId === 'chartA') {
 *         // Handle updates from Chart A
 *       }
 *       updateChartBHighlights(highlightedRows);
 *     }
 *   });
 * };
 * ```
 *
 * @param options - Configuration options for the brush link
 * @param options.defaultDataId - The ID of the dataset this component will monitor. If not provided, 
 *                               the component will receive updates for all datasets.
 * @param options.onLink - Callback function triggered when brush data changes. Receives the highlighted 
 *                        row indices and the source dataset ID.
 * @param options.componentId - Optional unique identifier for this component instance. Auto-generated if not provided.
 *
 * @returns An object containing:
 * - brush: Function to update brush selection (params: highlightRowIndices: number[], dataId: string)
 * - clearBrush: Function to clear brush selection for a specific dataId
 * - getBrushData: Function to get current brush data for all datasets
 * - componentId: The unique identifier for this component instance
 */
export const useBrushLink = ({
  defaultDataId,
  onLink,
  componentId,
}: BrushLinkOptions = {}) => {
  const STORAGE_KEY = 'brush-link-data';

  // Generate and store a unique component ID if not provided
  const uniqueComponentId = useRef(
    componentId || `brush-link-${Math.random().toString(36).substr(2, 9)}`
  );

  // Helper to get data from localStorage
  const getBrushData = useCallback(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { data: {}, sourceId: null };
  }, []);

  // Register the component when the hook is initialized
  useEffect(() => {
    const currentId = uniqueComponentId.current;
    brushLinkRegistry.set(currentId, { onLink, defaultDataId });
    
    return () => {
      // Cleanup: remove from registry when component unmounts
      brushLinkRegistry.delete(currentId);
    };
  }, [onLink, defaultDataId]);

  // Update the handleStorageChange to notify all registered components
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const newValue = event.newValue
          ? JSON.parse(event.newValue)
          : { data: {}, sourceId: null };
        const oldValue = event.oldValue
          ? JSON.parse(event.oldValue)
          : { data: {}, sourceId: null };

        // Notify all registered components except the source
        brushLinkRegistry.forEach((config, registeredId) => {
          if (registeredId !== newValue.sourceId && config.onLink) {
            if (config.defaultDataId) {
              // Component is monitoring specific dataset
              const highlightedRows = newValue.data[config.defaultDataId] || [];
              if (
                JSON.stringify(highlightedRows) !==
                JSON.stringify(oldValue.data[config.defaultDataId])
              ) {
                config.onLink?.(highlightedRows, config.defaultDataId);
              }
            } else {
              // Component is monitoring all datasets
              Object.keys(newValue.data).forEach((dataId) => {
                if (
                  JSON.stringify(newValue.data[dataId]) !==
                  JSON.stringify(oldValue.data[dataId])
                ) {
                  config.onLink?.(newValue.data[dataId] || [], dataId);
                }
              });
            }
          }
        });
      }
    },
    [STORAGE_KEY]
  );

  // Brush function to save highlighted rows with specific dataId
  const brush = useCallback(
    (highlightRowIndices: number[], dataId: string) => {
      const newData = {
        data: {
          ...getBrushData().data,
          [dataId]: highlightRowIndices,
        },
        sourceId: uniqueComponentId.current,
      };
      const newValueString = JSON.stringify(newData);
      const oldValueString = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, newValueString);

      // Manually trigger handler for same-tab updates
      handleStorageChange({
        key: STORAGE_KEY,
        newValue: newValueString,
        oldValue: oldValueString,
      } as StorageEvent);
    },
    [getBrushData, handleStorageChange]
  );

  // Clear brush function with same manual trigger
  const clearBrush = useCallback(
    (dataId: string = defaultDataId || '') => {
      if (!dataId) return;
      const currentData = getBrushData();
      delete currentData.data[dataId];
      const newData = {
        data: currentData.data,
        sourceId: uniqueComponentId.current,
      };
      const newValueString = JSON.stringify(newData);
      const oldValueString = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, newValueString);

      // Manually trigger handler for same-tab updates
      handleStorageChange({
        key: STORAGE_KEY,
        newValue: newValueString,
        oldValue: oldValueString,
      } as StorageEvent);
    },
    [defaultDataId, getBrushData, handleStorageChange]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  return {
    brush,
    clearBrush,
    getBrushData: useCallback(() => getBrushData().data, [getBrushData]),
    componentId: uniqueComponentId.current,
  };
};
