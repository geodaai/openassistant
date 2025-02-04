import { getEncoding, Tiktoken, TiktokenEncoding } from 'js-tiktoken';

const MODEL_PREFIX_TO_ENCODING: Record<string, TiktokenEncoding> = {
  'gpt-4': 'cl100k_base',
  'gpt-3.5': 'cl100k_base',
  'gpt-35': 'cl100k_base', // Some APIs use this format
  'text-embedding-ada': 'cl100k_base',
  'text-davinci': 'p50k_base',
  davinci: 'p50k_base',
  curie: 'p50k_base',
  babbage: 'p50k_base',
  ada: 'p50k_base',
} as const;

export function encodingForModel(modelName: string): Tiktoken {
  // Find the matching encoding name based on model prefix
  const encodingName = Object.entries(MODEL_PREFIX_TO_ENCODING).find(
    ([prefix]) => modelName.toLowerCase().startsWith(prefix)
  )?.[1];

  if (!encodingName) {
    throw new Error(
      `Model ${modelName} not found. Please ensure you're using a supported model.`
    );
  }

  // Get the encoding for the model
  return getEncoding(encodingName);
}
