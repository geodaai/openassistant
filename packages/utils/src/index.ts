export * from './tool';
export * from './vercel-tool';
export * from './cache';
export * from './geojson';
export * from './format';

export function generateId() {
  // generate a random id with 10 characters
  return Math.random().toString(36).substring(2, 15);
}
