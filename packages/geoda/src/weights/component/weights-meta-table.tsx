import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
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
import {
  ExpandableContainer,
  useDraggable,
  generateId,
  formatNumberOrString,
} from '@openassistant/common';
import '../../index.css';

export type SpatialWeightsMetaTableProps = {
  id?: string;
  weightsMeta: WeightsMeta;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function SpatialWeightsMetaTable({
  weightsMeta,
}: SpatialWeightsMetaTableProps) {
  const intl = useIntl();

  // weightsMeta: mapping its key to descriptive label
  const WeightsMetaLabels = useMemo(
    () => ({
      id: 'weights.meta.id',
      name: 'weights.meta.name',
      type: 'weights.meta.type',
      symmetry: 'weights.meta.symmetry',
      numberOfObservations: 'weights.meta.numberOfObservations',
      k: 'weights.meta.k',
      order: 'weights.meta.order',
      incLowerOrder: 'weights.meta.incLowerOrder',
      threshold: 'weights.meta.threshold',
      distanceMetric: 'weights.meta.distanceMetric',
      minNeighbors: 'weights.meta.minNeighbors',
      maxNeighbors: 'weights.meta.maxNeighbors',
      meanNeighbors: 'weights.meta.meanNeighbors',
      medianNeighbors: 'weights.meta.medianNeighbors',
      pctNoneZero: 'weights.meta.pctNoneZero',
    }),
    []
  );

  const rows = useMemo(() => {
    const rows = Object.keys(WeightsMetaLabels)
      .filter((key) => key in weightsMeta)
      .map((key, i) => {
        const value = weightsMeta[key];
        const valueString = formatNumberOrString(value, intl.locale);
        return {
          key: `${i}`,
          property: intl.formatMessage({
            id: WeightsMetaLabels[key as keyof typeof WeightsMetaLabels],
          }),
          value: valueString,
        };
      });
    return rows;
  }, [weightsMeta, WeightsMetaLabels, intl]);

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <Table
        aria-label="Weights Property Table"
        color="success"
        selectionMode="single"
        classNames={{
          wrapper: 'max-h-[440px] max-w-full overflow-x-auto rounded-none',
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
        <TableBody
          emptyContent={intl.formatMessage({
            id: 'table.noRows',
            defaultMessage: 'No rows to display.',
          })}
          items={rows}
        >
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
