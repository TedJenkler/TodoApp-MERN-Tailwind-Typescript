
import { configureStore } from '@reduxjs/toolkit';
import stateReducer from './features/state/stateSlice';

const store = configureStore({
  reducer: {
    stateSlice: stateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;