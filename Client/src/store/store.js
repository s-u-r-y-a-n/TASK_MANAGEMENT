import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import toastReducer from "./toastSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    toast: toastReducer,
  },
});
