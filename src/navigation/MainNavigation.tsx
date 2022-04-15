import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
      <Stack.Screen name="Note" component={HomeScreen} options={noteScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const homeScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const noteScreen: NativeStackNavigationOptions = {
  headerShown: false,
};

export default MainNavigation;
