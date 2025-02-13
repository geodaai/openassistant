'use client';

import ChatContainer from './chat-container';
import GridLayout from './grid-layout';

export default function Main({
  className,
  screenCaptured,
  setScreenCaptured,
  setStartScreenCapture,
}: {
  className: string;
  screenCaptured: string;
  setScreenCaptured: (screenCaptured: string) => void;
  setStartScreenCapture: (startScreenCapture: boolean) => void;
}) {
  return (
    <div className={className}>
      <div className="min-w-100 relative flex h-full w-screen flex-row items-start border-none">
        <div className="flex h-full flex-1 flex-grow flex-col overflow-auto">
          <div className="flex-1 flex-grow p-4">
            <GridLayout />
          </div>
        </div>
        <ChatContainer
          className="min-w-[450px] w-[450px] p-4"
          screenCaptured={screenCaptured}
          setStartScreenCapture={setStartScreenCapture}
          setScreenCaptured={setScreenCaptured}
        />
      </div>
    </div>
  );
}
