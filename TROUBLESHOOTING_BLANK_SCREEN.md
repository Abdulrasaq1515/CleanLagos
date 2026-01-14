# Troubleshooting Blank Screen Issue

## Current Status
- ✅ Simplified App.jsx created to isolate the issue
- ✅ Removed Redux dependencies temporarily
- ✅ Basic Material-UI components working

## Steps to Fix

### 1. Test Basic Version
```bash
cd CleanLagos/cleanLagos-frontend/apps/admin-dashboard
npm run dev
```

Visit: http://localhost:3001/ (note: port may be 3001, not 3000)

### 2. Expected Result
You should see:
- Green "CleanLagos Admin Dashboard" title
- Working buttons
- Material-UI styling

### 3. Common Issues

#### Wrong Port
- Dev server may use port 3001 if 3000 is busy
- Check the terminal output for the correct URL

#### Browser Cache
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private mode

#### Console Errors
- Open F12 Developer Tools
- Check Console tab for red errors
- Look for network errors in Network tab

### 4. If Basic Version Works
The issue was likely:
- Redux store configuration
- Missing slice files
- Import path issues with shared package

### 5. Next Steps
Once basic version works, we'll:
1. Add Redux store back gradually
2. Test each component individually
3. Restore full functionality with proper error handling

## Debugging Commands

```bash
# Check if dev server is running
netstat -an | findstr :3001

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Contact
If still having issues, share:
1. Browser console errors
2. Terminal output
3. Which URL you're visiting