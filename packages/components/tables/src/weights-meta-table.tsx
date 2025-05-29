import { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/table';
import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { WeightsMeta } from '@geoda/core';

export function isSpatialWeightsOutputData(
  data: unknown
): data is SpatialWeightsComponentProps {
  return typeof data === 'object' && data !== null && 'weightsMeta' in data;
}

export type SpatialWeightsComponentProps = {
  id?: string;
  isExpanded?: boolean;
  isDraggable?: boolean;
} & {
  weightsId: string;
} & {
  [id: string]: {
    weights: number[][];
    weightsMeta: WeightsMeta;
  };
};

export function SpatialWeightsComponent(props: SpatialWeightsComponentProps) {
  const wid = props.weightsId as string;

  const { weights, weightsMeta } = useMemo(() => {
    return wid && props[wid] ? props[wid] : { weights: [], weightsMeta: {} };
  }, [wid, props]);

  // weightsMeta: mapping its key to descriptive label
  const WeightsMetaLabels = useMemo(
    () => ({
      id: 'ID',
      name: 'Name',
      type: 'Type',
      symmetry: 'Symmetry',
      numberOfObservations: 'Number of Observations',
      k: 'K',
      order: 'Order',
      incLowerOrder: 'Include Lower Order',
      threshold: 'Threshold',
      distanceMetric: 'Distance Metric',
      minNeighbors: 'Min Neighbors',
      maxNeighbors: 'Max Neighbors',
      meanNeighbors: 'Mean Neighbors',
      medianNeighbors: 'Median Neighbors',
      pctNoneZero: 'Percentage Non-Zero',
    }),
    []
  );

  const rows = useMemo(() => {
    const rows = Object.keys(WeightsMetaLabels)
      .filter((key) => key in weightsMeta)
      .map((key, i) => {
        const value = weightsMeta[key];
        const valueString =
          typeof value === 'number' ? value.toLocaleString() : String(value);
        return {
          key: `${i}`,
          property: WeightsMetaLabels[key as keyof typeof WeightsMetaLabels],
          value: valueString,
        };
      });
    return rows;
  }, [weightsMeta, WeightsMetaLabels]);

  // Function to convert weights matrix to GAL format
  const convertToGAL = (
    weightsMatrix: number[][],
    meta: WeightsMeta | Record<string, unknown>
  ): string => {
    if (!weightsMatrix || weightsMatrix.length === 0) {
      return '';
    }

    const numObservations = weightsMatrix.length;
    const weightsId = 'id' in meta ? meta.id || 'weights' : 'weights';
    const weightsType = 'type' in meta ? meta.type || 'unknown' : 'unknown';

    // Create header line with metadata
    const header = `${numObservations} ${weightsId} ${weightsType}`;

    const lines = [header];

    // For each observation, find its neighbors (non-zero weights)
    for (let i = 0; i < numObservations; i++) {
      const neighbors: number[] = [];

      // Find all neighbors (non-zero weights) for observation i
      for (let j = 0; j < weightsMatrix[i].length; j++) {
        if (weightsMatrix[i][j] !== 0) {
          neighbors.push(j + 1); // GAL format uses 1-based indexing
        }
      }

      // Format: ID number_of_neighbors neighbor1 neighbor2 ...
      const observationId = i + 1; // 1-based indexing
      const numNeighbors = neighbors.length;
      const line = `${observationId} ${numNeighbors}${neighbors.length > 0 ? ' ' + neighbors.join(' ') : ''}`;
      lines.push(line);
    }

    return lines.join('\n');

    /* Example GAL output:
     * 3 w-dataset-queen queen
     * 1 2 2 3
     * 2 2 1 3
     * 3 2 1 2
     *
     * This represents 3 observations where:
     * - Observation 1 has 2 neighbors: 2 and 3
     * - Observation 2 has 2 neighbors: 1 and 3
     * - Observation 3 has 2 neighbors: 1 and 2
     */
  };

  // Function to download GAL file
  const downloadGAL = () => {
    if (!weights || weights.length === 0) {
      console.warn('No weights data available for download');
      return;
    }

    const galContent = convertToGAL(weights, weightsMeta);

    if (!galContent) {
      console.warn('Failed to convert weights to GAL format');
      return;
    }

    // Create blob and download
    const blob = new Blob([galContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;

    // Generate filename based on weights metadata
    const weightsType =
      'type' in weightsMeta ? weightsMeta.type || 'weights' : 'weights';
    const weightsId =
      'id' in weightsMeta ? weightsMeta.id || 'spatial' : 'spatial';
    const filename = `${weightsId}_${weightsType}.gal`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-auto resize pb-3">
      <div className="flex flex-col max-w-full">
        <Table
          aria-label="Weights Property Table"
          color="success"
          selectionMode="single"
          classNames={{
            wrapper:
              'max-h-[380px] max-w-full overflow-x-auto overflow-y-auto rounded-none gap-0',
            base: 'overflow-scroll p-0 m-0 text-tiny',
            table: 'p-0 m-0 text-tiny',
            th: 'text-tiny',
            td: 'text-[9px]',
          }}
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn key="property" className="bg-lime-600 text-white">
              Property
            </TableColumn>
            <TableColumn key="value" className="bg-lime-600 text-white">
              Value
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No rows to display." items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Download button */}
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={
              <Icon icon="material-symbols:download" width="16" height="16" />
            }
            onPress={downloadGAL}
            isDisabled={!weights || weights.length === 0}
          >
            Download GAL
          </Button>
        </div>
      </div>
    </div>
  );
}

// export function SpatialWeightsComponentContainer(
//   props: SpatialWeightsComponentProps
// ) {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const onDragStart = useDraggable({
//     id: props.id || generateId(),
//     type: 'spatial-weights-meta',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 800 : 400}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <SpatialWeightsComponent {...props} />
//     </ExpandableContainer>
//   );
// }
