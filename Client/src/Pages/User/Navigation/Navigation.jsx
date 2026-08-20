import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../../Signup/Signup.jsx";
import Login from "../../Login/Login.jsx";
import OtpInput from "../../OtpInput/OtpInput.jsx";
import PasswordReset from "../../Reset Password/PasswordReset.jsx";
import Task from "../Task/Task.jsx";
import Home from "../Home/Home.jsx";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpInput />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<Task />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
