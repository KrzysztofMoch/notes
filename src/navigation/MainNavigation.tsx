import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';

const Stack = createNativeStackNavigator();

const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
      <Stack.Screen name="Note" component={NoteScreen} options={noteScreen} />
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
