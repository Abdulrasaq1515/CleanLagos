#!/usr/bin/env node

/**
 * Metro Configuration Test
 * Tests if the metro configuration can be loaded properly
 */

const path = require('path');
const os = require('os');

console.log('⚙️  CleanLagos Metro Configuration Test');
console.log('='.repeat(45));
console.log(`📱 Platform: ${os.platform()}`);
console.log(`📂 Node Version: ${process.version}`);
console.log('');

try {
  // Test loading metro config
  console.log('🔄 Loading metro.config.js...');
  const metroConfig = require('../metro.config.js');
  
  console.log('✅ Metro configuration loaded successfully');
  
  // Validate configuration structure
  if (metroConfig.projectRoot) {
    console.log('✅ Project root configured');
  }
  
  if (metroConfig.watchFolders && Array.isArray(metroConfig.watchFolders)) {
    console.log('✅ Watch folders configured');
  }
  
  if (metroConfig.resolver && metroConfig.resolver.nodeModulesPaths) {
    console.log('✅ Node modules paths configured');
  }
  
  if (metroConfig.resolver && metroConfig.resolver.platforms) {
    console.log('✅ Platform support configured:', metroConfig.resolver.platforms.join(', '));
  }
  
  // Test path resolution
  console.log('🔄 Testing path resolution...');
  const projectRoot = metroConfig.projectRoot || process.cwd();
  const workspaceRoot = path.resolve(projectRoot, '../..');
  
  console.log(`📂 Project root: ${projectRoot}`);
  console.log(`📂 Workspace root: ${workspaceRoot}`);
  
  // Test alias resolution if configured
  if (metroConfig.resolver && metroConfig.resolver.alias) {
    console.log('✅ Path aliases configured');
    Object.keys(metroConfig.resolver.alias).forEach(alias => {
      console.log(`   ${alias} -> ${metroConfig.resolver.alias[alias]}`);
    });
  }
  
  console.log('');
  console.log('🎉 Metro configuration test passed!');
  console.log('The development server should be able to start properly.');
  
} catch (error) {
  console.log('❌ Metro configuration test failed!');
  console.log(`Error: ${error.message}`);
  console.log('');
  console.log('Please check your metro.config.js file for syntax errors.');
  process.exit(1);
}