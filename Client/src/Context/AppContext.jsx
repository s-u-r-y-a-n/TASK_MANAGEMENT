import { createContext, useState } from "react";

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");

  const value = {
    email,
    setEmail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
