import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import APP_THEMES from '../common/themes';
import { RootReducer } from '../redux/store';

interface NoteCardProps {
  data: { title: string; text: string };
  index: number;
  translateY: SharedValue<number>;
}

// height + margin
const CARD_HEIGHT = 200;
const CARD_MARGIN = 20;

const NoteCard: React.FC<NoteCardProps> = ({ data, index, translateY }) => {
  const navigation = useNavigation();
  const PAGE_OFFSET = (CARD_HEIGHT + CARD_MARGIN) * index;

  // ------------------------- Utilities -------------------------

  const SETTINGS = useSelector((state: RootReducer) => state.settings);

  // ------------------------- Handlers

  const handlePress = () => {
    //@ts-ignore
    navigation.navigate('Note', { title: data.title, text: data.text });
  };

  // ------------------------- Animated Styles -------------------------

  const rCard = useAnimatedStyle(() => {
    return {
      top: translateY.value + PAGE_OFFSET,
    };
  });

  // ------------------------- Render Functions -------------------------
  return (
    <Animated.View style={[styles.background, rCard]}>
      <TouchableOpacity
        style={{
          backgroundColor: APP_THEMES[SETTINGS.theme].secondary,
          width: '100%',
          height: '100%',
        }}
        onPress={handlePress}
      >
        <View style={[styles.titleContainer, { borderColor: APP_THEMES[SETTINGS.theme].primary }]}>
          <Text style={[styles.title, , { color: APP_THEMES[SETTINGS.theme].fontColor }]}>
            {data.title}
          </Text>
        </View>
        <Text style={[styles.text, { color: APP_THEMES[SETTINGS.theme].fontColor }]}>
          {data.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: CARD_HEIGHT,
    position: 'absolute',
    width: '90%',
    left: '5%',
    right: '5%',
    borderRadius: 30,
    overflow: 'hidden',
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
