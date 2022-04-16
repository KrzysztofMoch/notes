import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import MainNavigation from './src/navigation/MainNavigation';
import store from './src/redux/store';

const App = () => (
  <View style={StyleSheet.absoluteFill}>
    <Provider store={store}>
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <MainNavigation />
      </GestureHandlerRootView>
    </Provider>
  </View>
);

export default App;
