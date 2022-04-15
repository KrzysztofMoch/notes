import { combineReducers, configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    
  },
});

const rootReducer = combineReducers({
  
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default store;