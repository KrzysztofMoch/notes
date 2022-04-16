import { combineReducers, configureStore } from '@reduxjs/toolkit';
import settingsSlice from './settingsSlice';

const store = configureStore({
  reducer: {
    settings: settingsSlice
  },
});

const rootReducer = combineReducers({
  settings: settingsSlice
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default store;