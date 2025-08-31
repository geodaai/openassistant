// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export * from './tool';
export * from './tool-cache';
export * from './vercel-tool';
export * from './langchain-tool';
export * from './cache';
export * from './geojson';
export * from './format';
export * from './tool-output-manager';
export * from './conversation-cache';

// New provider-based architecture (Composio style)
export * from './openassistant';
export * from './providers';

// Export examples for reference
export * from './examples/simple-example';
export * from './examples/usage-examples';
export * from './examples/composio-style-example';
export * from './examples/langchain-integration-example';

export function generateId() {
  // generate a random id with 10 characters
  return Math.random().toString(36).substring(2, 15);
}
