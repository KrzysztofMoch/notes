import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { APP_THEME } from '../common/themes';
import APP_COLORS from '../common/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from '../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { setTheme } from '../redux/settingsSlice';

interface ThemePreviewProps {
  theme: APP_THEME;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const { primary: PRIMARY_COLOR, secondary: SECONDARY_COLOR, name: THEME_NAME } = theme;

  // ------------------------- Utilities -------------------------

  const dispatch = useDispatch();
  const SETTINGS = useSelector((state: RootReducer) => state.settings);

  // ------------------------- Handlers -------------------------

  const handlePress = () => {
    if (SETTINGS.theme !== THEME_NAME) {
      dispatch(setTheme(THEME_NAME));
    }
  };

  // ------------------------- Render functions -------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={handlePress}>
        <View style={[styles.card, { backgroundColor: PRIMARY_COLOR }]} />
        <View style={[styles.settingsButton, { backgroundColor: SECONDARY_COLOR }]} />
        <View style={[styles.addNoteButton, { backgroundColor: SECONDARY_COLOR }]} />
        {SETTINGS.theme === THEME_NAME && (
          <Icon name="checkmark-circle" size={24} style={styles.selectedIcon} />
        )}
      </TouchableOpacity>
      <Text style={styles.title}>{theme.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addNoteButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 25,
    height: 30,
    borderRadius: 10,
  },
  card: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 130,
    height: 70,
    borderRadius: 10,
  },
  container: {
    width: 150,
    height: 250,
    margin: 12,
  },
  content: {
    backgroundColor: APP_COLORS.blackLighter,
    height: '90%',
    width: '100%',
    borderRadius: 10,
  },
  title: {
    width: '100%',
    marginTop: '2%',
    height: '8%',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: 10,
    bottom: 45,
    width: 25,
    height: 20,
    borderRadius: 10,
  },
  selectedIcon: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
});

export default ThemePreview;
