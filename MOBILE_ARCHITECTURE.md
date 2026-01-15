# CleanLagos Mobile Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native + Expo)         │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Auth Screens  │  │ Citizen Screens│  │  PSP Screens   │ │
│  │  - Login       │  │ - Home         │  │  - Tasks       │ │
│  │  - Register    │  │ - Report       │  │  - Map         │ │
│  │  - Verify      │  │ - Rewards      │  │  - History     │ │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘ │
│           │                   │                    │          │
│           └───────────────────┼────────────────────┘          │
│                               │                               │
│                    ┌──────────▼──────────┐                    │
│                    │  Navigation Layer   │                    │
│                    │  - AppNavigator     │                    │
│                    │  - Role-based       │                    │
│                    └──────────┬──────────┘                    │
│                               │                               │
│                    ┌──────────▼──────────┐                    │
│                    │   Redux Store       │                    │
│                    │   (@cleanlagos/     │                    │
│                    │   shared-redux)     │                    │
│                    │                     │                    │
│                    │  - Auth State       │                    │
│                    │  - Reports State    │                    │
│                    │  - UI State         │                    │
│                    └──────────┬──────────┘                    │
│                               │                               │
│                    ┌──────────▼──────────┐                    │
│                    │  Redux Persist      │                    │
│                    │  (AsyncStorage)     │                    │
│                    └──────────┬──────────┘                    │
│                               │                               │
└───────────────────────────────┼───────────────────────────────┘
                                │
                                │ HTTP/WebSocket
                                │
                    ┌───────────▼───────────┐
                    │   Backend API         │
                    │   (Node.js/Express)   │
                    │                       │
                    │  - Auth Routes        │
                    │  - Report Routes      │
                    │  - WebSocket          │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   MongoDB Database    │
                    │                       │
                    │  - Users              │
                    │  - Reports            │
                    │  - Tasks              │
                    └───────────────────────┘
```

## Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. LoginScreen dispatches loginUser()
   ↓
3. Redux Thunk calls API
   ↓
4. Backend validates credentials
   ↓
5. Backend returns token + user data
   ↓
6. Redux stores token in state
   ↓
7. Redux Persist saves to AsyncStorage
   ↓
8. AppNavigator detects auth change
   ↓
9. Navigate to role-based screen
```

### Report Creation Flow

```
1. User fills report form
   ↓
2. User takes/selects photos
   ↓
3. User submits report
   ↓
4. Redux dispatches createReport()
   ↓
5. API uploads images + data
   ↓
6. Backend saves to MongoDB
   ↓
7. Backend emits WebSocket event
   ↓
8. Redux updates reports state
   ↓
9. UI shows success message
```

## Key Components

### 1. Shared Redux Store (`@cleanlagos/shared-redux-store`)

**Purpose**: Cross-platform state management

**Features**:
- Platform detection (React Native vs Web)
- Automatic storage selection (AsyncStorage vs LocalStorage)
- Token management
- API integration
- Redux Persist configuration

**Files**:
- `store.js` - Store configuration
- `services/api.js` - Axios instance with interceptors
- `slices/authSlice.js` - Authentication state
- `slices/reportSlice.js` - Reports state
- `slices/uiSlice.js` - UI state

### 2. Navigation System

**Structure**:
```
AppNavigator (Root)
├── Auth Stack (Unauthenticated)
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   ├── OTPVerificationScreen
│   └── ResetPasswordScreen
│
└── Main Stack (Authenticated)
    ├── CitizenNavigator (role: citizen)
    │   ├── HomeScreen
    │   ├── ReportScreen
    │   └── RewardsScreen
    │
    ├── PspNavigator (role: psp_worker)
    │   ├── TasksScreen
    │   ├── MapScreen
    │   └── HistoryScreen
    │
    ├── RecyclerNavigator (role: recycler)
    │   ├── BrowseScreen
    │   ├── PickupsScreen
    │   └── EarningsScreen
    │
    └── AdminView (role: lawma_admin)
        └── Message: "Use web dashboard"
```

### 3. Error Handling

**Layers**:
1. **ErrorBoundary** - Catches React errors
2. **NavigationErrorHandler** - Handles navigation errors
3. **NetworkErrorHandler** - Handles network errors
4. **API Interceptors** - Handles HTTP errors

### 4. Services

**Available Services**:
- `websocketService.js` - Real-time updates
- `pushNotificationService.js` - Push notifications
- `backgroundLocationService.js` - Location tracking
- `imageProcessingService.js` - Image optimization
- `uploadService.js` - File uploads with retry

## Platform Compatibility

### Storage Abstraction

```javascript
// Automatically detects platform
const storage = {
  getItem: async (key) => {
    if (isReactNative) {
      return await AsyncStorage.getItem(key);
    }
    return localStorage.getItem(key);
  },
  // ... setItem, removeItem
};
```

### API Configuration

```javascript
// Works on both platforms
const API_URL = 
  import.meta?.env?.VITE_API_URL ||  // Vite (web)
  process.env?.REACT_APP_API_URL ||  // React Native
  'http://localhost:5000/api';       // Fallback
```

## Security Features

1. **JWT Token Management**
   - Stored securely in AsyncStorage
   - Automatically added to requests
   - Removed on 401 errors

2. **Role-Based Access**
   - Navigation restricted by role
   - Invalid roles logged out
   - Role validation on backend

3. **Input Validation**
   - Client-side validation
   - Server-side validation
   - Sanitized inputs

## Performance Optimizations

1. **Redux Persist**
   - Only persists necessary data
   - Whitelist strategy
   - Async rehydration

2. **Image Optimization**
   - Compress before upload
   - Resize to max dimensions
   - Progressive loading

3. **Lazy Loading**
   - Screens loaded on demand
   - Code splitting
   - Optimized bundle size

## Development Workflow

```
1. Make changes to code
   ↓
2. Expo hot reloads automatically
   ↓
3. Test on device/simulator
   ↓
4. Check Redux DevTools
   ↓
5. Review console logs
   ↓
6. Commit changes
```

## Testing Strategy

### Unit Tests
- Redux reducers
- Utility functions
- API services

### Integration Tests
- Authentication flow
- Report creation
- Navigation

### E2E Tests
- User journeys
- Role-based features
- Offline scenarios

## Deployment

### Development
```bash
expo start
```

### Staging
```bash
expo publish --release-channel staging
```

### Production
```bash
expo build:android
expo build:ios
```

## Monitoring

### Logs
- Console logs (development)
- Sentry (production errors)
- Analytics (user behavior)

### Metrics
- API response times
- App crashes
- User engagement
- Feature usage

---

This architecture ensures:
- ✅ Cross-platform compatibility
- ✅ Scalable state management
- ✅ Secure authentication
- ✅ Offline support
- ✅ Real-time updates
- ✅ Role-based access control
