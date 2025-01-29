---
sidebar_position: 3
---

# Screen Capture Within your Application

import screencapture from '../../static/img/screenshot-dark.png';

The Screen Capture feature enables users to take screenshots within your application and ask questions about specific UI elements or issues. This guide will walk you through the implementation and usage.

<img src={screencapture} alt="Screen Capture" width={400} />

## Installation

```bash
yarn add @openassistant/core @openassistant/ui @nextui-org/react framer-motion html2canvas
```

## Basic Implementation

### 1. Wrap Your Application

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

### 2. Add the AI Assistant

Integrate the AI Assistant component with screen capture capabilities:

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

## Advanced Configuration

### Customization Options

```jsx
<ScreenshotWrapper
  setScreenCaptured={setScreenCaptured}
  startScreenCapture={startScreenCapture}
  setStartScreenCapture={setStartScreenCapture}
  saveScreenshot={false} // Enable automatic download
  className="custom-wrapper-class"
/>
```

### Event Handling

```jsx
<AiAssistant
  // ... other props
  onScreenshotClick={() => {
    setStartScreenCapture(true);
    console.log('Screenshot capture started');
  }}
  onRemoveScreenshot={() => {
    setScreenCaptured('');
    console.log('Screenshot removed');
  }}
/>
```

## Common Use Cases

1. **Technical Support**
   - Capture error messages
   - Highlight UI issues
   - Document unexpected behavior

2. **Data Analysis**
   - Screenshot charts and graphs
   - Capture data visualizations
   - Ask questions about specific data points

3. **UI/UX Feedback**
   - Get explanations about interface elements
   - Request design improvement suggestions
   - Document accessibility concerns

## Technical Notes

- **WebGL Support**: Special handling ensures proper capture of WebGL canvases and dynamic content
- **Error Handling**: Built-in error management with user-friendly feedback
- **Accessibility**: ARIA labels and keyboard support included

