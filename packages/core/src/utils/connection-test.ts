import { generateText, LanguageModelV1 } from 'ai';

export async function testConnection(llm: LanguageModelV1): Promise<boolean> {
  const { finishReason } = await generateText({
    model: llm,
    prompt: 'Hello, world!',
  });

  if (finishReason !== 'stop') {
    return false;
  }
  return true;
}
