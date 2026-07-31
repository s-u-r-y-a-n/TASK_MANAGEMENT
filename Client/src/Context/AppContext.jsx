import { createContext, useState } from "react";

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const value = {
    email,
    setEmail,
    otp,
    setOtp,
    isEmailSent,
    setIsEmailSent,
    isOtpSubmitted,
    setIsOtpSubmitted
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
