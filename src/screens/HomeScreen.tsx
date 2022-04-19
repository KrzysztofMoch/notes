import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import LocalAuthentication from 'rn-local-authentication';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import APP_COLORS from '../common/colors';
import { useNavigation } from '@react-navigation/native';
import AnimationMode from '../types/AnimationMode';
import HomeButton from '../components/HomeButton';
import NoteCard, { CARD_HEIGHT, CARD_MARGIN } from '../components/NoteCard';
import { RootReducer } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/settingsSlice';

const HomeScreen = () => {
  const navigation = useNavigation();

  const NOTES_COUNT = useSharedValue<number>(0);
  const showPrivacyIcon = useSharedValue<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  const scrollY = useSharedValue<number>(0);

  const isSliding = useSharedValue<boolean>(false);
  const isAuthWindowOpen = useSharedValue<boolean>(false);

  // ------------------------- Utilities -------------------------

  const dispatch = useDispatch();
  const SETTINGS = useSelector((state: RootReducer) => state.settings);
  const { notes: NOTES, privateNotes: PRIVATE_NOTES } = useSelector(
    (state: RootReducer) => state.data,
  );

  /*
    So why am I using a separate variable for this?
    Well, when I use NOTES.length in fixedScrollY it returns an error
    and that is why I need this approach
  */
  useEffect(() => {
    NOTES_COUNT.value = isPrivacyMode ? PRIVATE_NOTES.length : NOTES.length;
  }, [NOTES, PRIVATE_NOTES]);

  useEffect(() => {
    dispatch(setTheme(isPrivacyMode ? 'PRIVATE' : SETTINGS.savedTheme));
  }, [isPrivacyMode]);

  // ------------------------- Handlers -------------------------

  const handleLocalAuth = () => {
    isAuthWindowOpen.value = true;
    scrollY.value = 0;

    if (!isPrivacyMode) {
      LocalAuthentication.authenticateAsync({
        reason: 'Please authorize yourself to continue',
      })
        .then((response) => {
          if (response.success) {
            setIsPrivacyMode(true);
          } else {
            Alert.alert('Something went wrong. Please try again.');
          }
        })
        .then(() => {
          isAuthWindowOpen.value = false;
        });
    } else {
      setIsPrivacyMode(false);
      isAuthWindowOpen.value = false;
    }
  };

  const fixedScrollY = useDerivedValue(() => {
    // we dont want activate privacy mode if scrollY is with Decay
    showPrivacyIcon.value = scrollY.value > 200 && !isSliding.value;

    const maxTranslateY = -(CARD_HEIGHT + CARD_MARGIN) * (NOTES_COUNT.value - 1);
    return Math.max(Math.min(scrollY.value, 0), maxTranslateY);
  });

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

      if (scrollY.value > 400 && !isAuthWindowOpen.value) {
        runOnJS(handleLocalAuth)();
      }

      scrollY.value = withDecay({
        velocity: event.velocityY,
      });
    },
  });

  // ------------------------- Render Functions -------------------------

  const renderPrivacyIcon = () => {
    // ------------------------- Animated Styles -------------------------

    const rPrivacyIconContainer = useAnimatedStyle(() => {
      return {
        width: '100%',
        height: showPrivacyIcon.value ? withTiming(180) : withTiming(0),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }, [showPrivacyIcon.value]);

    // ------------------------- Render Functions -------------------------
    return (
      <Animated.View style={rPrivacyIconContainer}>
        <Icon size={80} color={'white'} name={isPrivacyMode ? 'lock-open' : 'lock-closed'} />
        <Text style={styles.privacyIconText}>
          {isPrivacyMode ? 'Exit private notes' : 'Go to private notes'}
        </Text>
      </Animated.View>
    );
  };

  const renderAddButton = () => {
    return (
      <HomeButton
        size={{
          width: 70,
          height: 80,
        }}
        position={{
          bottom: 15,
          right: 15,
        }}
        onPress={() => {
          navigation.navigate('Note', {
            title: 'Title',
            text: '',
            isPrivacyMode,
          });
        }}
        iconSize={50}
        iconName={'md-add'}
      />
    );
  };

  const renderSettingsButton = () => (
    <HomeButton
      size={{
        width: 70,
        height: 40,
      }}
      position={{
        bottom: 110,
        right: 15,
      }}
      onPress={() => {
        navigation.navigate('');
      }}
      iconName={'settings'}
      iconSize={25}
    />
  );

  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>
      {renderPrivacyIcon()}
      {renderSettingsButton()}
      {renderAddButton()}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={{ marginTop: 30, flex: 1 }}>
          {(isPrivacyMode ? PRIVATE_NOTES : NOTES).map((item, index) => (
            <NoteCard data={item} key={index} index={index} translateY={fixedScrollY} />
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
  privacyIconText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default HomeScreen;
