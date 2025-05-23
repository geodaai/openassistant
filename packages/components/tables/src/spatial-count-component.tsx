import { useMemo, useState } from 'react';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { Button } from '@heroui/button';


export type SpatialJoinComponentProps = {
  id?: string;
  joinResult: number[][];
  joinValues?: Record<string, number[]>;
  actionButtonLabel?: string;
  actionButtonOnClick?: () => void;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function SpatialJoinComponent({
  joinResult,
  joinValues,
  actionButtonLabel,
  actionButtonOnClick,
}: SpatialJoinComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;
  const pages = Math.ceil(joinResult.length / rowsPerPage);

  const itemsOnPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return joinResult.slice(start, end);
  }, [page, joinResult]);

  return error ? (
    <div>
      <p className="text-tiny">Something went wrong:</p>
      {error}
    </div>
  ) : (
    <div className="flex flex-col max-w-full">
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
          wrapper:
            'max-h-[440px] max-w-full overflow-x-auto rounded-none gap-0',
          base: 'overflow-scroll p-0 m-0 text-tiny',
          table: 'p-0 m-0 text-tiny',
          th: 'text-tiny',
          td: 'text-[9px]',
        }}
        isHeaderSticky
        selectionMode="multiple"
        selectionBehavior="replace"
        disallowEmptySelection={false}
      >
        <TableHeader>
          {Object.keys(joinValues || {}).map((variable) => (
            <TableColumn key={variable}>{variable}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {itemsOnPage.map((row, index) => (
            <TableRow key={index}>
              {Object.keys(joinValues || {}).map((variable) => (
                <TableCell key={variable} style={{ position: 'relative' }}>
                  {joinValues?.[variable]?.[index]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {actionButtonLabel && actionButtonOnClick && joinValues && (
        <div className="flex justify-end">
          <Button color="secondary" onClick={() => actionButtonOnClick()}>
            {actionButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

// export function SpatialJoinComponentContainer(
//   props: SpatialJoinComponentProps
// ) {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const onDragStart = useDraggable({
//     id: props.id || generateId(),
//     type: 'spatial-join',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   const height = Math.min(props.joinResult.length, 10) * 30 + 120;

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 800 : height}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <SpatialJoinComponent {...props} />
//     </ExpandableContainer>
//   );
// }
