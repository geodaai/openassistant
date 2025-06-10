import { Resizable } from 're-resizable';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import React from 'react';

// Throttle utility function for resize handlers
function useThrottledResizeCallback(
  callback: (
    e: MouseEvent | TouchEvent,
    direction: string,
    refElement: HTMLElement,
    delta: { width: number; height: number }
  ) => void,
  delay: number
) {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      refElement: HTMLElement,
      delta: { width: number; height: number }
    ) => {
      const now = Date.now();

      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(e, direction, refElement, delta);
      } else {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => {
            lastCall.current = Date.now();
            callback(e, direction, refElement, delta);
          },
          delay - (now - lastCall.current)
        );
      }
    },
    [callback, delay]
  );
}

// Child-size-driven container: Child determines initial size, user can resize to constrain
export function ResizableContainerChildDriven({
  children,
  isHovered,
  handlePosition = 'bottomRight',
  throttleMs = 16,
  onSizeChange,
}: {
  children: JSX.Element;
  isHovered?: boolean;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  throttleMs?: number;
  onSizeChange?: (width: number, height: number) => void;
}) {
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const childRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();

  // Observe child's natural size changes
  useEffect(() => {
    if (childRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setContainerSize({ width, height });
            onSizeChange?.(width, height);
          }
        }
      });

      resizeObserverRef.current.observe(childRef.current);

      return () => {
        resizeObserverRef.current?.disconnect();
      };
    }
  }, [onSizeChange]);

  const handleResize = useCallback(
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      refElement: HTMLElement
    ) => {
      const newSize = {
        width: refElement.offsetWidth,
        height: refElement.offsetHeight,
      };
      setContainerSize(newSize);
      setForceUpdate((prev) => prev + 1);
      onSizeChange?.(newSize.width, newSize.height);
    },
    [onSizeChange]
  );

  const throttledResize = useThrottledResizeCallback(handleResize, throttleMs);

  // Always pass current dimensions if available (not just after user resize)
  const childProps = useMemo(
    () => ({
      ...(containerSize && {
        width: containerSize.width,
        height: containerSize.height,
      }),
      ...children.props,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize, children.props, forceUpdate] // Add forceUpdate to dependencies
  );

  const childrenWithProps = useMemo(
    () => React.cloneElement(children, childProps),
    [children, childProps]
  );

  return (
    <div className="mt-4 mb-2">
      <Resizable
        onResize={throttledResize}
        size={containerSize || undefined}
        enable={{ bottom: true, bottomRight: true, right: false }}
        handleComponent={{
          [handlePosition]: isHovered ? (
            <div className="group absolute bottom-0 right-0 h-6 w-6 cursor-se-resize">
              <div className="flex h-full w-full items-center justify-center transition-colors hover:bg-gray-100/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-gray-300 group-hover:text-gray-400"
                >
                  <path
                    d="M11 6V11H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ) : null,
        }}
      >
        <div ref={childRef}>{childrenWithProps}</div>
      </Resizable>
    </div>
  );
}

// Alternative implementation using render prop pattern (more performant)
export function ResizablePlotContainerRenderProp({
  children,
  isHovered,
  handlePosition = 'bottomRight',
  defaultWidth = 0,
  defaultHeight = 0,
  throttleMs = 16, // ~60fps
}: {
  children: (props: { width: number; height: number }) => JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  isHovered?: boolean;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  throttleMs?: number;
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);

  const handleResize = useCallback(
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      refElement: HTMLElement
    ) => {
      const newSize = {
        width: refElement.offsetWidth,
        height: refElement.offsetHeight,
      };
      setWidth(newSize.width);
      setHeight(newSize.height);
    },
    []
  );

  const throttledResize = useThrottledResizeCallback(handleResize, throttleMs);

  const dimensionProps = useMemo(() => ({ width, height }), [width, height]);

  return (
    <div className="mt-4 mb-2">
      <Resizable
        onResize={throttledResize}
        defaultSize={{ width: defaultWidth, height: defaultHeight }}
        enable={{ bottom: true, bottomRight: true, right: false }}
        handleComponent={{
          [handlePosition]: isHovered ? (
            <div className="group absolute bottom-0 right-0 h-6 w-6 cursor-se-resize">
              <div className="flex h-full w-full items-center justify-center transition-colors hover:bg-gray-100/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-gray-300 group-hover:text-gray-400"
                >
                  <path
                    d="M11 6V11H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ) : null,
        }}
      >
        {children(dimensionProps)}
      </Resizable>
    </div>
  );
}

export function ResizablePlotContainer({
  children,
  isHovered,
  handlePosition = 'bottomRight',
  defaultWidth = 0,
  defaultHeight = 0,
  throttleMs = 16, // ~60fps
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  isHovered?: boolean;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  throttleMs?: number;
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const resizableRef = useRef<Resizable>(null);

  // Get initial dimensions after mount
  useEffect(() => {
    if (resizableRef.current && (width === 0 || height === 0)) {
      const element = resizableRef.current.resizable;
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setWidth(rect.width);
          setHeight(rect.height);
        }
      }
    }
  }, [width, height]);

  const handleResize = useCallback(
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      refElement: HTMLElement
    ) => {
      const newSize = {
        width: refElement.offsetWidth,
        height: refElement.offsetHeight,
      };
      setWidth(newSize.width);
      setHeight(newSize.height);
    },
    []
  );

  const throttledResize = useThrottledResizeCallback(handleResize, throttleMs);

  // Memoize the props object to prevent unnecessary re-renders
  const childProps = useMemo(
    () => ({
      width,
      height,
      ...children.props, // Preserve existing props
    }),
    [width, height, children.props]
  );

  // Memoize the cloned element to prevent unnecessary re-renders
  const childrenWithProps = useMemo(
    () => React.cloneElement(children, childProps),
    [children, childProps]
  );

  return (
    <div className="mt-4 mb-2">
      <Resizable
        ref={resizableRef}
        onResize={throttledResize}
        defaultSize={{ width: defaultWidth, height: defaultHeight }}
        enable={{ bottom: true, bottomRight: true, right: false }}
        handleComponent={{
          [handlePosition]: isHovered ? (
            <div className="group absolute bottom-0 right-0 h-6 w-6 cursor-se-resize">
              <div className="flex h-full w-full items-center justify-center transition-colors hover:bg-gray-100/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-gray-300 group-hover:text-gray-400"
                >
                  <path
                    d="M11 6V11H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ) : null,
        }}
      >
        {childrenWithProps}
      </Resizable>
    </div>
  );
}

// Tool call container: Optimized for tool call components with hover-based resize
export function ResizableToolCallContainer({
  children,
  defaultWidth = 800,
  defaultHeight = 400,
  minWidth = 300,
  minHeight = 200,
  maxWidth,
  maxHeight,
  throttleMs = 16,
  onSizeChange,
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  throttleMs?: number;
  onSizeChange?: (width: number, height: number) => void;
}) {
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({
    width: defaultWidth,
    height: defaultHeight,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleResize = useCallback(
    (
      e: MouseEvent | TouchEvent,
      direction: string,
      refElement: HTMLElement
    ) => {
      const newSize = {
        width: refElement.offsetWidth,
        height: refElement.offsetHeight,
      };
      setContainerSize(newSize);
      setForceUpdate((prev) => prev + 1);
      onSizeChange?.(newSize.width, newSize.height);
    },
    [onSizeChange]
  );

  const throttledResize = useThrottledResizeCallback(handleResize, throttleMs);

  const childProps = useMemo(
    () => ({
      width: containerSize.width,
      height: containerSize.height,
      ...children.props,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize, children.props, forceUpdate]
  );

  const childrenWithProps = useMemo(
    () => React.cloneElement(children, childProps),
    [children, childProps]
  );

  return (
    <div 
      className="mt-4 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Resizable
        size={containerSize}
        onResize={throttledResize}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        enable={{ bottom: true, bottomRight: true, right: true }}
        handleComponent={{
          bottomRight: isHovered ? (
            <div className="group absolute bottom-0 right-0 h-6 w-6 cursor-se-resize z-10">
              <div className="flex h-full w-full items-center justify-center transition-colors hover:bg-gray-100/20 bg-gray-100/10 rounded-tl-md">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-gray-400 group-hover:text-gray-600"
                >
                  <path
                    d="M11 6V11H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ) : undefined,
        }}
        style={{
          border: isHovered ? '1px solid #e5e7eb' : '1px solid transparent',
          borderRadius: '4px',
          transition: 'border-color 0.2s ease',
        }}
      >
        {childrenWithProps}
      </Resizable>
    </div>
  );
}
