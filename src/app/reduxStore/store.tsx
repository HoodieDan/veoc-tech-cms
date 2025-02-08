import { configureStore } from "@reduxjs/toolkit";
import jobActionSlice from "./jobActionSlice";

export const store = configureStore({
  reducer: {
    jobAction: jobActionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
