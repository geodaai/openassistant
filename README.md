# OpenAssistant

[Documentation](https://openassistant-doc.vercel.app) |
[Playground](https://openassistant-playground.vercel.app)

Looking to supercharge your React applications with AI capabilities? Meet OpenAssistant - your new favorite tool for seamlessly integrating AI power into existing React apps without the hassle.

Unlike general-purpose chatbot library, OpenAssistant takes a different approach. It's specifically engineered to be the bridge between Large Language Models (LLMs) and your application's functionality. Think of it as your application's AI co-pilot that can not only chat with users but also execute complex tasks by leveraging your app's features and external AI plugins.

Check out the following examples using OpenAssistant in action:
| kepler.gl AI Assistant (kepler.gl) | GeoDa.AI AI Assistant (geoda.ai) |
|----|----|
| [<img width="215" alt="Screenshot 2024-12-08 at 9 12 22 PM" src="https://github.com/user-attachments/assets/edc11aee-8945-434b-bec9-cc202fee547c">](https://kepler.gl) | [<img width="240" alt="Screenshot 2024-12-08 at 9 13 43 PM" src="https://github.com/user-attachments/assets/de418af5-7663-48fb-9410-74b4750bc944">](https://geoda.ai) |


<video width="100%" controls>
  <source src="https://location.foursquare.com/wp-content/uploads/sites/2/2025/01/kepler-gl-ai-assistant_7f53ec.mp4" type="video/mp4">
</video>

[[Source]](https://location.foursquare.com/resources/blog/products/foursquare-brings-enterprise-grade-spatial-analytics-to-your-browser-with-kepler-gl-3-1/)

## 🌟 Features

- 🤖 **Multiple AI Provider Support**
  - DeepSeek (Chat and Reasoner)
  - OpenAI (GPT models)
  - Google Gemini
  - Ollama (local AI models)
  - XAI Grok
  - Anthropic Claude*
  - AWS Bedrock*
  - Azure OpenAI*
> * via server API only

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

See the [tutorial](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-config-ui) for more details.

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

See the [tutorial](https://openassistant-doc.vercel.app/docs/tutorial-basics/screencapture) for more details.

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

## 🎯 How to use

OpenAssistant provides a new way that allows users to interact with the data and your application in a natural and creative way.

### 📸 Take a Screenshot to Ask

This feature enables users to capture a screenshot anywhere within kepler.gl application and ask questions about the screenshot.

For example:
- users can take a screenshot of the map (or partial of the map) and ask questions about the map e.g. _`how many counties are in this screenshot`_, 
- or take a screenshot of the configuration panel and ask questions about how to use it, e.g. _`How can I adjust the parameters in this panel`_. 
- users can even take a screenshot of the plots in the chat panel and ask questions about the plots e.g. _`Can you give me a summary of the plot?`_.

![Screenshot to ask](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-screenshot.png 'Screenshot to ask')

#### How to use this feature?

1. Click the "Screenshot to Ask" button in the chat interface
2. A semi-transparent overlay will appear
3. Click and drag to select the area you want to capture
4. Release to complete the capture
5. The screenshot will be displayed in the chat interface
6. You can click the x button on the top right corner of the screenshot to delete the screenshot

### 🗣️ Talk to Ask

This feature enables users to "talk" to the AI assistant. After clicking the "Talk to Ask" button, users can start talking using microphone. When clicking the same button again, the AI assistant will stop listening and send the transcript to the input box.

When using the voice-to-text feature for the first time, users will be prompted to grant microphone access. The browser will display a permission dialog that looks like this:

![Talk to ask](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-talk-to-ask.png 'Talk to ask')

After granting access, users can start talking to the AI assistant.

### 📚 Function Calling Support

#### 🤖 Why use LLM function tools?

Function calling enables the AI Assistant to perform specialized tasks that LLMs cannot handle directly, such as complex calculations, data analysis, visualization generation, and integration with external services. This allows the assistant to execute specific operations within your application while maintaining natural language interaction with users.

#### 🔒 Is my data secure?

Yes, the data you used in your application stays within the browser, and will **never** be sent to the LLM. Using function tools, we can engineer the AI assistant to use only the meta data for function calling, e.g. the name of the dataset, the name of the layer, the name of the variables, etc. Here is a process diagram to show how the AI assistant works:

![AI Assistant Diagram](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-diagram.png 'AI Assistant Diagram')

### How to create a function tool?

OpenAssistant provides great type support to help you create function tools. You can create a function tool by following the tutorial [here](<[https://openassistant-doc.vercel.app/tutorial-basics/add-function-tool](https://openassistant-doc.vercel.app/docs/tutorial-basics/function-call)>).

OpenAssistant also provides plugins for function tools, which you can use in your application with just a few lines of code. For example,

- the [DuckDB plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to query your data using DuckDB. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/duckdb-plugin).
- the [ECharts plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to visualize data using ECharts. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/echarts-plugin).
- the [Kepler.gl plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to create beautiful maps. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/keplergl-plugin).
- the [GeoDa plugin](https://openassistant-doc.vercel.app/docs/tutorial-basics/add-function-tool) allows the AI assistant to apply spatial data analysis using GeoDa. See a tutorial [here](https://openassistant-doc.vercel.app/docs/tutorial-extras/geoda-plugin).

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
- @ai-sdk/deepseek
- @ai-sdk/google
- @ai-sdk/openai
- @ai-sdk/xai
- ollama-ai-provider
- openai
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
