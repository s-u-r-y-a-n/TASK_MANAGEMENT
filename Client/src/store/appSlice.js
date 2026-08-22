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
      console.log("EMAIL STATE", state);
      console.log("EMAIL ACTION", action);
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      console.log("OTP STATE", state);
      console.log("OTP ACTION", action);
      state.otp = action.payload;
    },
    setIsOtpSubmitted: (state, action) => {
      console.log("IS OTP SUBMITTED STATE", state);
      console.log("IS OTP SUBMITTED ACTION", action);
      state.isOtpSubmitted = action.payload;
    },
    setIsEmailSent: (state, action) => {
      console.log("IS EMAIL SENT STATE", state);
      console.log("IS EMAIL SENT ACTION", action);
      state.isEmailSent = action.payload;
    },
    setSignupDetails: (state, action) => {
      console.log("SIGNUP DETAILS STATE", state);
      console.log("SIGNUP DETAILS ACTION", action);
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
