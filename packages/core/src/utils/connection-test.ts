// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { generateText, LanguageModel } from 'ai';

export async function testConnection(llm: LanguageModel): Promise<boolean> {
  const { finishReason } = await generateText({
    model: llm,
    prompt: 'Hello, world!',
  });

  if (finishReason !== 'stop') {
    return false;
  }
  return true;
}
