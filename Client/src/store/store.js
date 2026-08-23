import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import toastReducer from "./toastSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    toast: toastReducer,
    task: taskReducer,
  },
});
