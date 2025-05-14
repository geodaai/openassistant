import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';
import { WeightsMeta } from '@geoda/core';
import { ExpandableContainer, useDraggable } from '@openassistant/common';
import { generateId } from '@openassistant/utils';
import '../index.css';

export function isSpatialWeightsOutputData(
  data: unknown
): data is SpatialWeightsMetaTableProps {
  return typeof data === 'object' && data !== null && 'weightsMeta' in data;
}

export type SpatialWeightsMetaTableProps = {
  id?: string;
  weightsMeta: WeightsMeta;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function SpatialWeightsMetaTable({
  weightsMeta,
}: SpatialWeightsMetaTableProps) {
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

  return (
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
    </div>
  );
}

export function SpatialWeightsToolComponent(
  props: SpatialWeightsMetaTableProps
) {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = useDraggable({
    id: props.id || generateId(),
    type: 'spatial-weights-meta',
    data: props,
  });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 800 : 400}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <SpatialWeightsMetaTable {...props} />
    </ExpandableContainer>
  );
}
