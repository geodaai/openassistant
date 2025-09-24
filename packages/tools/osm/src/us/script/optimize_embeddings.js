const fs = require('fs');
const path = require('path');

// Load the original embeddings
function loadOriginalEmbeddings() {
  const embeddingsPath = path.join(__dirname, 'city_embeddings.json');
  const data = fs.readFileSync(embeddingsPath, 'utf8');
  return JSON.parse(data);
}

// Create vocabulary from all embeddings
function createVocabulary(embeddings) {
  const vocabSet = new Set();
  
  embeddings.forEach(embedding => {
    Object.keys(embedding).forEach(key => {
      vocabSet.add(key);
    });
  });
  
  const vocabulary = Array.from(vocabSet).sort();
  console.log(`Created vocabulary with ${vocabulary.length} unique bigrams`);
  return vocabulary;
}

// Convert sparse embeddings to dense arrays
function convertToDense(embeddings, vocabulary) {
  const denseEmbeddings = [];
  
  embeddings.forEach(embedding => {
    const dense = new Array(vocabulary.length).fill(0);
    
    Object.entries(embedding).forEach(([key, value]) => {
      const index = vocabulary.indexOf(key);
      if (index !== -1) {
        dense[index] = value;
      }
    });
    
    denseEmbeddings.push(dense);
  });
  
  return denseEmbeddings;
}

// Optimize the embeddings
function optimizeEmbeddings() {
  console.log('Loading original embeddings...');
  const original = loadOriginalEmbeddings();
  
  console.log(`Original size: ${JSON.stringify(original).length} characters`);
  console.log(`Number of cities: ${original.cityNames.length}`);
  
  // Create vocabulary
  console.log('\nCreating vocabulary...');
  const vocabulary = createVocabulary(original.embeddings);
  
  // Convert to dense arrays
  console.log('\nConverting to dense arrays...');
  const denseEmbeddings = convertToDense(original.embeddings, vocabulary);
  
  // Create optimized data structure
  const optimized = {
    vocabulary,
    embeddings: denseEmbeddings,
    cityNames: original.cityNames,
    metadata: {
      ...original.metadata,
      method: 'dense-arrays',
      vocabularySize: vocabulary.length,
      optimizedAt: new Date().toISOString()
    }
  };
  
  // Calculate size reduction
  const originalSize = JSON.stringify(original).length;
  const optimizedSize = JSON.stringify(optimized).length;
  const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  
  console.log(`\nSize comparison:`);
  console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${reduction}%`);
  
  // Save optimized embeddings
  const outputPath = path.join(__dirname, 'city_embeddings_optimized.json');
  fs.writeFileSync(outputPath, JSON.stringify(optimized, null, 0)); // No pretty printing
  
  console.log(`\nSaved optimized embeddings to: ${outputPath}`);
  
  // Test the optimized embeddings
  testOptimizedEmbeddings(optimized);
  
  return optimized;
}

// Test the optimized embeddings
function testOptimizedEmbeddings(optimized) {
  console.log('\nTesting optimized embeddings...');
  
  const { vocabulary, embeddings, cityNames } = optimized;
  
  // Test a few cities
  const testCities = ['chandler', 'los angeles', 'chicago'];
  
  testCities.forEach(cityName => {
    console.log(`\nTesting: ${cityName}`);
    
    // Find the city
    const city = cityNames.find(c => c.name === cityName);
    if (!city) {
      console.log('  City not found');
      return;
    }
    
    const cityIndex = cityNames.indexOf(city);
    const embedding = embeddings[cityIndex];
    
    console.log(`  File: ${city.filePath}`);
    console.log(`  Embedding length: ${embedding.length}`);
    console.log(`  Non-zero values: ${embedding.filter(v => v > 0).length}`);
    console.log(`  Max value: ${Math.max(...embedding)}`);
  });
}

// Alternative: Even more compact format
function createUltraCompactFormat(original) {
  console.log('\nCreating ultra-compact format...');
  
  // Create vocabulary
  const vocabulary = createVocabulary(original.embeddings);
  
  // Convert to dense arrays and then to binary-like format
  const denseEmbeddings = convertToDense(original.embeddings, vocabulary);
  
  // Convert to more compact format (using shorter keys)
  const compact = {
    v: vocabulary, // vocabulary
    e: denseEmbeddings, // embeddings
    c: original.cityNames.map(city => ({
      n: city.name,
      f: city.filePath,
      i: city.index
    })), // cities (compact)
    m: {
      t: original.metadata.totalCities,
      g: new Date().toISOString(),
      s: 'ultra-compact'
    } // metadata (compact)
  };
  
  const compactSize = JSON.stringify(compact).length;
  const originalSize = JSON.stringify(original).length;
  const reduction = ((originalSize - compactSize) / originalSize * 100).toFixed(1);
  
  console.log(`Ultra-compact size: ${(compactSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${reduction}%`);
  
  const outputPath = path.join(__dirname, 'city_embeddings_compact.json');
  fs.writeFileSync(outputPath, JSON.stringify(compact, null, 0));
  
  console.log(`Saved ultra-compact embeddings to: ${outputPath}`);
  
  return compact;
}

// Main execution
if (require.main === module) {
  try {
    console.log('=== Embedding Optimization ===\n');
    
    // Standard optimization
    const optimized = optimizeEmbeddings();
    
    // Ultra-compact format
    const original = loadOriginalEmbeddings();
    const ultraCompact = createUltraCompactFormat(original);
    
    console.log('\n=== Summary ===');
    console.log('✅ Standard optimization: city_embeddings_optimized.json');
    console.log('✅ Ultra-compact format: city_embeddings_compact.json');
    console.log('\nChoose the format that best fits your needs:');
    console.log('- Standard: Easier to work with, good compression');
    console.log('- Ultra-compact: Maximum compression, shorter keys');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  optimizeEmbeddings,
  createUltraCompactFormat
};
