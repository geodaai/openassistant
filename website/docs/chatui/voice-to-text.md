---
sidebar_position: 4
---

# Voice-to-Text

The voice-to-text feature allows users to record their voice, which will be converted to text using the LLM.

import microphonePermission from '../../static/img/voice-light.png';

<img src={microphonePermission} width="400" alt="Microphone Permission Dialog" />

## Installation

```bash
npm install @openassistant/ui
```

## Usage

To enable the voice-to-text feature, you need to set the `enableVoice` prop to `true`.

```js
import { AiAssistant } from '@openassistant/ui';

<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey={process.env.OPENAI_API_KEY}
  welcomeMessage="How can I assist you today?"
  enableVoice={true}
/>;
```

### User Guide

When using the voice-to-text feature for the first time, users will be prompted to grant microphone access. The browser will display a permission dialog that looks like this:

Users can choose from three options:

- **Allow while visiting the site**: Grants temporary microphone access
- **Allow this time**: Grants one-time microphone access
- **Never allow**: Blocks microphone access

Then, user can start recording their voice. User can stop recording by clicking the stop button or by clicking the microphone icon again. The text will be translated by LLM and displayed in the input box.

This feature is only available with certain AI providers:

- OpenAI (using Whisper model)
- Google (using Gemini)

If using an unsupported provider, you'll receive a "Method not implemented" error.
