import { Card, Skeleton } from '@nextui-org/react';

export function EChartsSkeleton(): JSX.Element {
  return (
    <Card className="w-full h-full space-y-5 p-4 gap-4 flex flex-col" radius="lg">
      <Skeleton className="rounded-lg flex-grow" disableAnimation={true}>
        <div className="h-full rounded-lg bg-default-300" />
      </Skeleton>
      <div className="space-y-3 flex flex-col gap-2">
        <Skeleton className="w-3/5 rounded-lg" disableAnimation={true}>
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg" disableAnimation={true}>
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg" disableAnimation={true}>
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
      </div>
    </Card>
  );
}
