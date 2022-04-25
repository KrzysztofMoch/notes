import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APP_THEMES_NAME } from "../common/themes";

interface SettingsSliceType {
  theme: APP_THEMES_NAME;
  savedTheme: APP_THEMES_NAME;
  customTheme: {
    enable: boolean;
    primaryColor: string;
    secondaryColor: string;
    fontColor: string;
  }
}

const initialState = {
    theme: 'BLUE',
    savedTheme: 'BLUE',
    customTheme: {
      enable: false,
      primaryColor: '',
      secondaryColor: '',
      fontColor: '',
    }
} as SettingsSliceType

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<APP_THEMES_NAME>){
      state.theme = action.payload;
    }
  }
})

export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer;