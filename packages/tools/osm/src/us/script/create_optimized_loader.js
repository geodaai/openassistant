const fs = require('fs');
const path = require('path');

// Load the ultra-compact embeddings
function loadUltraCompactEmbeddings() {
  const embeddingsPath = path.join(__dirname, 'city_embeddings_ultra.json');
  const data = fs.readFileSync(embeddingsPath, 'utf8');
  return JSON.parse(data);
}

// Convert string embedding back to object
function parseStringEmbedding(embeddingString, vocabulary) {
  const embedding = {};
  
  if (!embeddingString) return embedding;
  
  const pairs = embeddingString.split(',');
  pairs.forEach(pair => {
    const [indexStr, valueStr] = pair.split(':');
    const index = parseInt(indexStr);
    const value = parseInt(valueStr);
    
    if (!isNaN(index) && !isNaN(value) && vocabulary[index]) {
      embedding[vocabulary[index]] = value;
    }
  });
  
  return embedding;
}

// Test the ultra-compact format
function testUltraCompact() {
  console.log('Testing Ultra-Compact Format\n');
  console.log('='.repeat(50));
  
  const ultra = loadUltraCompactEmbeddings();
  const { v: vocabulary, e: embeddings, c: cityNames } = ultra;
  
  console.log(`Vocabulary size: ${vocabulary.length}`);
  console.log(`Cities: ${cityNames.length}`);
  console.log(`Embeddings: ${embeddings.length}`);
  
  // Test a few cities
  const testCities = ['chandler', 'chicago', 'los-angeles'];
  
  testCities.forEach(cityName => {
    const city = cityNames.find(c => c.n === cityName);
    if (!city) {
      console.log(`\n${cityName}: Not found`);
      return;
    }
    
    const cityIndex = cityNames.indexOf(city);
    const embeddingString = embeddings[cityIndex];
    const embedding = parseStringEmbedding(embeddingString, vocabulary);
    
    console.log(`\n${cityName}:`);
    console.log(`  File: ${city.f}`);
    console.log(`  String: ${embeddingString.substring(0, 50)}...`);
    console.log(`  Parsed: ${JSON.stringify(embedding)}`);
    console.log(`  Non-zero values: ${Object.keys(embedding).length}`);
  });
}

// Create a loader function for the ultra-compact format
function createOptimizedLoader() {
  const loaderCode = `
// Optimized loader for ultra-compact embeddings
import * as fs from 'fs';
import * as path from 'path';

interface CityName {
  n: string; // name
  f: string; // filePath
  i: number; // index
}

interface UltraCompactEmbeddings {
  v: string[]; // vocabulary
  e: string[]; // embeddings as strings
  c: CityName[]; // cities
  m: {
    t: number; // totalCities
    g: string; // generatedAt
    s: string; // method
  };
}

// Cache for loaded embeddings
let cachedEmbeddings: UltraCompactEmbeddings | null = null;

// Parse string embedding back to object
function parseStringEmbedding(embeddingString: string, vocabulary: string[]): Record<string, number> {
  const embedding: Record<string, number> = {};
  
  if (!embeddingString) return embedding;
  
  const pairs = embeddingString.split(',');
  pairs.forEach(pair => {
    const [indexStr, valueStr] = pair.split(':');
    const index = parseInt(indexStr);
    const value = parseInt(valueStr);
    
    if (!isNaN(index) && !isNaN(value) && vocabulary[index]) {
      embedding[vocabulary[index]] = value;
    }
  });
  
  return embedding;
}

// Load ultra-compact embeddings
function loadOptimizedEmbeddings(): UltraCompactEmbeddings {
  if (cachedEmbeddings) {
    return cachedEmbeddings;
  }
  
  const embeddingsPath = path.join(__dirname, 'script', 'city_embeddings_ultra.json');
  
  try {
    const data = fs.readFileSync(embeddingsPath, 'utf8');
    cachedEmbeddings = JSON.parse(data) as UltraCompactEmbeddings;
    return cachedEmbeddings;
  } catch (error) {
    throw new Error(\`Failed to load optimized embeddings: \${error instanceof Error ? error.message : 'Unknown error'}\`);
  }
}

// Get embedding for a city
export function getCityEmbedding(cityIndex: number): Record<string, number> {
  const { v: vocabulary, e: embeddings } = loadOptimizedEmbeddings();
  const embeddingString = embeddings[cityIndex];
  return parseStringEmbedding(embeddingString, vocabulary);
}

// Get all city names
export function getAllCityNames(): CityName[] {
  const { c: cityNames } = loadOptimizedEmbeddings();
  return cityNames;
}

// Get cities in state
export function getCitiesInStateOptimized(stateAbbr: string): CityName[] {
  const { c: cityNames } = loadOptimizedEmbeddings();
  return cityNames.filter(city => 
    city.f.startsWith(stateAbbr.toLowerCase() + '/')
  );
}

// Get city by file path
export function getCityByFilePathOptimized(filePath: string): CityName | null {
  const { c: cityNames } = loadOptimizedEmbeddings();
  return cityNames.find(city => city.f === filePath) || null;
}

// Get vocabulary
export function getVocabulary(): string[] {
  const { v: vocabulary } = loadOptimizedEmbeddings();
  return vocabulary;
}

// Get metadata
export function getMetadata() {
  const { m: metadata } = loadOptimizedEmbeddings();
  return metadata;
}
`;

  const outputPath = path.join(__dirname, 'optimized_loader.ts');
  fs.writeFileSync(outputPath, loaderCode);
  console.log(`Created optimized loader: ${outputPath}`);
}

// Run tests and create loader
if (require.main === module) {
  try {
    testUltraCompact();
    createOptimizedLoader();
  } catch (error) {
    console.error('Error:', error);
  }
}
