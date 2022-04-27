import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import MainNavigation from './src/navigation/MainNavigation';
import { store, persistor } from './src/redux/store';

const App = () => (
  <SafeAreaView style={StyleSheet.absoluteFill}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={StyleSheet.absoluteFill}>
          <MainNavigation />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  </SafeAreaView>
);

export default App;
