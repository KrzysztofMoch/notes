import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APP_THEMES_TYPE } from "../common/themes";

interface SettingsSliceType {
  theme: APP_THEMES_TYPE;
}

const initialState = {
    theme: 'BLUE',
} as SettingsSliceType

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<APP_THEMES_TYPE>){
      state.theme = action.payload;
    }
  }
})

export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer;