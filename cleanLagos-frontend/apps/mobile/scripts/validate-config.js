#!/usr/bin/env node

/**
 * Configuration Validation Script
 * Tests metro configuration and module loading patterns across platforms
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 CleanLagos Mobile Configuration Validator');
console.log('='.repeat(50));

// Platform information
console.log(`📱 Platform: ${os.platform()}`);
console.log(`🏗️  Architecture: ${os.arch()}`);
console.log(`📂 Node Version: ${process.version}`);
console.log(`📍 Working Directory: ${process.cwd()}`);
console.log('');

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function test(name, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'passed' });
    } else if (result === 'warning') {
      console.log(`⚠️  ${name}`);
      results.warnings++;
      results.tests.push({ name, status: 'warning' });
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

// Test 1: Metro configuration exists and is valid
test('Metro configuration exists', () => {
  const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
  if (!fs.existsSync(metroConfigPath)) {
    return 'metro.config.js not found';
  }
  
  try {
    const metroConfig = require(metroConfigPath);
    if (typeof metroConfig !== 'object') {
      return 'metro.config.js does not export an object';
    }
    return true;
  } catch (error) {
    return `Failed to load metro.config.js: ${error.message}`;
  }
});

// Test 2: Package.json is valid
test('Package.json is valid', () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    return 'package.json not found';
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (!pkg.main) {
      return 'package.json missing main entry point';
    }
    if (!pkg.scripts || !pkg.scripts.start) {
      return 'package.json missing start script';
    }
    return true;
  } catch (error) {
    return `Failed to parse package.json: ${error.message}`;
  }
});

// Test 3: App.js exists and is valid
test('App.js exists and is valid', () => {
  const appPath = path.join(process.cwd(), 'App.js');
  if (!fs.existsSync(appPath)) {
    return 'App.js not found';
  }
  
  const content = fs.readFileSync(appPath, 'utf8');
  if (!content.includes('registerRootComponent')) {
    return 'App.js missing registerRootComponent call';
  }
  if (!content.includes('export default')) {
    return 'App.js missing default export';
  }
  return true;
});

// Test 4: Required directories exist
test('Required directories exist', () => {
  const requiredDirs = ['src', 'src/store', 'src/navigation', 'src/screens', 'src/components'];
  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      return `Missing directory: ${dir}`;
    }
  }
  return true;
});

// Test 5: Redux store configuration
test('Redux store configuration', () => {
  const storePath = path.join(process.cwd(), 'src/store/store.js');
  if (!fs.existsSync(storePath)) {
    return 'src/store/store.js not found';
  }
  
  const content = fs.readFileSync(storePath, 'utf8');
  if (!content.includes('configureStore')) {
    return 'Store not using configureStore from Redux Toolkit';
  }
  if (!content.includes('persistStore')) {
    return 'Store missing persistence configuration';
  }
  return true;
});

// Test 6: Navigation configuration
test('Navigation configuration', () => {
  const navPath = path.join(process.cwd(), 'src/navigation/AppNavigator.js');
  if (!fs.existsSync(navPath)) {
    return 'src/navigation/AppNavigator.js not found';
  }
  
  const content = fs.readFileSync(navPath, 'utf8');
  if (!content.includes('NavigationContainer')) {
    return 'AppNavigator missing NavigationContainer';
  }
  if (!content.includes('createStackNavigator')) {
    return 'AppNavigator missing stack navigator';
  }
  return true;
});

// Test 7: Error boundary implementation
test('Error boundary implementation', () => {
  const errorBoundaryPath = path.join(process.cwd(), 'src/components/ErrorBoundary.js');
  if (!fs.existsSync(errorBoundaryPath)) {
    return 'src/components/ErrorBoundary.js not found';
  }
  
  const content = fs.readFileSync(errorBoundaryPath, 'utf8');
  if (!content.includes('componentDidCatch')) {
    return 'ErrorBoundary missing componentDidCatch method';
  }
  return true;
});

// Test 8: Platform-specific path handling
test('Platform-specific path handling', () => {
  const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
  const content = fs.readFileSync(metroConfigPath, 'utf8');
  
  // Check for proper path resolution
  if (!content.includes('path.resolve')) {
    return 'Metro config not using proper path resolution';
  }
  
  // Check for cross-platform compatibility
  if (content.includes('\\\\') || content.includes('\\/')) {
    return 'warning'; // Hard-coded path separators detected
  }
  
  return true;
});

// Test 9: Dependency versions compatibility
test('Dependency versions compatibility', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = pkg.dependencies || {};
  
  // Check for known incompatible versions
  if (deps.react && deps.react.startsWith('19.')) {
    if (deps.expo && deps.expo.includes('54.')) {
      return 'warning'; // React 19 with Expo 54 may have compatibility issues
    }
  }
  
  return true;
});

console.log('');
console.log('📊 Validation Results:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📝 Total Tests: ${results.tests.length}`);

if (results.failed > 0) {
  console.log('');
  console.log('❌ Configuration validation failed!');
  console.log('Please fix the issues above before proceeding.');
  process.exit(1);
} else if (results.warnings > 0) {
  console.log('');
  console.log('⚠️  Configuration validation completed with warnings.');
  console.log('Consider addressing the warnings for optimal performance.');
  process.exit(0);
} else {
  console.log('');
  console.log('🎉 Configuration validation passed!');
  console.log('Your CleanLagos mobile app is properly configured.');
  process.exit(0);
}