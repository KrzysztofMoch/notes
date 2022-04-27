import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import NoteScreen from '../screens/NoteScreen';
import SettingsScreen from '../screens/SettingsScreen';
import APP_COLORS from '../common/colors';

type MainNavigationParamList = {
  Home: undefined;
  Note: { title: string; text: string; id: number | undefined; isPrivacyMode: boolean };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MainNavigationParamList>();

const MainNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={defaultScreenOptions} />
      <Stack.Screen name="Note" component={NoteScreen} options={defaultScreenOptions} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={settingsScreenOptions} />
    </Stack.Navigator>
  </NavigationContainer>
);

const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const settingsScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: APP_COLORS.black,
  },
  headerTintColor: APP_COLORS.white,
  headerTitleAlign: 'center',
};

export type { MainNavigationParamList };
export default MainNavigation;
