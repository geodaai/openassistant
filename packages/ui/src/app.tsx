import { useState } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';

import { AiAssistant } from './components/assistant';
import { ScreenshotWrapper } from './components/screenshot-wrapper';

// Add ThemeToggle component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="fixed top-4 right-4 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}

export function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div>
        <ScreenshotWrapper
          setScreenCaptured={setScreenCaptured}
          startScreenCapture={startScreenCapture}
          setStartScreenCapture={setStartScreenCapture}
        >
          <ThemeToggle />
          <div className="h-[600px] w-[400px] pb-4 m-4 rounded-lg border border-gray-100 dark:border-gray-900">
            <AiAssistant
              name="my-assistant"
              description="This is my assistant"
              version="0.0.1"
              modelProvider="ollama"
              model="llama3.2"
              apiKey=""
              welcomeMessage="Hi, I am your assistant. How can I help you today?"
              instructions=""
              enableVoice={true}
              enableScreenCapture={true}
              screenCapturedBase64={screenCaptured}
              onScreenshotClick={() => setStartScreenCapture(true)}
              onRemoveScreenshot={() => setScreenCaptured('')}
            />
          </div>
        </ScreenshotWrapper>
      </div>
    </ThemeProvider>
  );
}
