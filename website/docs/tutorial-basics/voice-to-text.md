---
sidebar_position: 4
---

# Voice-to-Text

import microphonePermission from '../../static/img/voice-light.png';

Enhance your React applications with seamless voice-to-text capabilities using the **OpenAssistant UI** component. This tutorial will guide you through the steps to integrate and utilize the voice-to-text feature, enabling users to interact with your AI assistant using their voice.

## Installation

First, install the required packages for OpenAssistant UI and its dependencies.

If you're using **Yarn**, you can run:

```bash
yarn add @openassistant/ui @openassistant/core
yarn add -D @nextui-org/react framer-motion
```

## Basic Setup

Integrate the OpenAssistant UI component into your React application. See the [Getting Started](../intro) guide for more information.

## Enabling Voice-to-Text

To enable the voice-to-text feature, you'll need to pass additional props to the `AiAssistant` component. These props allow users to record their voice, which will be converted to text and sent to the AI assistant.

```js
import { AiAssistant } from '@openassistant/ui';

<AiAssistant {...assistantProps} enableVoice={true} />;
```

### Browser Permissions

When using the voice-to-text feature for the first time, users will be prompted to grant microphone access. The browser will display a permission dialog that looks like this:

<img src={microphonePermission} width="400" alt="Microphone Permission Dialog" />
Users can choose from three options:
- **Allow while visiting the site**: Grants temporary microphone access
- **Allow this time**: Grants one-time microphone access
- **Never allow**: Blocks microphone access

Then, the user can start recording their voice. User can stop recording by clicking the stop button or by clicking the microphone icon again. The text will be translated by LLM and displayed in the input box.

This feature is only available with certain AI providers:

- OpenAI (using Whisper model)
- Google (using Gemini)
- Not supported in Ollama or DeepSeek

If using an unsupported provider, you'll receive a "Method not implemented" error.

Ensure you're using a compatible model configuration before enabling voice features.

## Conclusion

Integrating the voice-to-text feature into your OpenAssistant UI component can significantly enhance user interaction by allowing natural voice commands. By following this tutorial, you can set up, customize, and test the voice capabilities in your React application effectively.

For more advanced configurations and features, refer to the [OpenAssistant Documentation](https://openassistant-doc.vercel.app).

---

Happy Coding! 🚀
