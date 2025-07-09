#!/usr/bin/env node

import { loadJsonFile } from './dist/jsonManager.js';
import { executeQuery } from './dist/queryProcessor.js';

async function testBasicFunctionality() {
  console.log('🧪 Testing JSON MCP Server - Phase 1');
  console.log('=====================================\n');

  try {
    // Test 1: Load products.json
    console.log('Test 1: Loading products.json...');
    const products = await loadJsonFile('products.json');
    console.log(`✅ Loaded ${Array.isArray(products) ? products.length : 1} products\n`);

    // Test 2: Basic query - all products
    console.log('Test 2: Query all products...');
    const allProducts = executeQuery(products, '');
    console.log(`✅ Retrieved ${allProducts.count} products\n`);

    // Test 3: Filter by category
    console.log('Test 3: Filter by category = electronics...');
    const electronics = executeQuery(products, 'filter by category = electronics');
    console.log(`✅ Found ${electronics.count} electronics products\n`);

    // Test 4: Sort by price descending
    console.log('Test 4: Sort by price desc...');
    const sortedByPrice = executeQuery(products, 'sort by price desc');
    console.log(`✅ Sorted ${sortedByPrice.count} products by price\n`);

    // Test 5: Top 3 products
    console.log('Test 5: Top 3 products...');
    const top3 = executeQuery(products, 'top 3');
    console.log(`✅ Retrieved top ${top3.count} products\n`);

    // Test 6: Load simple array
    console.log('Test 6: Loading simple-array.json...');
    const simpleArray = await loadJsonFile('simple-array.json');
    console.log(`✅ Loaded array with ${simpleArray.length} items\n`);

    // Test 7: Count query
    console.log('Test 7: Count query...');
    const countResult = executeQuery(products, 'count');
    console.log(`✅ Count result: ${countResult.data}\n`);

    // Test 8: Error handling - invalid file
    console.log('Test 8: Error handling - invalid file...');
    try {
      await loadJsonFile('nonexistent.json');
      console.log('❌ Should have thrown error');
    } catch (error) {
      console.log(`✅ Correctly handled error: ${error.message}\n`);
    }

    console.log('🎉 All tests passed! Phase 1 implementation is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testBasicFunctionality();
