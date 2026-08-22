import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../../Signup/Signup.jsx";
import Login from "../../Login/Login.jsx";
import OtpInput from "../../OtpInput/OtpInput.jsx";
import PasswordReset from "../../Reset Password/PasswordReset.jsx";
import Task from "../Task/Task.jsx";
import Home from "../Home/Home.jsx";
import { ProtectedRoutes } from "../../../utils/ProtectedRoutes.jsx";
import { TaskList } from "../Task/TaskList.jsx";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpInput />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />}>
          <Route index element={<TaskList />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
