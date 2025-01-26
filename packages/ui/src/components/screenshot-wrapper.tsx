import React, { MouseEvent, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

export type ScreenshotWrapperProps = {
  children: React.ReactNode;
  startScreenCapture: boolean;
  setScreenCaptured: (value: string) => void;
  setStartScreenCapture: (value: boolean) => void;
  saveScreenshot?: boolean;
  className?: string;
};

export function ScreenshotWrapper({
  children,
  startScreenCapture,
  setScreenCaptured,
  setStartScreenCapture,
  saveScreenshot = false,
  className,
}: ScreenshotWrapperProps) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [crossHairsTop, setCrossHairsTop] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [crossHairsLeft, setCrossHairsLeft] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [borderWidth, setBorderWidth] = useState<number | string>(0);
  const [cropPositionTop, setCropPositionTop] = useState(0);
  const [cropPositionLeft, setCropPositionLeft] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);

  const handleWindowResize = () => {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    setWindowWidth(windowWidth);
    setWindowHeight(windowHeight);
  };

  useEffect(() => {
    // when the component mounts, set the window width and height
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    // remove the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (startScreenCapture === false) {
      // return and pass the event to the next element
      return;
    }

    let cropTop = startY;
    let cropLeft = startX;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const isStartTop = clientY >= startY;
    const isStartBottom = clientY <= startY;
    const isStartLeft = clientX >= startX;
    const isStartRight = clientX <= startX;
    const isStartTopLeft = isStartTop && isStartLeft;
    const isStartTopRight = isStartTop && isStartRight;
    const isStartBottomLeft = isStartBottom && isStartLeft;
    const isStartBottomRight = isStartBottom && isStartRight;
    let newBorderWidth = borderWidth;
    let cropW = 0;
    let cropH = 0;

    if (isMouseDown) {
      if (isStartTopLeft) {
        newBorderWidth = `${startY}px ${windowWidth - clientX}px ${
          windowHeight - clientY
        }px ${startX}px`;
        cropW = clientX - startX;
        cropH = clientY - startY;
      }

      if (isStartTopRight) {
        newBorderWidth = `${startY}px ${windowWidth - startX}px ${
          windowHeight - clientY
        }px ${clientX}px`;
        cropW = startX - clientX;
        cropH = clientY - startY;
        cropLeft = clientX;
      }

      if (isStartBottomLeft) {
        newBorderWidth = `${clientY}px ${windowWidth - clientX}px ${
          windowHeight - startY
        }px ${startX}px`;
        cropW = clientX - startX;
        cropH = startY - clientY;
        cropTop = clientY;
      }
      if (isStartBottomRight) {
        newBorderWidth = `${clientY}px ${windowWidth - startX}px ${
          windowHeight - startY
        }px ${clientX}px`;
        cropW = startX - clientX;
        cropH = startY - clientY;
        cropTop = clientY;
        cropLeft = clientX;
      }
    }
    setCrossHairsTop(clientY);
    setCrossHairsLeft(clientX);
    setBorderWidth(newBorderWidth);
    setCropWidth(cropW);
    setCropHeight(cropH);
    setCropPositionTop(cropTop);
    setCropPositionLeft(cropLeft);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (startScreenCapture === false) {
      // return and pass the event to the next element
      return;
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    setStartX(clientX);
    setStartY(clientY);
    setCropPositionTop(clientY);
    setCropPositionLeft(clientX);
    setIsMouseDown(true);
    setBorderWidth(`${windowWidth}px ${windowHeight}px`);
  };

  const handleMoouseUp = () => {
    if (startScreenCapture === false) {
      // return and pass the event to the next element
      return;
    }
    handleClickTakeScreenShot();
    setIsMouseDown(false);
    setBorderWidth(0);
    // reset the startScreenCapture to false
    setStartScreenCapture(false);
  };

  const handleClickTakeScreenShot = async () => {
    const body = document.querySelector('body');
    if (body) {
      const scale = window.devicePixelRatio;

      // Store WebGL canvas contents as image sources
      const webGLCanvases = document.querySelectorAll('canvas');
      const originalSrcs: string[] = [];

      // Save each canvas content as image source
      // Request one more frame render to ensure fresh content
      // This timing is crucial for WebGL canvases with preserveDrawingBuffer=false because it ensures we capture the frame while it's still in the buffer.
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          webGLCanvases.forEach((canvas) => {
            originalSrcs.push(canvas.toDataURL());
          });
          resolve();
        });
      });

      html2canvas(body, {
        scale,
        backgroundColor: null,
        useCORS: true,
        onclone: (document) => {
          // find WebGL canvases in cloned document
          const clonedCanvases = document.querySelectorAll('canvas');
          clonedCanvases.forEach((canvas, index) => {
            // get parent node
            const parentNode = canvas.parentNode;
            // create img element
            const img = document.createElement('img');
            img.src = originalSrcs[index];
            // replace canvas with img
            parentNode?.replaceChild(img, canvas);
          });
          // check the content of the document
          document.querySelectorAll('canvas').forEach((canvas) => {
            console.log(canvas);
          });
        },
      }).then((canvas) => {
        const croppedCanvas = document.createElement('canvas');
        const croppedCanvasContext = croppedCanvas.getContext('2d');

        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft * scale,
            cropPositionTop * scale,
            cropWidth * scale,
            cropHeight * scale,
            0,
            0,
            cropWidth,
            cropHeight
          );
        }

        if (croppedCanvas.toDataURL) {
          const dataURL = croppedCanvas.toDataURL();
          setScreenCaptured(dataURL);
          if (saveScreenshot) {
            // save to file
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'screenshot.png';
            a.click();
          }
        }
      });
    }
    setCrossHairsLeft(0);
    setCrossHairsTop(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMoouseUp}
    >
      <div
        className={`min-w-100 relative flex w-screen ${
          startScreenCapture ? 'h-screen' : 'h-full'
        } flex-row items-start border-none ${className}`}
      >
        {children}
      </div>
      {startScreenCapture && (
        <>
          <div
            className={`z-[2147483645] fixed top-0 left-0 w-full h-full bg-gray-50 bg-opacity-50 ${
              isMouseDown &&
              'bg-transparent border-solid border-gray-50 border-opacity-50 bg-opacity-0'
            }`}
            style={{ borderWidth: `${borderWidth}` }}
          />
        </>
      )}
    </div>
  );
}
