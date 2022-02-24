import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { notesApiService } from "../api/notesApiService";
import authSlice from "./Reducers/authReducer";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { notesApi: notesApiService('127.0.0.1:7000') },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;