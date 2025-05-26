import { Resizable } from 're-resizable';
import { useRef, useState, useLayoutEffect } from 'react';

export function ResizablePlotContainer({
  children,
  defaultWidth,
  defaultHeight,
  isHovered,
  handlePosition = 'bottomRight',
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
  isHovered?: boolean;
  handlePosition?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [calculatedHeight, setCalculatedHeight] = useState<number>(defaultHeight ?? 200);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const measureContent = () => {
      if (contentRef.current) {
        console.log('Starting measurement...');
        console.log('Content ref dimensions:', {
          offsetWidth: contentRef.current.offsetWidth,
          offsetHeight: contentRef.current.offsetHeight,
          scrollHeight: contentRef.current.scrollHeight,
        });
        
        // Create a temporary clone to measure natural height
        const clone = contentRef.current.cloneNode(true) as HTMLDivElement;
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.height = 'auto';
        clone.style.width = contentRef.current.offsetWidth + 'px';
        clone.style.top = '-9999px';
        clone.style.maxHeight = 'none';
        clone.style.minHeight = 'auto';
        
        document.body.appendChild(clone);
        
        console.log('Clone dimensions:', {
          offsetHeight: clone.offsetHeight,
          scrollHeight: clone.scrollHeight,
          clientHeight: clone.clientHeight,
          computedStyle: window.getComputedStyle(clone),
        });
        
        // Also try to measure the actual child content directly
        const actualChild = clone.firstElementChild as HTMLElement;
        let childContentHeight = 0;
        if (actualChild) {
          // Remove padding from the child to get pure content height
          const childStyle = window.getComputedStyle(actualChild);
          const paddingTop = parseFloat(childStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(childStyle.paddingBottom) || 0;
          childContentHeight = actualChild.offsetHeight - paddingTop - paddingBottom;
          console.log('Child content height (without padding):', childContentHeight);
        }
        
        const naturalHeight = Math.max(clone.scrollHeight, clone.offsetHeight, clone.clientHeight);
        const useChildHeight = childContentHeight > 0 ? childContentHeight : naturalHeight;
        
        document.body.removeChild(clone);
        
        console.log('Natural content height:', naturalHeight, 'Child content height:', childContentHeight, 'Using:', useChildHeight, 'Default:', defaultHeight, 'Current calculated:', calculatedHeight);
        
        if (useChildHeight > 0) {
          const adjustedHeight = Math.min(Math.max(useChildHeight, 80), 800);
          console.log('Setting height to:', adjustedHeight);
          setCalculatedHeight(adjustedHeight);
        } else {
          console.log('Using default height:', defaultHeight ?? 200);
          setCalculatedHeight(defaultHeight ?? 200);
        }
      }
    };

    // Initial measurement
    const timeoutId = setTimeout(measureContent, 100);

    // Set up ResizeObserver to watch for content changes
    const resizeObserver = new ResizeObserver(() => {
      console.log('Content resized, remeasuring...');
      measureContent();
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [children, defaultHeight]);

  return (
    <div className="mt-4 mb-2">
      <Resizable
        size={{
          width: defaultWidth ?? '100%',
          height: calculatedHeight,
        }}
        minWidth={200}
        minHeight={80}
        maxHeight={800}
        enable={{ bottom: true, bottomRight: true, right: false }}
        onResizeStop={(e, direction, ref, d) => {
          // Update our state when user manually resizes
          const newHeight = calculatedHeight + d.height;
          console.log('Manual resize to:', newHeight);
          setCalculatedHeight(newHeight);
        }}
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
        <div ref={contentRef} className="w-full">
          {children}
        </div>
      </Resizable>
    </div>
  );
}
