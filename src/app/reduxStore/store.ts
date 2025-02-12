import { configureStore } from "@reduxjs/toolkit";
import jobActionSlice from "./jobActionSlice";
import dropdownSlice from "./dropdownSlice";
import categorySlice from "./categorySlice";

export const store = configureStore({
  reducer: {
    jobAction: jobActionSlice,
    dropdown: dropdownSlice,
    category: categorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
