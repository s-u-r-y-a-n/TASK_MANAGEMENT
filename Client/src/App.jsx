import React from "react";
import Signup from "./Pages/Signup/Signup";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import OtpInput from "./Pages/OtpInput/OtpInput";
import PasswordReset from "./Pages/Reset Password/PasswordReset";

const App = () => {
  return (
    <div>
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
