#!/usr/bin/env node

// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Run GeoJSON Demo Script
 * 
 * This script runs the GeoJSON transformation demo to show how place search results
 * are converted to GeoJSON format.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running GeoJSON Demo...\n');

try {
  // Run the TypeScript demo using ts-node
  const demoPath = path.join(__dirname, '../examples/geojson-demo.ts');
  
  // Check if ts-node is available
  try {
    execSync('npx ts-node --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('📦 Installing ts-node...');
    execSync('npm install -g ts-node', { stdio: 'inherit' });
  }
  
  // Run the demo
  execSync(`npx ts-node ${demoPath}`, { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Error running demo:', error.message);
  console.log('\n💡 Alternative: You can also run the demo manually:');
  console.log('   1. Install ts-node: npm install -g ts-node');
  console.log('   2. Run: npx ts-node examples/geojson-demo.ts');
  process.exit(1);
} 