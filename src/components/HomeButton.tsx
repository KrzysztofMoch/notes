import React from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import APP_THEMES, { APP_THEMES_TYPE } from '../common/themes';
import GLOBAL_STYLES from '../common/globalStyles';
import AnimationMode from '../types/AnimationMode';

interface HomeButtonProps {
  style: ViewStyle;
  size: { width: number; height: number };
  position: { bottom: number; right: number };
  navigateTo: string;
  iconName: string;
  iconSize: number;
  theme: APP_THEMES_TYPE;
  animationMode: SharedValue<AnimationMode>;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const HomeButton: React.FC<HomeButtonProps> = ({
  size: SIZE,
  position: POSITION,
  navigateTo,
  iconName: ICON_NAME,
  iconSize: ICON_SIZE,
  theme: THEME,
  animationMode,
}) => {
  const navigation = useNavigation();

  const isPressed = useSharedValue<boolean>(false);
  const iconRotation = useSharedValue<number>(0);

  // ------------------------- Handlers -------------------------

  const handlePress = () => {
    if (isPressed.value) {
      return;
    }

    isPressed.value = true;

    iconRotation.value = withRepeat(withTiming(360, { duration: 400 }), 2, true, () => {
      animationMode.value = 'MoveOut';
    });
  };

  const handleEndAnimation: (finished: boolean | undefined) => void = (finished) => {
    if (!finished) {
      return;
    }

    if (animationMode.value === 'MoveIn') {
      animationMode.value = 'Stand';
      isPressed.value = false;
    } else if (animationMode.value === 'MoveOut') {
      //@ts-ignore
      navigation.navigate(navigateTo);
      isPressed.value = false;
    }
  };

  // ------------------------- Animated Styles -------------------------

  const rContainer = useAnimatedStyle(() => {
    const getWidth: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(SIZE.width, { duration: 700 });
        case 'MoveOut':
          return withTiming(SCREEN_WIDTH, { duration: 700 });
        default:
          return SIZE.width;
      }
    };

    const getHeight: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(SIZE.height, { duration: 700 }, (finished) =>
            runOnJS(handleEndAnimation)(finished),
          );
        case 'MoveOut':
          return withTiming(SCREEN_HEIGHT, { duration: 700 }, (finished) =>
            runOnJS(handleEndAnimation)(finished),
          );
        default:
          return SIZE.height;
      }
    };

    const getRightPosition: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(POSITION.right);
        case 'MoveOut':
          return withTiming(0);
        default:
          return POSITION.right;
      }
    };

    const getBottomPosition: () => number = () => {
      switch (animationMode.value) {
        case 'MoveIn':
          return withTiming(POSITION.bottom);
        case 'MoveOut':
          return withTiming(0);
        default:
          return POSITION.bottom;
      }
    };

    const getDisplay: () => 'flex' | 'none' = () => {
      if (animationMode.value === 'MoveOut' && !isPressed.value) {
        return 'none';
      }

      return 'flex';
    };

    return {
      opacity: withTiming(isPressed.value ? 0.7 : 1),
      width: getWidth(),
      height: getHeight(),
      right: getRightPosition(),
      bottom: getBottomPosition(),
      zIndex: isPressed.value ? 10 : 1,
      display: getDisplay(),
    };
  });

  const rIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${iconRotation.value.toString()}deg` }],
    };
  });

  // ------------------------- Render functions -------------------------

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          {
            backgroundColor: APP_THEMES[THEME].secondary,
            ...GLOBAL_STYLES.flexCenter,
            position: 'absolute',
            borderRadius: 30,
            overflow: 'hidden',
          },
          rContainer,
        ]}
      >
        <AnimatedIcon
          name={ICON_NAME}
          size={ICON_SIZE}
          color={APP_THEMES[THEME].primary}
          style={rIcon}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  addButton: {},
});

export default HomeButton;
