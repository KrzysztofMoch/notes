import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import APP_COLORS from '../common/colors';
import { useNavigation } from '@react-navigation/native';
import AnimationMode from '../types/AnimationMode';
import HomeButton from '../components/HomeButton';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import NoteCard, { CARD_HEIGHT, CARD_MARGIN } from '../components/NoteCard';
import Icon from 'react-native-vector-icons/Ionicons';

const dummyData: Array<{ title: string; text: string }> | [] = [
  {
    title: 'NOTE 1',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
  {
    title: 'NOTE 2',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
  {
    title: 'NOTE 3',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
  {
    title: 'NOTE 4',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
  {
    title: 'NOTE 5',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
  {
    title: 'NOTE 6',
    text: 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex.',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const animationMode = useSharedValue<AnimationMode>('Stand');

  const showPrivacyIcon = useSharedValue<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  const scrollY = useSharedValue<number>(0);
  const isSliding = useSharedValue<boolean>(false);

  const fixedScrollY = useDerivedValue(() => {
    // we dont want activate privacy mode if scrollY is with Decay
    showPrivacyIcon.value = scrollY.value > 300 && !isSliding.value;

    const maxTranslateY = -(CARD_HEIGHT + CARD_MARGIN) * (dummyData.length - 1);
    return Math.max(Math.min(scrollY.value, 0), maxTranslateY);
  }, [scrollY.value]);

  // do animation when back from NoteScreen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      animationMode.value = 'MoveIn';
    });

    return unsubscribe;
  }, [navigation]);

  // ------------------------- Handlers -------------------------

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { y: number }>({
    onStart: (_, context) => {
      context.y = fixedScrollY.value;
    },
    onActive: (event, context) => {
      isSliding.value = false;

      scrollY.value = event.translationY + context.y;
    },
    onEnd: (event) => {
      isSliding.value = true;

      scrollY.value = withDecay({
        velocity: event.velocityY,
      });
    },
  });

  // ------------------------- Render Functions -------------------------

  const renderPrivacyIcon = () => {
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    // ------------------------- Animated Styles -------------------------

    const rPrivacyIconContainer = useAnimatedStyle(() => {
      return {
        width: '100%',
        height: withTiming(showPrivacyIcon.value ? 180 : 0),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }, [showPrivacyIcon.value]);

    // ------------------------- Render Functions -------------------------
    return (
      <Animated.View style={rPrivacyIconContainer}>
        <AnimatedIcon size={80} color={'white'} name={'lock-closed'} />
      </Animated.View>
    );
  };

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
      {renderPrivacyIcon()}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={{ marginTop: 30, flex: 1 }}>
          {dummyData.map((item, index) => (
            <NoteCard
              data={item}
              key={index}
              theme={'BLUE'}
              index={index}
              translateY={fixedScrollY}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: APP_COLORS.black,
  },
});

export default HomeScreen;
