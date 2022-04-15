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
import Icon from 'react-native-vector-icons/Ionicons';

import APP_THEMES from '../common/themes';
import APP_COLORS from '../common/colors';
import GLOBAL_STYLES from '../common/globalStyles';
import { RouteProp, useNavigation } from '@react-navigation/native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const HomeScreen = () => {
  // this will be dynamically changed in future
  const THEME = 'BLUE';

  const navigation = useNavigation();

  const isPressed = useSharedValue<boolean>(false);
  const iconRotation = useSharedValue<number>(0);

  // MoveIn - The button shrinks and finally animationMode change to Stand
  // MoveOut - The icon disappears and the button zooms to full screen
  // Stand - static values (small button)
  type AnimationMode = 'MoveIn' | 'MoveOut' | 'Stand';
  const animationMode = useSharedValue<AnimationMode>('Stand');

  // do animation when back from NoteScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      animationMode.value = 'MoveIn';
    });

    return unsubscribe;
  }, [navigation]);

  // ------------------------- Handlers -------------------------

  const handlePress = () => {
    if (isPressed.value) {
      return;
    }

    isPressed.value = true;

    iconRotation.value = withRepeat(withTiming(360, { duration: 400 }), 2, true, () => {
      isPressed.value = false;
      animationMode.value = 'MoveOut';
    });
  };

  const handleEndAnimation: (finished: boolean | undefined) => void = (finished) => {
    if (!finished) {
      return;
    }

    if (animationMode.value === 'MoveIn') {
      animationMode.value = 'Stand';
    } else if (animationMode.value === 'MoveOut') {
      navigation.navigate('Note');
    }
  };

  // ------------------------- Animated Styles -------------------------

  const rContainer = useAnimatedStyle(() => {
    const getWidth: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(70, { duration: 700 });
        case 'MoveOut':
          return withTiming(SCREEN_WIDTH, { duration: 700 });
        default:
          return 70;
      }
    };

    const getHeight: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(80, { duration: 700 }, (finished) =>
            runOnJS(handleEndAnimation)(finished),
          );
        case 'MoveOut':
          return withTiming(SCREEN_HEIGHT, { duration: 700 }, (finished) =>
            runOnJS(handleEndAnimation)(finished),
          );
        default:
          return 80;
      }
    };

    const getRightPosition: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(15);
        case 'MoveOut':
          return withTiming(0);
        default:
          return 15;
      }
    };

    const getBottomPosition: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(20);
        case 'MoveOut':
          return withTiming(0);
        default:
          return 20;
      }
    };

    return {
      opacity: withTiming(isPressed.value ? 0.7 : 1),
      width: getWidth(),
      height: getHeight(),
      right: getRightPosition(),
      bottom: getBottomPosition(),
    };
  });

  const rIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${iconRotation.value}deg` }],
      display: animationMode.value === 'Stand' ? 'flex' : 'none',
    };
  });

  // ------------------------- Render Functions -------------------------

  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={[styles.addButton, { backgroundColor: APP_THEMES[THEME].secondary }, rContainer]}
        >
          <AnimatedIcon name="md-add" size={50} color={APP_THEMES[THEME].primary} style={rIcon} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    ...GLOBAL_STYLES.flexCenter,
    position: 'absolute',
    borderRadius: 30,
    overflow: 'hidden',
  },
  background: {
    backgroundColor: APP_COLORS.black,
  },
});

export default HomeScreen;
