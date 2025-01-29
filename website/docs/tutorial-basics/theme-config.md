---
sidebar_position: 2
---

# Theme Configuration

import assistantDark from '../../static/img/getstart-dark.png';

OpenAssistant UI supports both light and dark themes out of the box with e.g. [next-themes](https://github.com/pacocoursey/next-themes). This guide will show you how to configure themes in your application.

## Basic Theme Setup

###  Wrap Your Component with ThemeProvider

To enable theme support, wrap your component with the `ThemeProvider` from next-themes:

```js
import { AiAssistant } from '@openassistant/ui';
import { ThemeProvider } from 'next-themes';
function App() {
  return (
    <ThemeProvider attribute="class">
      <AiAssistant
        modelProvider="openai"
        model="gpt-4"
        apiKey="your-api-key"
        welcomeMessage="Hello! How can I help you today?"
      />
    </ThemeProvider>
  );
}
```

## Force a Specific Theme

You can force a specific theme using the `forcedTheme` prop:

### Light Theme

```js
<ThemeProvider attribute="class" forcedTheme="light">
  <AiAssistant {...assistantProps} />
</ThemeProvider>
```

### Dark Theme

```js
<ThemeProvider attribute="class" forcedTheme="dark">
  <AiAssistant {...assistantProps} />
</ThemeProvider>
```

<img src={assistantDark} alt="Assistant UI" width={400} />
## Theme Provider Options

The `ThemeProvider` component accepts several props to customize its behavior:

| Prop           | Type    | Description                                                             |
| -------------- | ------- | ----------------------------------------------------------------------- |
| `attribute`    | string  | The HTML attribute to apply the theme with. Use `"class"` for Tailwind. |
| `defaultTheme` | string  | The theme to use on first load before preferences are synced.           |
| `forcedTheme`  | string  | Force a specific theme and disable switching.                           |
| `enableSystem` | boolean | Enable automatic system theme detection.                                |

## Component-Specific Theming

When using the dark theme, make sure to pass the `theme="dark"` prop to the AiAssistant component to ensure proper styling of charts, maps, and other visualizations:

```js
<ThemeProvider attribute="class" forcedTheme="dark">
  <AiAssistant
    {...assistantProps}
    theme="dark" // Enable dark mode for visualizations
  />
</ThemeProvider>
```

### Working with TailwindCSS

First, ensure your `tailwind.config.js` has the correct configuration for dark mode and content paths:

```js
import { nextui } from '@nextui-org/react';
// @type {import('tailwindcss').Config}
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


## CSS Considerations

If you're using the default styles without Tailwind, make sure to import the CSS:

```js
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';
```

This will ensure proper styling for both light and dark themes.

