# CleanLagos - Waste Management Platform

A comprehensive waste management platform for Lagos, Nigeria, featuring a mobile app for citizens and waste collectors, an admin web dashboard, and a backend API.

## 🌟 Project Overview

CleanLagos connects citizens, waste collectors (PSP workers), recyclers, and LAWMA administrators to improve waste management efficiency across Lagos.

### Key Features
- 📱 **Mobile App** - Report waste, track collections, earn rewards
- 💻 **Admin Dashboard** - Monitor operations, manage users, view analytics
- 🔐 **Role-Based Access** - Citizen, PSP Worker, Recycler, Admin roles
- 🗺️ **Location Tracking** - GPS-based waste reporting and collection
- 🎁 **Rewards System** - Points for citizen participation

## 🏗️ Architecture

```
CleanLagos/
├── src/                          # Backend API (Node.js/Express)
├── CleanLagos-Mobile/            # Mobile App (React Native/Expo)
├── cleanLagos-frontend/
│   ├── apps/
│   │   └── admin-dashboard/      # Admin Web Dashboard (React/Vite)
│   └── packages/
│       └── shared/
│           └── redux-store/      # Shared state management
└── MOBILE_ARCHITECTURE.md        # Detailed architecture documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Expo Go app (for mobile testing)

### 1. Backend API

```bash
cd CleanLagos
npm install
npm start
```

Backend runs at: `http://localhost:5000`

### 2. Admin Web Dashboard

```bash
cd cleanLagos-frontend/apps/admin-dashboard
npm install
npm run dev
```

Dashboard runs at: `http://localhost:3000`

### 3. Mobile App

```bash
cd CleanLagos-Mobile
npm install
npm start
```

Scan the QR code with Expo Go app to test on your device.

**Important:** Update the API URL in `CleanLagos-Mobile/.env`:
```
REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000/api
VITE_API_URL=http://YOUR_IP_ADDRESS:5000/api
```

Find your IP:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

## 🔑 Test Accounts

**For Testing Only:** You can use quick login buttons on the login screen, or register a new account.

### Pre-created Test Accounts

#### Citizens
- Phone: `08012345678` | Password: `password123`

#### PSP Workers
- Phone: `08012345679` | Password: `password123`

#### Recyclers
- Phone: `08012345681` | Password: `password123`

#### Admins
- Phone: `08012345680` | Password: `password123`
- **Note:** Admins must use the web dashboard

### Registration Flow

New users must:
1. **Register** - Provide name, phone, email (optional), password, and role
2. **Verify Phone** - Enter 6-digit SMS code (currently not sent, use any 6 digits for testing)
3. **Login** - Use phone and password to access the app

## 📱 Mobile App Features

### For Citizens
- ✅ Register and login with phone number
- ✅ Report waste with photos and location
- ✅ Track report status
- ✅ View rewards points
- ✅ Role-based navigation

### For PSP Workers
- ✅ View assigned collection tasks
- ✅ Update task status
- ✅ Track earnings
- ✅ Map view of collection points

### For Recyclers
- ✅ Browse recyclable materials
- ✅ Schedule pickups
- ✅ Track earnings

### For Admins
- ✅ Message directing to web dashboard
- ✅ Logout functionality

## 💻 Admin Dashboard Features

- 📊 Analytics and reporting
- 👥 User management
- 📍 Report management
- 🗺️ Map visualization
- 📈 Performance metrics

## 🛠️ Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

### Mobile App
- React Native
- Expo
- Redux Toolkit
- React Navigation
- AsyncStorage

### Web Dashboard
- React
- Vite
- Material-UI
- Redux Toolkit
- Recharts

## 🔐 Authentication Flow

1. **New User Registration:**
   - User taps "Register" on login screen
   - Fills in: Full Name, Phone, Email (optional), Password, Role
   - Validation checks all inputs
   - Backend creates user and sends SMS verification code
   - User redirected to verification screen

2. **Phone Verification:**
   - User enters 6-digit code from SMS
   - Backend verifies code
   - User account activated
   - User can now login

3. **Login:**
   - User enters phone + password
   - Validation checks inputs
   - JWT token stored in AsyncStorage (mobile) or localStorage (web)
   - Token automatically attached to API requests
   - Role-based navigation and access control

4. **Persistent Session:**
   - Token persists across app restarts
   - Auto-login on app launch if token valid
   - Auto-logout on token expiration or 401 errors

## 📂 Key Files

### Backend
- `src/controllers/authController.js` - Authentication logic
- `src/models/User.js` - User model with roles
- `src/routes/` - API routes

### Mobile App
- `CleanLagos-Mobile/App.js` - Root component
- `CleanLagos-Mobile/navigation/AppNavigator.js` - Role-based navigation
- `CleanLagos-Mobile/redux-store/` - State management
- `CleanLagos-Mobile/screens/` - App screens

### Admin Dashboard
- `cleanLagos-frontend/apps/admin-dashboard/src/` - Dashboard source
- `cleanLagos-frontend/packages/shared/redux-store/` - Shared Redux store

## 🐛 Troubleshooting

### Mobile App Issues

**Metro Bundler Cache Error:**
```bash
cd CleanLagos-Mobile
npx expo start --clear
```

**Can't Connect to Backend:**
- Ensure backend is running
- Check API URL in `.env` file
- Use your computer's IP address, not `localhost`
- Ensure phone and computer are on same network

**Package Version Warnings:**
```bash
cd CleanLagos-Mobile
npm install react-native-gesture-handler@~2.28.0 react-native-screens@~4.16.0
```

### Web Dashboard Issues

**Port Already in Use:**
```bash
# Change port in vite.config.js or kill the process using port 3000
```

## 📖 Documentation

- `MOBILE_ARCHITECTURE.md` - Detailed mobile app architecture
- `.kiro/specs/mobile-app-integration/` - Feature specifications
  - `requirements.md` - Feature requirements
  - `design.md` - Design document with correctness properties

## 🔄 Development Workflow

1. **Backend First** - Ensure API endpoints are working
2. **Mobile Development** - Test with Expo Go
3. **Web Dashboard** - Build admin features
4. **Integration Testing** - Test end-to-end flows

## 🚧 Current Status

✅ **Completed:**
- Backend API with authentication
- Mobile app with role-based navigation
- Admin web dashboard
- Redux state management
- AsyncStorage persistence
- Login/logout functionality

🔨 **In Progress:**
- Report creation flow
- Real-time updates
- Push notifications

📋 **Planned:**
- Offline mode
- Biometric authentication
- Multi-language support
- Dark mode

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cleanlagos
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Mobile (.env)
```
REACT_APP_API_URL=http://YOUR_IP:5000/api
VITE_API_URL=http://YOUR_IP:5000/api
```

### Web Dashboard (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📞 Support

For issues or questions, please check:
1. This README
2. `MOBILE_ARCHITECTURE.md` for architecture details
3. `.kiro/specs/` for feature specifications

---

**Built with ❤️ for a cleaner Lagos**
