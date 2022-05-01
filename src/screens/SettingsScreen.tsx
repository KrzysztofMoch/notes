import { Dimensions, Linking, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from '../redux/store';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import APP_THEMES, { APP_THEME, APP_THEMES_LIST } from '../common/themes';
import Icon from 'react-native-vector-icons/Ionicons';
import APP_COLORS from '../common/colors';
import ThemePreview from '../components/ThemePreview';
import ColorPicker from 'react-native-wheel-color-picker';
import { useSharedValue } from 'react-native-reanimated';
import {
  setCustomThemeFontColor,
  setCustomThemePrimary,
  setCustomThemeSecondary,
} from '../redux/settingsSlice';

//TODO:
// select theme
// - component for theme preview
// custom color pickers
// link to github

const SettingsScreen = () => {
  const PROFILE_LINK = 'https://github.com/KrzysztofMoch';
  const REPO_LINK = PROFILE_LINK + '/notes';

  const [showPicker, setShowPicker] = useState<boolean>(false);

  type SelectedColorType = 'PRIMARY' | 'SECONDARY' | 'FONT';
  const [selectedColorType, setSelectedColorType] = useState<SelectedColorType>('PRIMARY');

  // TMP variable for color selected in picker
  const color_TMP = useSharedValue<string>('#fff');

  // ------------------------- Utilities -------------------------

  const dispatch = useDispatch();
  const SETTINGS = useSelector((state: RootReducer) => state.settings);

  // ------------------------- Handlers -------------------------

  const handleChangeColor = (save: boolean) => {
    setShowPicker(false);

    if (!save) {
      return;
    }

    switch (selectedColorType) {
      case 'PRIMARY':
        dispatch(setCustomThemePrimary(color_TMP.value));
        break;
      case 'SECONDARY':
        dispatch(setCustomThemeSecondary(color_TMP.value));
        break;
      case 'FONT':
        dispatch(setCustomThemeFontColor(color_TMP.value));
        break;
    }

    console.log(SETTINGS);
  };

  // ------------------------- Render functions -------------------------

  const renderThemeList = () => (
    <View style={styles.themeListContainer}>
      <Text style={styles.title}>Select Theme:</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={APP_THEMES_LIST}
        keyExtractor={({ name }) => name}
        renderItem={({ item }) => <ThemePreview theme={item} />}
      />
    </View>
  );

  const renderColorPicker = () => {
    return (
      <View style={styles.pickerContainer}>
        <View style={styles.pickerBackground}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { textAlign: 'center' }]}>PICK COLOR</Text>
          </View>
          <ColorPicker
            color={color_TMP.value}
            swatches={false}
            gapSize={0}
            onColorChangeComplete={(color) => (color_TMP.value = color)}
          />
          <View style={styles.pickerButtonsContainer}>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: 'red' }]}
              onPress={() => handleChangeColor(false)}
            />
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: 'green' }]}
              onPress={() => handleChangeColor(true)}
            />
          </View>
        </View>
        <View style={styles.pickerContainerBackground} />
      </View>
    );
  };

  const renderCustomThemeMenu = () => {
    // ------------------------- Render functions -------------------------

    const renderColorPreview = (colorType: SelectedColorType, text: string) => {
      const getColor = (): string => {
        switch (colorType) {
          case 'PRIMARY':
            return SETTINGS.customTheme.primary;
          case 'SECONDARY':
            return SETTINGS.customTheme.secondary;
          case 'FONT':
            return SETTINGS.customTheme.fontColor;
          default:
            return '#fff';
        }
      };

      // ------------------------- Handlers -------------------------

      const handlePress = () => {
        setSelectedColorType(colorType);
        setShowPicker(true);
      };

      // ------------------------- Render functions -------------------------
      return (
        <TouchableOpacity style={styles.colorPreview} onPress={handlePress}>
          <Text style={styles.colorPreviewText}>{text}</Text>
          <View style={{ backgroundColor: getColor(), width: '70%', height: 50 }} />
        </TouchableOpacity>
      );
    };

    return (
      <>
        <Text style={styles.title}>Custom Theme</Text>
        <View style={styles.customThemeContent}>
          <ThemePreview theme={SETTINGS.customTheme} />
          <View style={styles.customThemeColors}>
            {renderColorPreview('PRIMARY', 'Primary color')}
            {renderColorPreview('SECONDARY', 'Secondary color')}
            {renderColorPreview('FONT', 'Font color')}
          </View>
        </View>
      </>
    );
  };

  const renderCredecionals = () => {
    // ------------------------- Handlers -------------------------

    const openGithubProfile = () => {
      Linking.openURL(PROFILE_LINK);
    };

    const openGithubRepo = () => {
      Linking.openURL(REPO_LINK);
    };

    // ------------------------- Render functions -------------------------
    return (
      <View style={styles.credecionalsContainer}>
        <TouchableOpacity style={styles.credecionalsButton} onPress={openGithubProfile}>
          <Icon name="md-people-sharp" size={26} />
          <Text style={styles.credecionalsButtonText}>Author: @KrzysztofMoch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.credecionalsButton} onPress={openGithubRepo}>
          <Icon name="logo-github" size={26} />
          <Text style={styles.credecionalsButtonText}>{'Github'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.background}>
      {renderThemeList()}
      {renderCustomThemeMenu()}
      {renderCredecionals()}
      {showPicker && renderColorPicker()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: APP_COLORS.black,
    flexDirection: 'column',
  },
  credecionalsContainer: {
    marginTop: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreview: {
    height: 70,
  },
  colorPreviewText: {
    color: APP_COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  credecionalsButton: {
    marginVertical: 6,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  credecionalsButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: APP_COLORS.white,
  },
  customThemeContent: {
    height: 270,
    width: '100%',
    flexDirection: 'row',
  },
  customThemeColors: {
    marginLeft: 16,
    height: '100%',
    width: Dimensions.get('screen').width - 160,
    paddingLeft: 12,
    justifyContent: 'space-evenly',
  },
  pickerBackground: {
    height: '70%',
    width: '90%',
    zIndex: 10,
    backgroundColor: APP_COLORS.black,
  },
  pickerButton: {
    width: 120,
    height: 50,
  },
  pickerButtonsContainer: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.7,
  },
  title: {
    width: '100%',
    fontSize: 22,
    fontWeight: '600',
    color: APP_COLORS.white,
    paddingHorizontal: 14,
    marginVertical: 7,
  },
  titleContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeListContainer: {
    height: 300,
    width: '100%',
    marginBottom: 16,
  },
});

export default SettingsScreen;
