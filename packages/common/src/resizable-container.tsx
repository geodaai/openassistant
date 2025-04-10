import { Resizable } from 're-resizable';
import { useState, useEffect } from 'react';

export function ResizablePlotContainer({
  children,
  defaultWidth,
  defaultHeight,
  handlePosition = 'bottomRight',
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}) {
  const [size, setSize] = useState({
    width: defaultWidth ?? '100%',
    height: defaultHeight ?? '100%',
  });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Calculate scale based on size changes
    const newScale = typeof size.width === 'number' 
      ? Math.min(1, Math.max(0.5, size.width / (defaultWidth ?? 800)))
      : 1;
    setScale(newScale);
  }, [size.width, defaultWidth]);

  const handleResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: string,
    ref: HTMLElement,
    d: { width: number; height: number }
  ) => {
    if (typeof size.width === 'number' && typeof size.height === 'number') {
      setSize({
        width: size.width + d.width,
        height: size.height + d.height,
      });
    }
  };

  return (
    <div className="w-full h-full mt-4 mb-2">
      <Resizable
        size={size}
        onResizeStop={handleResizeStop}
        minWidth={200}
        minHeight={80}
        maxHeight={800}
        enable={{ bottom: true, bottomRight: true, right: false }}
        handleComponent={{
          [handlePosition]: (
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
          ),
        }}
      >
        <div 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '100%',
            height: '100%'
          }}
        >
          {children}
        </div>
      </Resizable>
    </div>
  );
}
