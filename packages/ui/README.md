# OpenAssistant UI

## @openassistant/ui

The chat UI for OpenAssistant.

### Usage

```jsx
import { AiAssistant } from '@openassistant/ui';
import '@openassistant/ui/dist/styles.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```

The following dependencies are required:

- @ai-sdk/core
- @ai-sdk/google
- @ai-sdk/openai
- @ai-sdk/xai
- ollama-ai-provider
- html2canvas

### Installation

```bash
yarn add @openassistant/ui @ai-sdk/core @ai-sdk/google @ai-sdk/openai @ai-sdk/xai ollama-ai-provider html2canvas 
```

### Using the source files directly

If your project is using tailwindcss, you can install the source files of the chat component using @openassistant/cli.
Yes, just like Shadcn UI, so you can customize the components to your needs.

```bash
npx add-ai-chat
```

The CLI will prompt you for:

- Target directory for the components
- Whether you're using TypeScript

#### Components Added

- AiAssistant
- ScreenshotWrapper

You will need to install the following dependencies:

- @ai-sdk/core
- @ai-sdk/google
- @ai-sdk/openai
- @ai-sdk/xai
- ollama-ai-provider
- html2canvas
- react-audio-voice-recorder
- @nextui-org/react
- framer-motion
- next-themes

```bash
yarn add @ai-sdk/core @ai-sdk/google @ai-sdk/openai @ai-sdk/xai ollama-ai-provider html2canvas @nextui-org/react framer-motion next-themes react-audio-voice-recorder
```

You will need to add the following to your `tailwind.config.js`:

```js
const { nextui } = require("@nextui-org/react");

module.exports = {
  darkMode: "class",
  content: [
    ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
```

Then, you can use the components in your project.

```jsx
import { AiAssistant } from './components/assistant';
function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```
