import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  otp: "",
  isOtpSubmitted: false,
  isEmailSent: false,
  signupDetails: {},
  userData: {},
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
    setUserData: (state, action) => {
      console.log("Setting user data in Redux store:", action.payload);
      state.userData = action.payload;
    },
  },
});

export const {
  setEmail,
  setOtp,
  setIsOtpSubmitted,
  setIsEmailSent,
  setSignupDetails,
  setUserData,
} = appSlice.actions;

export default appSlice.reducer;
