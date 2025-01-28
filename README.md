# OpenAssistant

[Documentation](https://openassistant-doc.vercel.app) | 
[Playground](https://openassistant-playground.vercel.app)

Looking to supercharge your React applications with AI capabilities? Meet OpenAssistant - your new favorite tool for seamlessly integrating AI power into existing React apps without the hassle.

Unlike general-purpose chatbot library, OpenAssistant takes a different approach. It's specifically engineered to be the bridge between Large Language Models (LLMs) and your application's functionality. Think of it as your application's AI co-pilot that can not only chat with users but also execute complex tasks by leveraging your app's features and external AI plugins.

Check out the following examples using OpenAssistant in action:
| kepler.gl AI Assistant (kepler.gl) |  GeoDa.AI AI Assistant (geoda.ai)    |
|----|----|
| [<img width="215" alt="Screenshot 2024-12-08 at 9 12 22 PM" src="https://github.com/user-attachments/assets/edc11aee-8945-434b-bec9-cc202fee547c">](https://kepler.gl) |  [<img width="240" alt="Screenshot 2024-12-08 at 9 13 43 PM" src="https://github.com/user-attachments/assets/de418af5-7663-48fb-9410-74b4750bc944">](https://geoda.ai) |

## 🌟 Features

- 🤖 **Multiple AI Provider Support**
  - DeepSeek (Chat and Reasoner)
  - OpenAI (GPT models)
  - Google Gemini
  - Ollama (local AI models)
- 🎯 **Advanced Capabilities**
  - Take screenshot to ask [[Demo]](https://geoda.ai/img/highlight-screenshot.mp4)
  - Talk to ask [[Demo]](https://geoda.ai/img/highlight-ai-talk.mp4)
  - Function calling support [[Demo]](https://geoda.ai/img/highlight-prompt.mp4)
- 🌟 **AI Assistant Plugins**
  - DuckDB: in-browser query data using duckdb via prompt
  - ECharts: visualize data using echarts via prompt
  - GeoDa: apply spatial data analysis using geoda wasm via prompt
- 🎨 **Customizable UI Components**
  - Pre-built chat interface
  - Pre-built LLM configuration interface
  - Screenshot wrapper for your app
  - Theme support
- 📦 **Easy Integration**
  - CLI tool for adding components
  - TypeScript support
  - Tailwind CSS integration

## 📦 Installation

```bash
# Install the core package
npm install @openassistant/core @openassistant/ui 
```

## 🚀 Quick Start

```jsx
import { AiAssistant } from '@openassistant/ui';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      enableVoice={true}
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```

To use the `Screenshot to Ask` feature, you just need to wrap your app with `ScreenshotWrapper` and pass the `startScreenCapture` and `screenCapturedBase64` to the `AiAssistant` component using e.g. redux state. See an example in kepler.gl: [app.tsx](https://github.com/keplergl/kepler.gl/blob/master/examples/demo-app/src/app.tsx) and [assistant-component.tsx](https://github.com/keplergl/kepler.gl/blob/master/src/ai-assistant/src/components/ai-assistant-component.tsx).

Below is a simple example.

```jsx
import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <>
      <ScreenshotWrapper
          setScreenCaptured={setScreenCaptured}
          startScreenCapture={startScreenCapture}
          setStartScreenCapture={setStartScreenCapture}
        >
          <div className="h-[600px] w-[400px] m-4">
            <AiAssistant
              modelProvider="openai"
              model="gpt-4"
              apiKey="your-api-key"
              welcomeMessage="Hello! How can I help you today?"
              enableVoice={true}
              enableScreenCapture={true}
              screenCapturedBase64={screenCaptured}
              onScreenshotClick={() => setStartScreenCapture(true)}
              onRemoveScreenshot={() => setScreenCaptured('')}
            />
        </div>
      </ScreenshotWrapper>
    </>
  );
}
```

For project with tailwindcss, you can add the following to your tailwind.config.js file:

```js
import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```

## 📚 Packages

- **@openassistant/ui**: Pre-built chat UI components
- **@openassistant/core**: Core functionality and hooks
- **@openassistant/cli**: CLI tool for adding components to your project
- **@openassistant/duckdb**: DuckDB integration for data querying
- **@openassistant/geoda**: GeoDa integration for spatial data analysis
- **@openassistant/echarts**: ECharts integration for data visualization

## 🛠️ Using the CLI

Add the chat components to your React project:

```bash
npx add-ai-chat
```

The CLI will help you set up the components and required dependencies.

## 🔧 Dependencies

Your project have these dependencies:

- react
- @langchain/core
- @langchain/google-genai
- @langchain/ollama
- @langchain/openai
- html2canvas
- next-themes
- @nextui-org/react
- framer-motion

## 📖 Documentation

For detailed documentation and examples, visit our package-specific READMEs:

- [Core Package](packages/core/README.md)
- [UI Components](packages/ui/README.md)
- [CLI Tool](cli/README.md)
- [DuckDB Addon](packages/duckdb/README.md)
- [GeoDa Addon](packages/duckdb/README.md)
- [eCharts Addon](packages/duckdb/README.md)

## 🎯 Examples

Check out our example projects:
- [Simple React Example](examples/simple_react/README.md)
- [React with TailwindCSS Example](examples/react_tailwind/README.md)

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)
