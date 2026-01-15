import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';

import { store, persistor } from './redux-store/src';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 }}>🌿 CleanLagos</Text>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
          </View>
        } 
        persistor={persistor}
      >
        <StatusBar style="auto" />
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

registerRootComponent(App);

export default App;
