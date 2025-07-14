// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useMemo, useState } from 'react';
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
import { Pagination } from '@heroui/pagination';

export type DataTableComponentProps = {
  saveData: boolean;
  onSaveData?: (
    originalDatasetName: string,
    datasetName: string,
    data: Record<string, number[]>
  ) => void;
  datasetName: string;
  originalDatasetName: string;
  [key: string]:
    | {
        type: string;
        content: Record<string, number[]>;
      }
    | unknown;
};

export function DataTableComponent(props: DataTableComponentProps) {
  const { onSaveData, datasetName, originalDatasetName } = props;
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // get data by datasetName
  const dataset = props[datasetName] as {
    type: string;
    content: Record<string, number[]>;
  };

  const data = dataset?.content;

  // Transform data into table format
  const { columns, rows } = useMemo(() => {
    const columnKeys = Object.keys(data);

    if (columnKeys.length === 0) {
      return {
        columns: [] as Array<{ key: string; label: string }>,
        rows: [] as Array<Record<string, unknown>>,
      };
    }

    // Get the first column to determine the number of rows
    const firstColumnData = data[columnKeys[0]];
    const numRows = Array.isArray(firstColumnData) ? firstColumnData.length : 1;

    // Create rows
    const rows: Array<Record<string, unknown>> = [];
    for (let i = 0; i < numRows; i++) {
      const row: Record<string, unknown> = { key: i.toString() };
      columnKeys.forEach((columnKey) => {
        const columnData = data[columnKey];
        if (Array.isArray(columnData)) {
          row[columnKey] = columnData[i] ?? '';
        } else {
          row[columnKey] = i === 0 ? columnData : '';
        }
      });
      rows.push(row);
    }

    // Create columns
    const columns = columnKeys.map((key) => ({
      key,
      label: key,
    }));

    return { columns, rows };
  }, [data]);

  // Paginate rows
  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [page, rows]);

  return data && (
    <div className="overflow-auto resize pb-3">
      <div className="flex flex-col max-w-full">
        <Table
          aria-label="Data Table"
          color="success"
          selectionMode="single"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                size="sm"
                hidden={pages <= 1}
              />
            </div>
          }
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
            {columns.map((column) => (
              <TableColumn key={column.key} className="bg-lime-600 text-white">
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="No data to display." items={items}>
            {(item) => (
              <TableRow key={String((item as Record<string, unknown>).key)}>
                {(columnKey) => (
                  <TableCell>
                    {String(
                      getKeyValue(item as Record<string, unknown>, columnKey) ??
                        ''
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Save button */}
        {onSaveData && (
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => onSaveData(originalDatasetName, datasetName, data)}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
