import { combineReducers, configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';
import settingsSlice from './settingsSlice';

const store = configureStore({
  reducer: {
    settings: settingsSlice,
    data: dataSlice,
  },
});

const rootReducer = combineReducers({
  settings: settingsSlice,
  data: dataSlice,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default store;