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

/**
 * This hook is used to link the brush data between different components.
 * 
 * It will save the brush data to the localStorage and listen for the storage changes.
 * When the storage changes, it will call the onLink callback with the highlighted rows and the dataId.
 *
 * @example
 * ```tsx
 * // Component A
 * const ChartOne = () => {
 *   const { brush, clearBrush, componentId } = useBrushLink({
 *     defaultDataId: 'chart1',
 *     componentId: 'chart-one', // Optional: provide your own ID
 *     onLink: (highlightedRows, sourceDataId) => {
 *       console.log(`Chart One (${componentId}) received update for ${sourceDataId}:`, highlightedRows);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => brush([1, 2, 3], 'chart1')}>Select in Chart 1</button>
 *       <button onClick={() => clearBrush('chart1')}>Clear Chart 1</button>
 *     </div>
 *   );
 * };
 *
 * // Component B
 * const ChartTwo = () => {
 *   const { brush, clearBrush, componentId } = useBrushLink({
 *     defaultDataId: 'chart2',
 *     onLink: (highlightedRows, sourceDataId) => {
 *       console.log(`Chart Two (${componentId}) received update for ${sourceDataId}:`, highlightedRows);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => brush([4, 5, 6], 'chart2')}>Select in Chart 2</button>
 *       <button onClick={() => clearBrush('chart2')}>Clear Chart 2</button>
 *     </div>
 *   );
 * };
 * ```
 * @param defaultDataId - The dataId of the default dataset to monitor.
 * @param onLink - The callback function to be called when the brush data changes.
 * @param componentId - The id of the component.
 * @returns
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

  // Brush function to save highlighted rows with specific dataId
  const brush = useCallback(
    (highlightRowIndices: number[], dataId: string) => {
      const newData = {
        data: {
          ...getBrushData().data,
          [dataId]: highlightRowIndices,
        },
        sourceId: uniqueComponentId.current, // Store the source component ID
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    },
    [getBrushData]
  );

  // Clear brush data for a specific dataId
  const clearBrush = useCallback(
    (dataId: string = defaultDataId || '') => {
      if (!dataId) return;
      const currentData = getBrushData();
      delete currentData.data[dataId];
      const newData = {
        data: currentData.data,
        sourceId: uniqueComponentId.current,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    },
    [defaultDataId, getBrushData]
  );

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && onLink) {
        const newValue = event.newValue
          ? JSON.parse(event.newValue)
          : { data: {}, sourceId: null };
        const oldValue = event.oldValue
          ? JSON.parse(event.oldValue)
          : { data: {}, sourceId: null };

        // Skip if this component triggered the change
        if (newValue.sourceId === uniqueComponentId.current) {
          return;
        }

        // Handle specific dataset monitoring
        if (defaultDataId) {
          const highlightedRows = newValue.data[defaultDataId] || [];
          if (
            JSON.stringify(highlightedRows) !==
            JSON.stringify(oldValue.data[defaultDataId])
          ) {
            onLink(highlightedRows, defaultDataId);
          }
        } else {
          // Handle all-dataset monitoring
          Object.keys(newValue.data).forEach((dataId) => {
            if (
              JSON.stringify(newValue.data[dataId]) !==
              JSON.stringify(oldValue.data[dataId])
            ) {
              onLink(newValue.data[dataId] || [], dataId);
            }
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [defaultDataId, onLink]);

  return {
    brush,
    clearBrush,
    getBrushData: useCallback(() => getBrushData().data, [getBrushData]),
    componentId: uniqueComponentId.current,
  };
};
