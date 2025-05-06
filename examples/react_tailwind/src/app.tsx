import React from 'react';
import { AiAssistant } from '@openassistant/ui';

export function App() {
  return (
    <div className="w-[800px] h-[800px] m-4 rounded-lg shadow-lg p-6">
      <AiAssistant
        name="My Assistant"
        apiKey={process.env.OPENAI_API_KEY || ''}
        modelProvider="openai"
        model="gpt-4"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
      />
    </div>
  );
}
