import { Resizable } from 're-resizable';

export function ResizablePlotContainer({
  children,
  defaultWidth,
  defaultHeight = 380,
  handlePosition = 'bottomRight',
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}) {
  return (
    <div className="w-full mt-4 mb-8">
      <Resizable
        defaultSize={{
          width: defaultWidth ?? '100%',
          // height: defaultHeight ?? 380,
        }}
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
        {children}
      </Resizable>
    </div>
  );
}
