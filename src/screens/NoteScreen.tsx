import { View, Text } from 'react-native';
import React from 'react';
import { MainNavigationParamList } from '../navigation/MainNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import APP_COLORS from '../common/colors';

type NoteScreenProps = NativeStackScreenProps<MainNavigationParamList, 'Note'>;

const NoteScreen: React.FC<NoteScreenProps> = ({ navigation, route }) => {
  // ------------------------- Render Functions -------------------------

  return (
    <View style={{ backgroundColor: APP_COLORS.black }}>
      <Text>Note Screen - {route.params.title}</Text>
    </View>
  );
};

export type { NoteScreenProps };
export default NoteScreen;
