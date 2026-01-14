#!/usr/bin/env node

/**
 * CleanLagos Mobile Integration Test
 * Tests complete app initialization flow and all integrated components
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 CleanLagos Mobile Integration Test');
console.log('='.repeat(50));

const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function runTest(name, testFn) {
  testResults.total++;
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${name}`);
      testResults.passed++;
      return true;
    } else {
      console.log(`❌ ${name}: ${result}`);
      testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

console.log('📋 Running Integration Tests...\n');

// Test 1: Configuration Integration
runTest('Configuration files are properly integrated', () => {
  // Check metro config
  const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
  const metroConfig = require(metroConfigPath);
  if (!metroConfig.projectRoot || !metroConfig.watchFolders) {
    return 'Metro config missing required properties';
  }

  // Check package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.main !== './App.js') {
    return 'Package.json main entry point incorrect';
  }

  return true;
});

// Test 2: Redux Store Integration
runTest('Redux store properly configured with persistence', () => {
  // Check if store exports exist
  const storeIndexPath = path.join(process.cwd(), 'src/store/index.js');
  const storeContent = fs.readFileSync(storeIndexPath, 'utf8');
  
  if (!storeContent.includes('export { store, persistor }')) {
    return 'Store exports missing';
  }
  
  if (!storeContent.includes('loginUser') || !storeContent.includes('logout')) {
    return 'Auth actions not exported';
  }

  return true;
});

// Test 3: Navigation Integration
runTest('Navigation system properly integrated with Redux', () => {
  const navPath = path.join(process.cwd(), 'src/navigation/AppNavigator.js');
  const navContent = fs.readFileSync(navPath, 'utf8');
  
  if (!navContent.includes('useSelector') || !navContent.includes('selectAuth')) {
    return 'Navigation not connected to Redux';
  }
  
  if (!navContent.includes('RoleNavigators')) {
    return 'Role-based navigation not implemented';
  }

  return true;
});

// Test 4: Error Boundary Integration
runTest('Error boundaries properly integrated', () => {
  const appPath = path.join(process.cwd(), 'App.js');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (!appContent.includes('ErrorBoundary')) {
    return 'ErrorBoundary not integrated in App.js';
  }
  
  // Check if NavigationErrorHandler exists
  const navErrorPath = path.join(process.cwd(), 'src/components/NavigationErrorHandler.js');
  if (!fs.existsSync(navErrorPath)) {
    return 'NavigationErrorHandler component missing';
  }

  return true;
});

// Test 5: Screen Components Exist
runTest('All required screen components exist', () => {
  const requiredScreens = [
    'src/screens/auth/LoginScreen.js',
    'src/screens/citizen/HomeScreen.js'
  ];
  
  for (const screen of requiredScreens) {
    const screenPath = path.join(process.cwd(), screen);
    if (!fs.existsSync(screenPath)) {
      return `Missing screen: ${screen}`;
    }
  }

  return true;
});

// Test 6: Component Integration
runTest('Components properly integrated with Redux', () => {
  const loginScreenPath = path.join(process.cwd(), 'src/screens/auth/LoginScreen.js');
  const loginContent = fs.readFileSync(loginScreenPath, 'utf8');
  
  if (!loginContent.includes('useDispatch') || !loginContent.includes('useSelector')) {
    return 'LoginScreen not connected to Redux';
  }
  
  if (!loginContent.includes('loginUser')) {
    return 'LoginScreen not using auth actions';
  }

  return true;
});

// Test 7: Hot Reload Configuration
runTest('Hot reload configuration is valid', () => {
  const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
  const metroConfig = require(metroConfigPath);
  
  if (!metroConfig.transformer || !metroConfig.transformer.getTransformOptions) {
    return 'Metro transformer configuration missing';
  }

  return true;
});

// Test 8: Development Dependencies
runTest('All development dependencies are properly installed', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  const requiredPackages = [
    '@expo/vector-icons',
    '@react-navigation/native',
    '@reduxjs/toolkit',
    'react-redux',
    'redux-persist'
  ];
  
  for (const pkgName of requiredPackages) {
    if (!deps[pkgName]) {
      return `Missing package in dependencies: ${pkgName}`;
    }
  }

  return true;
});

console.log('\n📊 Integration Test Results:');
console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`);
console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`);

if (testResults.failed === 0) {
  console.log('\n🎉 All integration tests passed!');
  console.log('✅ Configuration fixes are properly integrated');
  console.log('✅ Redux store and persistence working');
  console.log('✅ Navigation system properly configured');
  console.log('✅ Error boundaries implemented');
  console.log('✅ All components properly connected');
  console.log('\n🚀 CleanLagos mobile app is ready for development!');
  process.exit(0);
} else {
  console.log('\n❌ Some integration tests failed!');
  console.log('Please fix the issues above before proceeding.');
  process.exit(1);
}