import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const HomeScreen: React.FC = () => {
  // this will be dynamically changed in future
  const THEME = 'BLUE';
  const navigation = useNavigation();

  // ------------------------- Render Functions -------------------------

  const renderAddButton = () => {
    const isPressed = useSharedValue<boolean>(false);
    const iconRotation = useSharedValue<number>(0);
    const isIconVisible = useSharedValue<boolean>(true);

    // ------------------------- Handlers -------------------------

    const handlePress = () => {
      //navigation.navigate('Note');
      isPressed.value = true;
      iconRotation.value = withRepeat(withTiming(359, { duration: 600 }), 2, true, () => {
        isPressed.value = false;
        isIconVisible.value = false;
      });
    };

    const handleEndAnimation = () => {
      navigation.navigate('Note');
    };

    // ------------------------- Animated Styles -------------------------

    const rContainer = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isPressed.value ? 0.7 : 1),
        width: isIconVisible.value ? 70 : withTiming(SCREEN_WIDTH, { duration: 700 }),
        height: isIconVisible.value
          ? 80
          : withTiming(SCREEN_HEIGHT, { duration: 700 }, (finished) => {
              if (finished === true) {
                runOnJS(handleEndAnimation)();
              }
            }),
        right: isIconVisible.value ? 15 : withTiming(0),
        bottom: isIconVisible.value ? 20 : withTiming(0),
      };
    });

    const rIcon = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${iconRotation.value}deg` }],
        display: isIconVisible.value ? 'flex' : 'none',
      };
    });

    // ------------------------- Render Functions -------------------------

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={[styles.addButton, { backgroundColor: APP_THEMES[THEME].secondary }, rContainer]}
        >
          <AnimatedIcon name="md-add" size={50} color={APP_THEMES[THEME].primary} style={rIcon} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return <View style={[StyleSheet.absoluteFill, styles.background]}>{renderAddButton()}</View>;
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
