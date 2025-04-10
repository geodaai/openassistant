---
sidebar_position: 3
---

# Screen Capture

import screencapture from '../../static/img/screenshot-dark.png';

The Screen Capture feature allows users to take screenshots within your application and ask questions about specific UI elements or issues. This guide will walk you through the implementation and usage.

<img src={screencapture} alt="Screen Capture" width={400} />

## Installation

```bash
npm install @openassistant/ui
```

## Usage 

First, wrap your application with the `ScreenshotWrapper` component:

```jsx
import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';
import { useState } from 'react';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <YourAppContent />
    </ScreenshotWrapper>
  );
}
```

Integrate the AI Assistant component with screen capture capabilities by setting the following props:

- `enableScreenCapture`: Enable screen capture
- `screenCapturedBase64`: The base64 encoded screenshot
- `onScreenshotClick`: The callback function when the user clicks the screenshot button
- `onRemoveScreenshot`: The callback function when the user removes the screenshot

```jsx
<AiAssistant
  modelProvider="openai"
  model="gpt-4"
  apiKey={process.env.OPENAI_API_KEY}
  welcomeMessage="How can I assist you today?"
  enableScreenCapture={true}
  screenCapturedBase64={screenCaptured}
  onScreenshotClick={() => setStartScreenCapture(true)}
  onRemoveScreenshot={() => setScreenCaptured('')}
/>
```

## User Guide

### Taking Screenshots

1. Click the "Screenshot to Ask" button in the chat interface
2. A semi-transparent overlay will appear
3. Click and drag to select the area you want to capture
4. Release to complete the capture

### Asking Questions

1. After capturing, the screenshot will be attached to your next message
2. Type your question about the captured area
3. Send your message to get AI assistance

### Managing Screenshots

- Click the "X" button on the screenshot preview to remove it
- Use `onRemoveScreenshot` callback for programmatic removal

## Other Configuration

You can save the screenshot to a file by setting the `saveScreenshot` prop to `true`.

```jsx
<ScreenshotWrapper
  ...
  setScreenCaptured={setScreenCaptured}
  startScreenCapture={startScreenCapture}
  setStartScreenCapture={setStartScreenCapture}
  saveScreenshot={false} // Enable automatic download
/>
```
