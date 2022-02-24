import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducers/authReducer";
import notesReducer from './Reducers/notesReducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;