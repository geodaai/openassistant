import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import * as duckdb from '@duckdb/duckdb-wasm';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Selection,
  Checkbox,
  Select,
  SelectItem,
} from '@nextui-org/react';
import './index.css';
import { getDuckDB } from './query';

export type QueryDuckDBOutputData = {
  db?: duckdb.AsyncDuckDB;
  columnData: { [key: string]: unknown[] };
  variableNames: string[];
  datasetName: string;
  sql: string;
  dbTableName: string;
  onSelected?: (
    datasetName: string,
    columnName: string,
    selectedValues: unknown[]
  ) => void;
  isDraggable?: boolean;
};

export function QueryDuckDBComponent({
  db,
  columnData,
  variableNames,
  datasetName,
  sql,
  dbTableName,
  onSelected,
}: QueryDuckDBOutputData): JSX.Element | null {
  const queryInProgress = useRef<Promise<void> | null>(null);

  // sync selections by
  const [syncSelection, setSyncSelection] = useState(false);
  const [syncSelectionBy, setSyncSelectionBy] = useState<string | null>(null);
  // selected rows
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // query result
  const [queryResult, setQueryResult] = useState<unknown[]>([]);

  // error handling
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(queryResult.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return queryResult.slice(start, end);
  }, [page, queryResult]);

  useEffect(() => {
    const query = async () => {
      // If a query is already in progress, wait for it to complete
      if (queryInProgress.current) {
        await queryInProgress.current;
      }

      // Create a new promise for this query
      queryInProgress.current = (async () => {
        try {
          const duckDB = await getDuckDB(db);
          if (!duckDB) {
            throw new Error('DuckDB instance is not initialized');
          }
          if (columnData && dbTableName && sql) {
            // use double quotes for the table name
            const safeDbTableName = `${dbTableName}`;

            // Create Arrow Table from column data with explicit type
            const arrowTable: ArrowTable = tableFromArrays(columnData);

            // connect to the database
            const conn = await duckDB.connect();

            // drop the table if it exists
            await conn.query(`DROP TABLE IF EXISTS ${safeDbTableName}`);

            // insert the arrow table to the database
            await conn.insertArrowTable(arrowTable, { name: safeDbTableName });

            // Execute the provided SQL query
            const arrowResult = await conn.query(sql);

            const result = arrowResult.toArray().map((row) => row.toJSON());
            setQueryResult(result);

            // delete the table from the database
            await conn.query(`DROP TABLE ${safeDbTableName}`);

            // close the connection
            await conn.close();
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          queryInProgress.current = null;
        }
      })();

      // Wait for the query to complete
      await queryInProgress.current;
    };

    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sql]);

  const onSyncSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setSyncSelection(e.target.checked);
    if (e.target.checked === false) {
      if (syncSelectionBy) {
        onSelected?.(datasetName, syncSelectionBy, []);
      }
    }
  };

  const onSyncSelectionBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSyncSelectionBy(e.target.value);
  };

  useEffect(() => {
    if (syncSelection) {
      const selectedRows = Array.from(selectedKeys).map((v) =>
        parseInt(v.toString(), 10)
      );
      // get the value of the syncSelectionBy variable
      const syncSelectionByValue = syncSelectionBy
        ? columnData[syncSelectionBy]
        : null;
      // filter syncSelectionByValue with selectedRows
      const filteredSyncSelectionByValue = syncSelectionByValue
        ? selectedRows.map((row) => syncSelectionByValue[row])
        : null;
      // if filteredSyncSelectionByValue is not null, call the onSelected callback
      if (filteredSyncSelectionByValue && syncSelectionBy) {
        onSelected?.(
          datasetName,
          syncSelectionBy,
          filteredSyncSelectionByValue
        );
      }
    }
  }, [
    selectedKeys,
    syncSelection,
    syncSelectionBy,
    columnData,
    onSelected,
    datasetName,
  ]);

  return error ? (
    <div>
      <p className="text-tiny">Something went wrong with the query.</p>
      {error}
    </div>
  ) : queryResult.length > 0 ? (
    <div className="flex flex-col gap-4 max-w-full">
      <span className="text-tiny font-bold mt-2">Query Result</span>
      <Table
        aria-label="Query Result Table"
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
          wrapper: 'max-h-[420px] max-w-full overflow-x-auto',
          base: 'overflow-scroll p-0 m-0 text-tiny',
          table: 'p-0 m-0 text-tiny',
          th: 'text-tiny',
          td: 'text-[9px]',
        }}
        isHeaderSticky
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        selectionBehavior="replace"
        disallowEmptySelection={false}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          {Object.keys(queryResult[0] || {}).map((key) => (
            <TableColumn key={key}>{key}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {items.map((row, i) => (
            <TableRow
              key={`0${(row as Record<string, unknown>)['row_index'] || i}`}
            >
              {Object.values(row as Record<string, unknown>).map((value, j) => (
                <TableCell key={j}>
                  {typeof value === 'number' && !Number.isInteger(value)
                    ? value.toFixed(3)
                    : String(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {onSelected && (
        <div className="flex flex-row gap-2 pl-2 text-tiny">
          <Checkbox
            size="sm"
            classNames={{ label: 'text-tiny' }}
            onChange={onSyncSelection}
          >
            sync selections by
          </Checkbox>
          <div className="flex-1">
            <Select
              size="sm"
              onChange={onSyncSelectionBy}
              aria-label="Select column for synchronization"
            >
              {variableNames.map((name) => (
                <SelectItem key={name}>{name}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
