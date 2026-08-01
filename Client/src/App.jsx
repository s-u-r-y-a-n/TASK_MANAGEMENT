import React from "react";
import Signup from "./Pages/Signup/Signup";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import OtpInput from "./Pages/OtpInput/OtpInput";
import PasswordReset from "./Pages/Reset Password/PasswordReset";
import Timer from "./Pages/Counter/Counter";

const App = () => {
  return (
    <div>
      <Timer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpInput />} />
        <Route path="/reset-password" element={<PasswordReset />} />
      </Routes>
    </div>
  );
};

export default App;
