import { createContext, useState } from "react";

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [signupDetails, setSignupDetails] = useState({});

  const value = {
    email,
    setEmail,
    otp,
    setOtp,
    signupDetails,
    setSignupDetails,
    isEmailSent,
    setIsEmailSent,
    isOtpSubmitted,
    setIsOtpSubmitted,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
