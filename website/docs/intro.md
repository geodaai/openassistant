---
sidebar_position: 1
---

# Quick Start

Transform Your React Apps with OpenAssistant: The AI Integration Library You've Been Waiting For

Looking to supercharge your React applications with AI capabilities? Meet OpenAssistant - your new favorite tool for seamlessly integrating AI power into existing React apps without the hassle.

Unlike general-purpose chatbots such as ChatGPT or Google Gemini, OpenAssistant takes a different approach. It's specifically engineered to be the bridge between Large Language Models (LLMs) and your application's functionality. Think of it as your application's AI co-pilot that can not only chat with users but also execute complex tasks by leveraging your app's features and external AI plugins.

## **Installation**

Install the core packages using npm:

```bash
npm install @openassistant/core @openassistant/ui
```

### **Dependencies**

The following dependencies are required and should be installed in your project:

<li> react </li>
<li> @ai-sdk/core </li>
<li> @ai-sdk/google </li>
<li> @ai-sdk/openai </li>
<li> @ai-sdk/xai </li>
<li> ollama-ai-provider </li>
<li> html2canvas </li>
<li> next-themes </li>
<li> @nextui-org/react </li>
<li> framer-motion </li>

## **Getting Started**

Here's a basic example of using OpenAssistant in your React app:

```tsx
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

## **Key Features**

OpenAssistant comes with powerful features:

🤖 **Multiple AI Provider Support**
  <li> OpenAI (GPT models) </li>
  <li> Google Gemini </li>
  <li> Ollama (local AI models) </li>

🎯 **Advanced Capabilities**
  <li> Take screenshot to ask </li>
  <li> Talk to ask </li>
  <li> Function calling support </li>

🌟 **AI Assistant Plugins**
  <li> DuckDB: in-browser query data using duckdb via prompt </li>
  <li> ECharts: visualize data using echarts via prompt </li>
  <li> GeoDa: apply spatial data analysis using geoda wasm via prompt </li>

🎨 **Customizable UI Components**
  <li> Pre-built chat interface </li>
  <li> Pre-built LLM configuration interface </li>
  <li> Screenshot wrapper for your app </li>
  <li> Theme support </li>

For more detailed documentation and examples, check out our package-specific guides:

- Core Package Documentation
- UI Components Guide
- CLI Tool Tutorial
- Plugin Documentation (DuckDB, GeoDa, ECharts)
