import React, { useEffect } from 'react';
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

import APP_THEMES from '../common/themes';
import AnimationMode from '../types/AnimationMode';
import { useSelector } from 'react-redux';
import { RootReducer } from '../redux/store';
import getAppTheme from '../common/themes';

interface HomeButtonProps {
  size: { width: number; height: number };
  position: { bottom: number; right: number };
  iconName: string;
  iconSize: number;
  onPress: () => void;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const HomeButton: React.FC<HomeButtonProps> = ({
  size: SIZE,
  position: POSITION,
  iconName: ICON_NAME,
  iconSize: ICON_SIZE,
  onPress,
}) => {
  const navigation = useNavigation();

  const animationMode = useSharedValue<AnimationMode>('Stand');
  const isPressed = useSharedValue<boolean>(false);
  const iconRotation = useSharedValue<number>(0);

  // ------------------------- Utilities -------------------------

  const SETTINGS = useSelector((state: RootReducer) => state.settings);

  const {
    primary: PRIMARY_COLOR,
    secondary: SECONDARY_COLOR,
    fontColor: FONT_COLOR,
  } = getAppTheme(SETTINGS.theme);

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
      onPress();
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
            backgroundColor: PRIMARY_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            borderRadius: 30,
            overflow: 'hidden',
          },
          rContainer,
        ]}
      >
        <AnimatedIcon name={ICON_NAME} size={ICON_SIZE} color={SECONDARY_COLOR} style={rIcon} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  addButton: {},
});

export default HomeButton;
