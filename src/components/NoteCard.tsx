import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import APP_THEMES from '../common/themes';
import { RootReducer } from '../redux/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import APP_COLORS from '../common/colors';
import { removeNote, removePrivateNote } from '../redux/dataSlice';
import getAppTheme from '../common/themes';

interface NoteCardProps {
  data: { title: string; text: string; id: number };
  index: number;
  translateY: SharedValue<number>;
}

// just alias
type longPressGestureEvent = GestureStateChangeEvent<LongPressGestureHandlerEventPayload>;

// height + margin
const CARD_HEIGHT = 200;
const CARD_MARGIN = 20;

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

const NoteCard: React.FC<NoteCardProps> = ({ data, index, translateY }) => {
  const navigation = useNavigation();

  const PAGE_OFFSET = (CARD_HEIGHT + CARD_MARGIN) * index;

  const showRemoveOption = useSharedValue<boolean>(false);
  const menuOpacity = useSharedValue<number>(0);

  type MenuActiveOption = 'NONE' | 'LEFT' | 'RIGHT';
  const activeOption = useSharedValue<MenuActiveOption>('NONE');

  // ------------------------- Utilities -------------------------

  const { settings: SETTINGS } = useSelector((state: RootReducer) => state);
  const dispatch = useDispatch();

  const {
    primary: PRIMARY_COLOR,
    secondary: SECONDARY_COLOR,
    fontColor: FONT_COLOR,
  } = getAppTheme(SETTINGS.theme);

  // ------------------------- Handlers -------------------------

  const handlePress = () => {
    //@ts-ignore
    navigation.navigate('Note', { ...data, isPrivacyMode: SETTINGS.theme === 'PRIVATE' });
  };

  const handleGestureStart = () => {
    showRemoveOption.value = true;
    menuOpacity.value = withTiming(1);
  };

  const handleGestureMove = (event: any) => {
    const eventY = event.allTouches[0].x;

    activeOption.value = eventY > SCREEN_WIDTH / 2 ? 'RIGHT' : 'LEFT';
  };

  const handleGestureEnd = (event: longPressGestureEvent, success: boolean) => {
    if (success) {
      if (event.x > SCREEN_WIDTH / 2) {
        dispatch(SETTINGS.theme === 'PRIVATE' ? removePrivateNote(data.id) : removeNote(data.id));
      }
    }

    const changeVariable = (finished: boolean | undefined) => {
      if (!finished) {
        return;
      }

      showRemoveOption.value = false;
    };

    menuOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      runOnJS(changeVariable)(finished);
    });
  };

  const longPressGesture = Gesture.LongPress()
    .maxDistance(Number.MAX_SAFE_INTEGER)
    .minDuration(1000)
    .onStart(handleGestureStart)
    .onTouchesMove(handleGestureMove)
    .onEnd(handleGestureEnd);

  // ------------------------- Animated Styles -------------------------

  const rCard = useAnimatedStyle(() => {
    return {
      top: translateY.value + PAGE_OFFSET,
    };
  });

  const rCardMenu = useAnimatedStyle(() => {
    return {
      display: showRemoveOption.value ? 'flex' : 'none',
      zIndex: showRemoveOption.value ? 10 : -1,
      opacity: menuOpacity.value,
    };
  });

  const rCardViewLeft = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(activeOption.value === 'LEFT' ? 1.1 : 1) }],
      zIndex: activeOption.value === 'LEFT' ? 10 : 1,
    };
  });

  const rCardViewRight = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(activeOption.value === 'RIGHT' ? 1.1 : 1) }],
      zIndex: activeOption.value === 'RIGHT' ? 10 : 1,
    };
  });

  // ------------------------- Render Functions -------------------------

  const renderCard = () => (
    <TouchableOpacity
      style={{
        overflow: 'hidden',
        backgroundColor: SECONDARY_COLOR,
        width: '100%',
        height: '100%',
        borderRadius: 30,
      }}
      onPress={handlePress}
    >
      <View style={[styles.titleContainer, { borderColor: PRIMARY_COLOR }]}>
        <Text style={[styles.title, , { color: FONT_COLOR }]}>{data.title}</Text>
      </View>
      <Text style={[styles.text, { color: FONT_COLOR }]}>{data.text}</Text>
    </TouchableOpacity>
  );

  const renderCardMenu = () => (
    <Animated.View style={[styles.cardMenu, rCardMenu]}>
      <Animated.View style={[styles.cardView, styles.cardViewRight, rCardViewRight]}>
        <Icon name="trash-can" size={70} color={APP_COLORS.white} />
      </Animated.View>
      <Animated.View style={[styles.cardView, styles.cardViewLeft, rCardViewLeft]}>
        <Icon name="cancel" size={70} color={APP_COLORS.white} />
      </Animated.View>
    </Animated.View>
  );

  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={[styles.background, rCard]}>
        {renderCard()}
        {renderCardMenu()}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  background: {
    height: CARD_HEIGHT,
    position: 'absolute',
    width: '90%',
    left: '5%',
    right: '5%',
  },
  cardMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cardView: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 30,
  },
  cardViewRight: {
    right: 0,
    backgroundColor: 'red',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  cardViewLeft: {
    left: 0,
    backgroundColor: 'gray',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: '500',
  },
  titleContainer: {
    width: '90%',
    marginHorizontal: '5%',
    height: 40,
    borderBottomWidth: 3,
  },
  text: {
    opacity: 0.8,
    flex: 1,
    display: 'flex',
    padding: 10,
  },
});

export { CARD_HEIGHT, CARD_MARGIN };
export default NoteCard;
