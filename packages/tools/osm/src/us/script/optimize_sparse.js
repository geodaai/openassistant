const fs = require('fs');
const path = require('path');

// Load the original embeddings
function loadOriginalEmbeddings() {
  const embeddingsPath = path.join(__dirname, 'city_embeddings.json');
  const data = fs.readFileSync(embeddingsPath, 'utf8');
  return JSON.parse(data);
}

// Create vocabulary and convert to sparse arrays
function optimizeSparse(original) {
  console.log('Creating vocabulary...');
  const vocabSet = new Set();
  
  original.embeddings.forEach(embedding => {
    Object.keys(embedding).forEach(key => {
      vocabSet.add(key);
    });
  });
  
  const vocabulary = Array.from(vocabSet).sort();
  console.log(`Vocabulary size: ${vocabulary.length} unique bigrams`);
  
  // Convert to sparse arrays (only store non-zero values)
  console.log('Converting to sparse arrays...');
  const sparseEmbeddings = [];
  
  original.embeddings.forEach(embedding => {
    const sparse = [];
    Object.entries(embedding).forEach(([key, value]) => {
      const index = vocabulary.indexOf(key);
      if (index !== -1 && value > 0) {
        sparse.push([index, value]); // [index, value] pairs
      }
    });
    sparseEmbeddings.push(sparse);
  });
  
  return {
    vocabulary,
    embeddings: sparseEmbeddings,
    cityNames: original.cityNames,
    metadata: {
      ...original.metadata,
      method: 'sparse-arrays',
      vocabularySize: vocabulary.length,
      optimizedAt: new Date().toISOString()
    }
  };
}

// Even more compact: use single string for each embedding
function optimizeUltraCompact(original) {
  console.log('Creating ultra-compact format...');
  
  const vocabSet = new Set();
  original.embeddings.forEach(embedding => {
    Object.keys(embedding).forEach(key => {
      vocabSet.add(key);
    });
  });
  
  const vocabulary = Array.from(vocabSet).sort();
  
  // Convert to string format: "index:value,index:value,..."
  const stringEmbeddings = [];
  
  original.embeddings.forEach(embedding => {
    const pairs = [];
    Object.entries(embedding).forEach(([key, value]) => {
      const index = vocabulary.indexOf(key);
      if (index !== -1 && value > 0) {
        pairs.push(`${index}:${value}`);
      }
    });
    stringEmbeddings.push(pairs.join(','));
  });
  
  return {
    v: vocabulary, // vocabulary
    e: stringEmbeddings, // embeddings as strings
    c: original.cityNames.map(city => ({
      n: city.name,
      f: city.filePath,
      i: city.index
    })), // cities
    m: {
      t: original.metadata.totalCities,
      g: new Date().toISOString(),
      s: 'string-sparse'
    }
  };
}

// Test the optimized embeddings
function testOptimized(optimized, format) {
  console.log(`\nTesting ${format} format...`);
  
  const { vocabulary, embeddings, cityNames } = optimized;
  
  // Test a few cities
  const testCities = ['chandler', 'chicago'];
  
  testCities.forEach(cityName => {
    const city = cityNames.find(c => c.name === cityName);
    if (!city) return;
    
    const cityIndex = cityNames.indexOf(city);
    const embedding = embeddings[cityIndex];
    
    console.log(`  ${cityName}: ${city.filePath}`);
    console.log(`    Embedding: ${JSON.stringify(embedding).substring(0, 50)}...`);
  });
}

// Main optimization
function optimizeEmbeddings() {
  console.log('=== Sparse Embedding Optimization ===\n');
  
  const original = loadOriginalEmbeddings();
  const originalSize = JSON.stringify(original).length;
  
  console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Cities: ${original.cityNames.length}`);
  
  // Sparse array optimization
  console.log('\n1. Sparse Array Optimization:');
  const sparse = optimizeSparse(original);
  const sparseSize = JSON.stringify(sparse).length;
  const sparseReduction = ((originalSize - sparseSize) / originalSize * 100).toFixed(1);
  
  console.log(`Sparse size: ${(sparseSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${sparseReduction}%`);
  
  // Save sparse version
  const sparsePath = path.join(__dirname, 'city_embeddings_sparse.json');
  fs.writeFileSync(sparsePath, JSON.stringify(sparse, null, 0));
  console.log(`Saved to: ${sparsePath}`);
  
  // Ultra-compact optimization
  console.log('\n2. Ultra-Compact String Format:');
  const ultra = optimizeUltraCompact(original);
  const ultraSize = JSON.stringify(ultra).length;
  const ultraReduction = ((originalSize - ultraSize) / originalSize * 100).toFixed(1);
  
  console.log(`Ultra-compact size: ${(ultraSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reduction: ${ultraReduction}%`);
  
  // Save ultra-compact version
  const ultraPath = path.join(__dirname, 'city_embeddings_ultra.json');
  fs.writeFileSync(ultraPath, JSON.stringify(ultra, null, 0));
  console.log(`Saved to: ${ultraPath}`);
  
  // Test both formats
  testOptimized(sparse, 'sparse');
  testOptimized(ultra, 'ultra-compact');
  
  return { sparse, ultra };
}

// Run optimization
if (require.main === module) {
  try {
    optimizeEmbeddings();
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { optimizeEmbeddings };
