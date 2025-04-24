import {
  Button,
  PopoverContent,
  PopoverTrigger,
  useDraggable,
} from '@nextui-org/react';
import { cloneElement, DragEventHandler, useRef, useState } from 'react';
import { ResizablePlotContainer } from './resizable-container';
import { Popover } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { EChartsSkeleton } from './echarts-skeleton';

export function ExpandableContainer({
  children,
  defaultWidth,
  defaultHeight,
  draggable = false,
  onDragStart,
  onExpanded,
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLButtonElement>;
  onExpanded?: (isExpanded: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isExpanded });

  const onExpandComponent = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpanded?.(newExpandedState);
  };

  return (
    <ResizablePlotContainer
      {...(defaultWidth ? { defaultWidth } : {})}
      {...(defaultHeight ? { defaultHeight } : {})}
      isHovered={isHovered}
    >
      <div
        className={`h-full w-full relative rounded-md${
          isExpanded ? ' border border-default-200 p-1' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isExpanded ? (
          cloneElement(children, {
            isExpanded: false,
            setIsExpanded: setIsExpanded,
          })
        ) : (
          <EChartsSkeleton />
        )}
        <div
          className="group absolute top-0 right-0 mt-4 mr-[-24px] cursor-pointer flex flex-row"
          style={{ top: -38, right: -24 }}
        >
          {draggable && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={onExpandComponent}
              draggable={draggable}
              onDragStart={onDragStart}
              className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity cursor-move"
            >
              <Icon icon="basil:move-outline" width="12" height="12" />
            </Button>
          )}
          <Popover
            isOpen={isExpanded}
            placement="right"
            ref={targetRef}
            backdrop="transparent"
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={onExpandComponent}
              >
                {isHovered && (
                  <Icon
                    icon={
                      isExpanded
                        ? 'material-symbols-light:collapse-content-rounded'
                        : 'ci:expand'
                    }
                    width="12"
                    height="12"
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {isExpanded && (
                <>
                  <ResizablePlotContainer
                    {...(defaultWidth ? { defaultWidth } : {})}
                    {...(defaultHeight ? { defaultHeight } : {})}
                    isHovered={true}
                  >
                    <div className="h-full w-full relative mb-2">
                      {cloneElement(children, { isExpanded: true })}
                      <div
                        className="absolute top-0 right-0 flex flex-row justify-end gap-2 cursor-move w-full"
                        {...moveProps}
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={onExpandComponent}
                        >
                          <Icon
                            icon="material-symbols:close"
                            width="16"
                            height="16"
                          />
                        </Button>
                      </div>
                    </div>
                  </ResizablePlotContainer>
                  <div className="w-full h-4"></div>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </ResizablePlotContainer>
  );
}
