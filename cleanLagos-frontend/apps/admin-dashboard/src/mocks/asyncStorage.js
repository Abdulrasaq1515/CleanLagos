// Mock AsyncStorage for web builds
// This file is used by Vite to replace @react-native-async-storage/async-storage
// when building for web, preventing import errors

const AsyncStorage = {
  getItem: async (key) => {
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    return localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    return localStorage.removeItem(key);
  },
  clear: async () => {
    return localStorage.clear();
  },
  getAllKeys: async () => {
    return Object.keys(localStorage);
  },
};

export default AsyncStorage;
