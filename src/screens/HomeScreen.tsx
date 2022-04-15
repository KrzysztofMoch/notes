import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import APP_THEMES from '../common/themes';
import APP_COLORS from '../common/colors';
import GLOBAL_STYLES from '../common/globalStyles';
import { RouteProp, useNavigation } from '@react-navigation/native';
import AnimationMode from '../types/AnimationMode';
import HomeButton from '../components/HomeButton';

const HomeScreen = () => {
  const navigation = useNavigation();
  const animationMode = useSharedValue<AnimationMode>('Stand');

  // do animation when back from NoteScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      animationMode.value = 'MoveIn';
    });

    return unsubscribe;
  }, [navigation]);

  // ------------------------- Handlers -------------------------

  // ------------------------- Animated Styles -------------------------

  // ------------------------- Render Functions -------------------------

  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>
      <HomeButton
        style={{
          position: 'absolute',
        }}
        size={{
          width: 70,
          height: 80,
        }}
        position={{
          bottom: 15,
          right: 15,
        }}
        navigateTo={'Note'}
        iconSize={50}
        iconName={'md-add'}
        theme={'BLUE'}
        animationMode={animationMode}
      />
      <HomeButton
        style={{
          position: 'absolute',
        }}
        size={{
          width: 70,
          height: 40,
        }}
        position={{
          bottom: 110,
          right: 15,
        }}
        navigateTo={'Note'}
        iconName={'settings'}
        iconSize={25}
        theme={'BLUE'}
        animationMode={animationMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: APP_COLORS.black,
  },
});

export default HomeScreen;
