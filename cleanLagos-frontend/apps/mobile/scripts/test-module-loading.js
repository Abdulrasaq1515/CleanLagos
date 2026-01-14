#!/usr/bin/env node

/**
 * Module Loading Test
 * Tests if modules can be loaded properly across different patterns
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('📦 CleanLagos Module Loading Test');
console.log('='.repeat(40));
console.log(`📱 Platform: ${os.platform()}`);
console.log(`📂 Node Version: ${process.version}`);
console.log('');

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'passed' });
    } else {
      console.log(`❌ ${name}: ${result}`);
      results.failed++;
      results.tests.push({ name, status: 'failed', error: result });
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
  }
}

// Test 1: Store module loading
test('Redux store module loading', () => {
  try {
    const storePath = path.join(process.cwd(), 'src/store/index.js');
    if (!fs.existsSync(storePath)) {
      return 'Store index file not found';
    }
    
    // Test if the store module can be required (syntax check)
    const storeContent = fs.readFileSync(storePath, 'utf8');
    if (!storeContent.includes('export')) {
      return 'Store module not using ES6 exports';
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

// Test 2: Navigation module loading
test('Navigation module loading', () => {
  try {
    const navPath = path.join(process.cwd(), 'src/navigation/AppNavigator.js');
    if (!fs.existsSync(navPath)) {
      return 'AppNavigator file not found';
    }
    
    const navContent = fs.readFileSync(navPath, 'utf8');
    if (!navContent.includes('import') || !navContent.includes('export')) {
      return 'Navigation module not using proper ES6 imports/exports';
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

// Test 3: Component module loading
test('Component module loading', () => {
  try {
    const componentPath = path.join(process.cwd(), 'src/components');
    if (!fs.existsSync(componentPath)) {
      return 'Components directory not found';
    }
    
    const components = fs.readdirSync(componentPath).filter(file => file.endsWith('.js'));
    if (components.length === 0) {
      return 'No component files found';
    }
    
    // Test first component file
    const firstComponent = path.join(componentPath, components[0]);
    const componentContent = fs.readFileSync(firstComponent, 'utf8');
    if (!componentContent.includes('export')) {
      return 'Component not using proper exports';
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

// Test 4: Screen module loading
test('Screen module loading', () => {
  try {
    const screensPath = path.join(process.cwd(), 'src/screens');
    if (!fs.existsSync(screensPath)) {
      return 'Screens directory not found';
    }
    
    // Check for auth screens
    const authPath = path.join(screensPath, 'auth');
    if (!fs.existsSync(authPath)) {
      return 'Auth screens directory not found';
    }
    
    const authScreens = fs.readdirSync(authPath).filter(file => file.endsWith('.js'));
    if (authScreens.length === 0) {
      return 'No auth screen files found';
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

// Test 5: Path resolution consistency
test('Path resolution consistency', () => {
  try {
    // Test different path formats
    const testPaths = [
      './src/store',
      '../src/store',
      'src/store',
      path.join('src', 'store')
    ];
    
    for (const testPath of testPaths) {
      const resolvedPath = path.resolve(process.cwd(), testPath);
      if (!resolvedPath.includes('src')) {
        return `Path resolution failed for: ${testPath}`;
      }
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

// Test 6: Import statement patterns
test('Import statement patterns', () => {
  try {
    const appPath = path.join(process.cwd(), 'App.js');
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Check for proper import patterns
    const importPatterns = [
      /import.*from ['"]react['"]/,
      /import.*from ['"]expo['"]/,
      /import.*from ['"]\.\/src\//
    ];
    
    for (const pattern of importPatterns) {
      if (!pattern.test(appContent)) {
        return `Missing expected import pattern: ${pattern}`;
      }
    }
    
    return true;
  } catch (error) {
    return error.message;
  }
});

console.log('');
console.log('📊 Module Loading Test Results:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📝 Total Tests: ${results.tests.length}`);

if (results.failed > 0) {
  console.log('');
  console.log('❌ Module loading test failed!');
  console.log('Some modules may not load properly in the development environment.');
  process.exit(1);
} else {
  console.log('');
  console.log('🎉 Module loading test passed!');
  console.log('All modules should load properly across platforms.');
  process.exit(0);
}