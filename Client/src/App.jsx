import React from "react";
import Signup from "./Pages/Signup/Signup";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import OtpInput from "./Pages/OtpInput/OtpInput";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpInput />} />
      </Routes>
    </div>
  );
};

export default App;
