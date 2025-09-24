import * as fs from 'fs';
import * as path from 'path';

// Types for the embeddings data
interface CityName {
  index: number;
  name: string;
  filePath: string;
  processedName: string;
}

interface CityEmbeddings {
  embeddings: Record<string, number>[];
  cityNames: CityName[];
  metadata: {
    totalCities: number;
    generatedAt: string;
    method: string;
  };
}

// Simple text preprocessing - normalize hyphens and spaces for better matching
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Keep hyphens
    .replace(/[-_]/g, ' ') // Convert hyphens and underscores to spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Create simple embedding using character bigrams
function createSimpleEmbedding(text: string): Record<string, number> {
  const processed = preprocessText(text);
  const ngrams = getNGrams(processed, 2);
  const embedding: Record<string, number> = {};
  
  ngrams.forEach(gram => {
    embedding[gram] = (embedding[gram] || 0) + 1;
  });
  
  return embedding;
}

// Get character n-grams
function getNGrams(text: string, n: number = 2): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= text.length - n; i++) {
    grams.push(text.slice(i, i + n));
  }
  return grams;
}

// Calculate cosine similarity between two embeddings
function cosineSimilarity(embedding1: Record<string, number>, embedding2: Record<string, number>): number {
  const keys1 = Object.keys(embedding1);
  const keys2 = Object.keys(embedding2);
  const allKeys = new Set([...keys1, ...keys2]);
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (const key of allKeys) {
    const val1 = embedding1[key] || 0;
    const val2 = embedding2[key] || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Cache for loaded embeddings
let cachedEmbeddings: CityEmbeddings | null = null;

// Load embeddings from JSON file
function loadEmbeddings(): CityEmbeddings {
  if (cachedEmbeddings) {
    return cachedEmbeddings;
  }
  
  const embeddingsPath = path.join(__dirname, 'script', 'city_embeddings.json');
  
  try {
    const data = fs.readFileSync(embeddingsPath, 'utf8');
    cachedEmbeddings = JSON.parse(data) as CityEmbeddings;
    return cachedEmbeddings;
  } catch (error) {
    throw new Error(`Failed to load city embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Find cities by state/city format (e.g., "az/chandler")
 * This is the recommended approach for optimal accuracy and performance.
 * @param input - The input string in "state/city" format
 * @param topK - Number of top similar cities to return (default: 1)
 * @returns Array of similar cities with their file paths and similarity scores
 */
export function findCitiesByStateCity(input: string, topK: number = 1): Array<{
  name: string;
  filePath: string;
  similarity: number;
  index: number;
}> {
  // Parse "state/city" format
  const [stateAbbr, cityName] = input.split('/');
  
  if (!stateAbbr || !cityName) {
    throw new Error('Invalid format. Expected "state/city" (e.g., "az/chandler")');
  }
  
  const { embeddings, cityNames } = loadEmbeddings();
  
  // Filter by state first for better performance and accuracy
  const stateFiltered = cityNames.filter(city => 
    city.filePath.startsWith(stateAbbr.toLowerCase() + '/')
  );
  
  if (stateFiltered.length === 0) {
    throw new Error(`No cities found for state: ${stateAbbr}`);
  }
  
  // Create embedding for the city name
  const queryEmbedding = createSimpleEmbedding(cityName);
  
  // Calculate similarities only within the state
  const similarities = stateFiltered.map(city => {
    const cityIndex = cityNames.indexOf(city);
    return {
      ...city,
      similarity: cosineSimilarity(queryEmbedding, embeddings[cityIndex])
    };
  });
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Find the most similar city and return its JSON file name
 * @param input - The input string in "state/city" format
 * @returns The JSON file name of the most similar city
 */
export function findMostSimilarCityFile(input: string): string {
  const results = findCitiesByStateCity(input, 1);
  
  if (results.length === 0) {
    throw new Error('No similar cities found');
  }
  
  return results[0].filePath;
}

/**
 * Get city information by file path
 * @param filePath - The file path of the city
 * @returns City information or null if not found
 */
export function getCityByFilePath(filePath: string): CityName | null {
  const { cityNames } = loadEmbeddings();
  return cityNames.find(city => city.filePath === filePath) || null;
}

/**
 * Get all cities in a specific state
 * @param stateAbbr - Two-letter state abbreviation (e.g., "az", "ca")
 * @returns Array of cities in the state
 */
export function getCitiesInState(stateAbbr: string): CityName[] {
  const { cityNames } = loadEmbeddings();
  return cityNames.filter(city => 
    city.filePath.startsWith(stateAbbr.toLowerCase() + '/')
  );
}

/**
 * Validate state abbreviation
 * @param stateAbbr - Two-letter state abbreviation
 * @returns True if state exists in the data
 */
export function isValidState(stateAbbr: string): boolean {
  const { cityNames } = loadEmbeddings();
  return cityNames.some(city => 
    city.filePath.startsWith(stateAbbr.toLowerCase() + '/')
  );
}

// Legacy functions for backward compatibility (deprecated)
/**
 * @deprecated Use findCitiesByStateCity instead for better accuracy
 */
export function findSimilarCities(inputString: string, topK: number = 1): Array<{
  name: string;
  filePath: string;
  similarity: number;
  index: number;
}> {
  const { embeddings, cityNames } = loadEmbeddings();
  const queryEmbedding = createSimpleEmbedding(inputString);
  
  const similarities = cityNames.map((city, index) => ({
    ...city,
    similarity: cosineSimilarity(queryEmbedding, embeddings[index])
  }));
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * @deprecated Use findCitiesByStateCity instead for better accuracy
 */
export function searchCitiesByName(searchTerm: string, exact: boolean = false): CityName[] {
  const { cityNames } = loadEmbeddings();
  const processedSearchTerm = preprocessText(searchTerm);
  
  return cityNames.filter(city => {
    if (exact) {
      return city.processedName === processedSearchTerm;
    } else {
      return city.processedName.includes(processedSearchTerm) || 
             city.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
}

// Export utility functions
export {
  createSimpleEmbedding,
  cosineSimilarity,
  preprocessText
};
