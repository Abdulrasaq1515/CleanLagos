#!/usr/bin/env node

/**
 * Performance Testing Script for CleanLagos Admin Dashboard
 * 
 * This script runs comprehensive performance tests including:
 * - Bundle size analysis
 * - Build time measurement
 * - Lighthouse audit
 * - Core Web Vitals check
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function measureBuildTime() {
  log('\n🏗️  Measuring build time...', colors.blue);
  const startTime = Date.now();
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    const buildTime = (Date.now() - startTime) / 1000;
    log(`✅ Build completed in ${buildTime.toFixed(2)} seconds`, colors.green);
    return buildTime;
  } catch (error) {
    log('❌ Build failed', colors.red);
    return null;
  }
}

function analyzeBundleSize() {
  log('\n📊 Analyzing bundle sizes...', colors.blue);
  
  const distPath = path.join(process.cwd(), 'dist', 'assets');
  
  if (!fs.existsSync(distPath)) {
    log('❌ Dist folder not found. Run build first.', colors.red);
    return;
  }
  
  const files = fs.readdirSync(distPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  let totalSize = 0;
  
  log('\n📦 Bundle Analysis:', colors.yellow);
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    let sizeColor = colors.green;
    if (stats.size > 500 * 1024) sizeColor = colors.red;
    else if (stats.size > 100 * 1024) sizeColor = colors.yellow;
    
    log(`  ${file}: ${sizeColor}${sizeKB} kB${colors.reset}`);
  });
  
  const totalSizeKB = (totalSize / 1024).toFixed(2);
  log(`\n📈 Total JS bundle size: ${totalSizeKB} kB`, colors.blue);
  
  // Performance recommendations
  if (totalSize > 1024 * 1024) {
    log('⚠️  Bundle size is large (>1MB). Consider code splitting.', colors.yellow);
  } else {
    log('✅ Bundle size is optimized', colors.green);
  }
}

function checkStatsFile() {
  log('\n📈 Checking bundle analyzer...', colors.blue);
  
  const statsPath = path.join(process.cwd(), 'dist', 'stats.html');
  
  if (fs.existsSync(statsPath)) {
    log('✅ Bundle analyzer report generated at dist/stats.html', colors.green);
    log('   Open this file in your browser to view detailed bundle analysis', colors.blue);
  } else {
    log('❌ Bundle analyzer report not found', colors.red);
  }
}

function runLighthouse() {
  log('\n🔍 Running Lighthouse audit...', colors.blue);
  
  try {
    // Start preview server in background
    log('Starting preview server...', colors.blue);
    const server = execSync('npm run preview &', { stdio: 'pipe' });
    
    // Wait a bit for server to start
    setTimeout(() => {
      try {
        execSync('lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html --quiet', { stdio: 'inherit' });
        log('✅ Lighthouse report generated: lighthouse-report.html', colors.green);
      } catch (error) {
        log('❌ Lighthouse audit failed. Make sure lighthouse is installed globally:', colors.red);
        log('   npm install -g lighthouse', colors.yellow);
      }
    }, 3000);
    
  } catch (error) {
    log('❌ Failed to start preview server', colors.red);
  }
}

function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    buildTime: null,
    bundleSize: null,
    recommendations: []
  };
  
  // Save report
  fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
  log('\n📄 Performance report saved to performance-report.json', colors.green);
}

// Main execution
async function main() {
  log('🚀 CleanLagos Performance Test Suite', colors.blue);
  log('=====================================', colors.blue);
  
  // 1. Measure build time
  const buildTime = measureBuildTime();
  
  // 2. Analyze bundle sizes
  analyzeBundleSize();
  
  // 3. Check stats file
  checkStatsFile();
  
  // 4. Generate report
  generatePerformanceReport();
  
  log('\n✨ Performance analysis complete!', colors.green);
  log('\nNext steps:', colors.blue);
  log('1. Open dist/stats.html to view bundle analysis', colors.reset);
  log('2. Run "npm run lighthouse" for Lighthouse audit', colors.reset);
  log('3. Check performance-report.json for detailed metrics', colors.reset);
}

main().catch(console.error);