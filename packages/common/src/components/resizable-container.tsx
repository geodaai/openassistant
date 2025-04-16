import { Resizable } from 're-resizable';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="mt-4 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Resizable
        defaultSize={{
          width: defaultWidth ?? '100%',
          height: defaultHeight ?? '100%',
        }}
        minWidth={200}
        minHeight={80}
        maxHeight={800}
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
        {children}
      </Resizable>
    </div>
  );
}
