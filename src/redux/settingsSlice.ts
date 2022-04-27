import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APP_THEME, APP_THEMES_NAME } from "../common/themes";

interface SettingsSliceType {
  theme: APP_THEMES_NAME;
  savedTheme: APP_THEMES_NAME;
  customTheme: APP_THEME;
}

const initialState = {
    theme: 'BLUE',
    savedTheme: 'BLUE',
    customTheme: {
      name: 'CUSTOM',
      primary: '#255585',
      secondary: '#9ebedb',
      fontColor: '#fff',
    }
} as SettingsSliceType

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<APP_THEMES_NAME>){
      state.theme = action.payload;
    },
    setCustomThemePrimary(state, action: PayloadAction<string>){
      state.customTheme.primary = action.payload;
    },
    setCustomThemeSecondary(state, action: PayloadAction<string>){
      state.customTheme.secondary = action.payload;
    },
    setCustomThemeFontColor(state, action: PayloadAction<string>){
      state.customTheme.fontColor = action.payload;
    },
  }
})

export const { setTheme, setCustomThemePrimary, setCustomThemeSecondary, setCustomThemeFontColor } = settingsSlice.actions
export default settingsSlice.reducer;