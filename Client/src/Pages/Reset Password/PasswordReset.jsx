import { useContext, useState } from "react";
import "./PasswordReset.scss";
import { Box, Button, TextField } from "@mui/material";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import OtpInput from "../OtpInput/OtpInput";
import NewPassword from "../NewPassword/NewPassword";
import useToast from "../../hooks/useToast";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PasswordReset = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { email, setEmail, isOtpSubmitted, isEmailSent, setIsEmailSent } =
    useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const { showToast } = useToast();

  function handleChange(event) {
    setEmail(event.target.value);
    if (error) {
      setError(false);
      setErrorMessage("");
    }
  }

  function validateEmail() {
    const sanitizedEmail = email.trim();

    if (!sanitizedEmail) {
      return "Please enter your registered email";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(sanitizedEmail)) {
      return "Please provide a valid email address";
    }

    return null;
  }

  async function resetPasswordSendOtp(event) {
    event.preventDefault();
    const validationError = validateEmail();

    if (validationError) {
      setError(true);
      setErrorMessage(validationError);
      return;
    }
    setError(false);
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-otp`, { email });
      console.log(response);
      setIsEmailSent(true);
      showToast(
        "success",
        "Code Sent",
        response.data.message ||
          "A password reset code has been sent to your email.",
      );
    } catch (error) {
      console.error("ERROR IN RESET-OTP", error);
      showToast(
        "error",
        "Reset Code Failed",
        error.response?.data?.message ||
          "We could not send a reset code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="password-reset-parent">
        {!isEmailSent && (
          <Box
            component="form"
            className="password-reset-form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="on"
            onSubmit={resetPasswordSendOtp}
          >
            <TextField
              label="Email"
              type="email"
              required
              name="email"
              value={email}
              onChange={handleChange}
              error={error}
              helperText={error ? errorMessage : ""}
              autoComplete="email"
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </Button>
            <p>
              <Link to="/login">Back to login page</Link>
            </p>
          </Box>
        )}

        {isEmailSent && !isOtpSubmitted && (
          <OtpInput
            isEmailSent={isEmailSent}
            setIsEmailSent={setIsEmailSent}
            email={email}
            resetPasswordSendOtp={resetPasswordSendOtp}
          />
        )}
        {isOtpSubmitted && isEmailSent && <NewPassword />}
      </div>
    </>
  );
};

export default PasswordReset;
