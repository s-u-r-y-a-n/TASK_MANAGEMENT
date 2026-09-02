import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  otp: "",
  isOtpSubmitted: false,
  isEmailSent: false,
  signupDetails: {},
  
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setIsOtpSubmitted: (state, action) => {
      state.isOtpSubmitted = action.payload;
    },
    setIsEmailSent: (state, action) => {
      state.isEmailSent = action.payload;
    },
    setSignupDetails: (state, action) => {
      state.signupDetails = action.payload;
    },
    
  },
});

export const {
  setEmail,
  setOtp,
  setIsOtpSubmitted,
  setIsEmailSent,
  setSignupDetails,
} = appSlice.actions;

export default appSlice.reducer;
