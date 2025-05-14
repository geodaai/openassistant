# Getting Started with OpenAssistant in React with TailwindCSS

This tutorial shows how to use **OpenAssistant** in a React project that includes **TailwindCSS** for styling.

## Instructions

### 1. Install Dependencies

To use OpenAssistant in your React project, install the required packages:

```bash
yarn add @openassistant/ui
```

If you haven't already set up TailwindCSS in your React project, follow these steps to install and configure it:

```javascript
import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    // your content here
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

### 2. Add the OpenAssistant Chat Component to Your App

Here’s how to use the `Assistant` component from OpenAssistant:

```jsx
import { Assistant } from '@openassistant/ui';

function App() {
  return (
    <div className="w-[400px] h-[800px] m-5">
      <Assistant
        name="My Assistant"
        apiKey=""
        version="v1"
        modelProvider="ollama"
        model="llama3.1"
        baseUrl="http://127.0.0.1:11434"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
        functions={[]}
      />
    </div>
  );
}

export default App;
```

### 3. Run the Project

Start your React project with:

```bash
yarn start
```

You should now see the OpenAssistant UI rendered in your React app styled with TailwindCSS.

<img width="300" alt="" src="https://github.com/user-attachments/assets/9875ac6f-f903-482b-a9ab-0a366fffec0a" />
