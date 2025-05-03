import { createAssistant } from '@openassistant/core';
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Initializing OpenAssistant CLI...');

  // Create the assistant instance
  const assistant = await createAssistant({
    name: 'cli-assistant',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    version: '0.0.1',
    instructions: 'You are a helpful CLI assistant that provides clear and concise responses.',
  });

  console.log('OpenAssistant CLI is ready!');
  console.log('Type "exit" or "quit" to end the conversation.\n');

  while (true) {
    const userInput = readlineSync.question('You: ');

    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log('Goodbye!');
      break;
    }

    try {
      console.log('\nAssistant: ');
      await assistant.processTextMessage({
        textMessage: userInput,
        streamMessageCallback: ({ isCompleted, message }) => {
          if (isCompleted) {
            process.stdout.write(message.text);
            process.stdout.write('\n\n');
          }
        },
      });
    } catch (error) {
      console.error('\nError:', error.message);
    }
  }
}

main().catch(console.error);