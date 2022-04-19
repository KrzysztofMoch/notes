import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { MainNavigationParamList } from '../navigation/MainNavigation';
import APP_COLORS from '../common/colors';
import { RootReducer } from '../redux/store';
import APP_THEMES from '../common/themes';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveNote, savePrivateNote } from '../redux/dataSlice';
import { useSharedValue } from 'react-native-reanimated';

type NoteScreenProps = NativeStackScreenProps<MainNavigationParamList, 'Note'>;

const NoteScreen: React.FC<NoteScreenProps> = ({ navigation, route }) => {
  const [title, setTitle] = useState<string>(route.params.title);
  const [text, setText] = useState<string>(route.params.text);
  let id = useSharedValue<number | undefined>(route.params.id);
  const isPrivacyMode = route.params.isPrivacyMode;

  // ------------------------- Utilities -------------------------

  const { settings: SETTINGS, data: DATA } = useSelector((state: RootReducer) => state);
  const dispatch = useDispatch();

  const generateId: () => number = () => {
    const map = (isPrivacyMode ? DATA.privateNotes : DATA.notes).map((note) => note.id);

    let id = 0;

    while (true) {
      if (!map.includes(id)) {
        break;
      }

      id += 1;
    }

    return id;
  };

  useEffect(() => {
    id.value = id.value !== undefined ? id.value : generateId();

    if (title === 'Title' && text === '') {
      //we dont want to save empty notes
      return;
    }

    const _title = title === '' ? 'No title' : title;

    const data = { title: _title, text, id: id.value };

    dispatch(isPrivacyMode ? savePrivateNote(data) : saveNote(data));
  }, [title, text]);

  // ------------------------- Handlers -------------------------

  const handleIconPress = () => {
    navigation.goBack();
  };

  // ------------------------- Render Functions -------------------------

  return (
    <View style={styles.background}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleIconPress}>
          <Icon size={48} name="ios-arrow-back-circle" color={APP_THEMES[SETTINGS.theme].primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.title, { borderColor: APP_THEMES[SETTINGS.theme].primary }]}
          numberOfLines={1}
          allowFontScaling={false}
          onChangeText={setTitle}
          value={title}
          selectTextOnFocus={true}
          selectionColor={APP_THEMES[SETTINGS.theme].secondary}
          scrollEnabled
        />
      </View>
      <TextInput
        style={[styles.text, { borderColor: APP_THEMES[SETTINGS.theme].secondary }]}
        multiline
        allowFontScaling
        onChangeText={setText}
        value={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: APP_COLORS.black,
    padding: 6,
  },
  topBar: {
    height: 48,
    width: '100%',
  },
  title: {
    fontSize: 28,
    borderBottomWidth: 3,
    flex: 1,
    marginLeft: 10,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 52,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    padding: 16,
    fontSize: 18,
    textAlignVertical: 'top',
    flex: 1,
    borderWidth: 3,
    borderRadius: 30,
  },
});

export default NoteScreen;
