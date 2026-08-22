import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: { currentToast: null },
  reducers: {
    showToast: (state, action) => {
      state.currentToast = action.payload;
    },
  },
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;
