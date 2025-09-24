const fs = require('fs');
const path = require('path');

// Simple text preprocessing function
function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Simple character n-gram function for basic similarity
function getNGrams(text, n = 2) {
  const grams = [];
  for (let i = 0; i <= text.length - n; i++) {
    grams.push(text.slice(i, i + n));
  }
  return grams;
}

// Create a simple "embedding" using character n-grams
function createSimpleEmbedding(text) {
  const processed = preprocessText(text);
  const ngrams = getNGrams(processed, 2); // Use bigrams
  const embedding = {};
  
  // Count frequency of each n-gram
  ngrams.forEach(gram => {
    embedding[gram] = (embedding[gram] || 0) + 1;
  });
  
  return embedding;
}

// Calculate cosine similarity between two embeddings
function cosineSimilarity(embedding1, embedding2) {
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

// Read city files and generate embeddings
function generateCityEmbeddings() {
  const cityFilesPath = path.join(__dirname, 'cityFiles.txt');
  const cityFiles = fs.readFileSync(cityFilesPath, 'utf8').split('\n').filter(line => line.trim());
  
  const embeddings = [];
  const cityNames = [];
  
  cityFiles.forEach((filePath, index) => {
    // Extract city name from file path (e.g., "ak/anchorage.json" -> "anchorage")
    const cityName = path.basename(filePath, '.json');
    const processedName = preprocessText(cityName);
    
    // Create embedding for the city name
    const embedding = createSimpleEmbedding(processedName);
    
    embeddings.push(embedding);
    cityNames.push({
      index,
      name: cityName,
      filePath: filePath,
      processedName
    });
  });
  
  return { embeddings, cityNames };
}

// Save embeddings to JSON file
function saveEmbeddings() {
  const { embeddings, cityNames } = generateCityEmbeddings();
  
  const data = {
    embeddings,
    cityNames,
    metadata: {
      totalCities: cityNames.length,
      generatedAt: new Date().toISOString(),
      method: 'character-bigram-similarity'
    }
  };
  
  const outputPath = path.join(__dirname, 'city_embeddings.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`Generated embeddings for ${cityNames.length} cities`);
  console.log(`Saved to: ${outputPath}`);
  
  return outputPath;
}

// Test function to find similar cities
function findSimilarCities(query, topK = 5) {
  const { embeddings, cityNames } = generateCityEmbeddings();
  const queryEmbedding = createSimpleEmbedding(query);
  
  const similarities = cityNames.map((city, index) => ({
    ...city,
    similarity: cosineSimilarity(queryEmbedding, embeddings[index])
  }));
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// Main execution
if (require.main === module) {
  try {
    saveEmbeddings();
    
    // Test with a few examples
    console.log('\nTesting similarity search:');
    const testQueries = ['anchorage', 'new york', 'los angeles', 'chicago'];
    
    testQueries.forEach(query => {
      console.log(`\nQuery: "${query}"`);
      const results = findSimilarCities(query, 3);
      results.forEach((result, i) => {
        console.log(`  ${i + 1}. ${result.name} (${result.filePath}) - similarity: ${result.similarity.toFixed(4)}`);
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  generateCityEmbeddings,
  findSimilarCities,
  createSimpleEmbedding,
  cosineSimilarity,
  saveEmbeddings
};
