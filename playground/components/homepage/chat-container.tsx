'use client';

import { cn } from '@nextui-org/react';
import dynamic from 'next/dynamic';

const Assistant = dynamic(() => import('../chat/assistant'), {
  ssr: false
});

export default function ChatContainer({
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
    <div
      className={cn(
        'relative flex h-full flex-row',
        className
      )}
    >
      <div className="flex h-full flex-1 flex-grow flex-col overflow-auto rounded-lg bg-gray-50">
        <Assistant
          screenCaptured={screenCaptured}
          setScreenCaptured={setScreenCaptured}
          setStartScreenCapture={setStartScreenCapture}
        />
      </div>
    </div>
  );
}
