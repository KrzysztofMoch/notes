import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, createStore } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from 'redux-persist';
import dataSlice from './dataSlice';
import settingsSlice from './settingsSlice';

const rootReducer = combineReducers({
  settings: settingsSlice,
  data: dataSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer)

const persistor = persistStore(store)

export type RootReducer = ReturnType<typeof rootReducer>; 
export { store, persistor}