#!/usr/bin/env node

/**
 * Development Server Startup Test
 * Tests if the development server can start properly
 */

const { spawn } = require('child_process');
const os = require('os');

console.log('🚀 CleanLagos Mobile Startup Test');
console.log('='.repeat(40));
console.log(`📱 Platform: ${os.platform()}`);
console.log(`📂 Node Version: ${process.version}`);
console.log('');

let testPassed = false;
let testTimeout;

// Start the development server
console.log('🔄 Starting Expo development server...');
const expo = spawn('npx', ['expo', 'start', '--port', '8082'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env, CI: '1' }
});

// Set a timeout for the test
testTimeout = setTimeout(() => {
  if (!testPassed) {
    console.log('⏰ Test timeout - server took too long to start');
    expo.kill();
    process.exit(1);
  }
}, 30000); // 30 second timeout

expo.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`📤 ${output.trim()}`);
  
  // Check for successful startup indicators
  if (output.includes('Metro') && (output.includes('Bundler') || output.includes('running'))) {
    console.log('✅ Metro bundler started successfully');
    testPassed = true;
    clearTimeout(testTimeout);
    
    // Give it a moment to fully initialize
    setTimeout(() => {
      console.log('🎉 Development server startup test passed!');
      expo.kill();
      process.exit(0);
    }, 2000);
  }
  
  // Check for QR code or URL indicators
  if (output.includes('exp://') || output.includes('http://')) {
    console.log('✅ Development server URL generated');
  }
});

expo.stderr.on('data', (data) => {
  const error = data.toString();
  console.log(`❌ Error: ${error.trim()}`);
  
  // Check for critical errors
  if (error.includes('EADDRINUSE') || error.includes('port')) {
    console.log('⚠️  Port conflict detected - this is normal if another server is running');
  } else if (error.includes('Error') && !error.includes('warning')) {
    console.log('❌ Critical error detected');
    clearTimeout(testTimeout);
    expo.kill();
    process.exit(1);
  }
});

expo.on('close', (code) => {
  clearTimeout(testTimeout);
  if (testPassed) {
    console.log(`✅ Process exited with code ${code}`);
  } else {
    console.log(`❌ Process exited with code ${code} before test completion`);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  clearTimeout(testTimeout);
  expo.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test terminated');
  clearTimeout(testTimeout);
  expo.kill();
  process.exit(0);
});