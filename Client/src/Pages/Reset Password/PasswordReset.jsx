import React, { useContext, useState } from "react";
import "../Signup/signup.scss";
import { Box, Button, TextField } from "@mui/material";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import OtpInput from "../OtpInput/OtpInput";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PasswordReset = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { email, setEmail } = useContext(AppContext);
  const [resetOtp, setResetOtp] = useState(false);

  console.log("EMAIL", email);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  async function resetPasswordSendOtp(event) {
    console.log("dfd");
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-otp`, { email });
      console.log(response);
      setResetOtp(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="signup-parent">
      {!resetOtp && (
        <Box
          component="form"
          className="signup-form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="on"
          onSubmit={resetPasswordSendOtp}
        >
          <TextField
            id="outlined-password-input"
            label="Email"
            type="text"
            required
            value={email}
            onChange={handleChange}
            name="email"
          />
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Send Reset OTP"}
          </Button>
        </Box>
      )}

      {resetOtp && <OtpInput resetOtp={resetOtp} email={email} />}
    </div>
  );
};

export default PasswordReset;
