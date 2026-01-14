# CleanLagos Mobile - Platform Compatibility Guide

## Overview

This document outlines the platform compatibility testing and configuration validation for the CleanLagos mobile application.

## Supported Platforms

### Development Platforms
- ✅ **Windows 10/11** - Fully tested and supported
- ✅ **macOS** - Compatible (Metro config uses cross-platform paths)
- ✅ **Linux** - Compatible (Metro config uses cross-platform paths)

### Target Mobile Platforms
- ✅ **iOS** - Expo SDK 54 compatible
- ✅ **Android** - Expo SDK 54 compatible
- ✅ **Web** - React Native Web support via Expo

## Configuration Validation

### Automated Testing
Run the following commands to validate your configuration:

```bash
# Validate configuration
npm run validate

# Test development server startup
npm run test-startup
```

### Manual Validation Checklist

#### Metro Configuration
- [x] Uses CommonJS module syntax (`module.exports`)
- [x] Cross-platform path resolution with `path.resolve()`
- [x] Proper monorepo workspace configuration
- [x] Windows file path compatibility

#### Package Configuration
- [x] Correct main entry point (`node_modules/expo/AppEntry.js`)
- [x] Compatible dependency versions
- [x] Proper Expo CLI scripts
- [x] Redux Toolkit and persistence setup

#### Application Structure
- [x] Error boundaries implemented
- [x] Network error handling
- [x] Navigation error recovery
- [x] Role-based routing system

## Platform-Specific Notes

### Windows
- ✅ File path separators handled correctly
- ✅ Metro bundler starts without ESM errors
- ✅ Development server accessible on localhost
- ⚠️ May require Windows Defender exclusions for node_modules

### macOS
- ✅ Unix-style paths supported
- ✅ Xcode integration for iOS development
- ✅ Simulator support

### Linux
- ✅ Unix-style paths supported
- ✅ Android development via Android Studio
- ✅ Web development fully supported

## Dependency Compatibility

### Core Dependencies
- **React**: 18.3.1 (compatible with Expo SDK 54)
- **React Native**: 0.76.5 (Expo managed)
- **Expo SDK**: 54.0.31 (stable)
- **Redux Toolkit**: 1.9.7 (latest stable)

### Navigation
- **React Navigation**: 6.x (latest stable)
- **Bottom Tabs**: 6.5.11
- **Stack Navigator**: 6.3.20

### Development Tools
- **Metro Bundler**: Configured for monorepo
- **Babel**: Expo preset with module resolution
- **TypeScript**: Ready for future migration

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# If port 8081 is in use
expo start --port 8082
```

#### Metro Cache Issues
```bash
# Clear Metro cache
expo start --clear
```

#### Module Resolution Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --legacy-peer-deps
```

### Platform-Specific Issues

#### Windows
- **Issue**: ESM module loading errors
- **Solution**: Use CommonJS in metro.config.js ✅

#### macOS/Linux
- **Issue**: Permission errors with node_modules
- **Solution**: Use proper npm permissions or nvm

## Performance Optimization

### Development
- Metro bundler cache enabled
- Fast refresh configured
- Source maps for debugging

### Production
- Bundle splitting ready
- Asset optimization configured
- Platform-specific builds supported

## Testing Strategy

### Automated Tests
- Configuration validation script
- Development server startup test
- Cross-platform path resolution test

### Manual Testing
- Test on each target platform
- Verify navigation flows
- Test error boundaries
- Validate offline functionality

## Deployment Readiness

### iOS
- Expo managed workflow ready
- App Store deployment configured
- iOS-specific assets prepared

### Android
- Google Play Store ready
- Android-specific permissions configured
- APK/AAB build process tested

### Web
- Progressive Web App features
- Responsive design implemented
- Web-specific optimizations applied

## Maintenance

### Regular Tasks
- Update Expo SDK quarterly
- Monitor dependency security updates
- Test on new platform versions
- Validate configuration after updates

### Monitoring
- Development server startup time
- Bundle size optimization
- Platform-specific performance metrics

---

**Last Updated**: January 2026  
**Tested Platforms**: Windows 11, Node.js 22.15.1  
**Configuration Status**: ✅ All tests passing