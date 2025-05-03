import { AiAssistant } from '@openassistant/ui';
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <div style={{ width: '400px', height: '800px', margin: '20px' }}>
      <AiAssistant
        name="My Assistant"
        apiKey={process.env.REACT_APP_OPENAI_API_KEY}
        version="v1"
        modelProvider="openai"
        model="gpt-3.5-turbo"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
        theme='dark'
      />
    </div>
  );
}

export default App;
