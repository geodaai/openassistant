'use client';

import { useChat } from 'ai/react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4 text-center">WebSearch Example</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Ask questions and the AI will search the web for you!
      </p>
      
      <div className="space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 text-blue-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Ask me anything... (e.g., 'Search for information about AI')"
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Send'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>Example queries:</p>
        <ul className="list-disc list-inside mt-1">
          <li>"Search for information about artificial intelligence"</li>
          <li>"Find the latest news about climate change"</li>
          <li>"Search for redfin 4440 S Oleander Dr Chandler AZ"</li>
        </ul>
      </div>
    </div>
  );
} 