import { useEffect, useRef, useState } from "react";
import "./styles/OtpInput.scss";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import CountdownTimer from "../../Components/PasswordValidation/Timer/CountdownTimer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsOtpSubmitted, setOtp } from "../../store/appSlice";
import useToast from "../../hooks/useToast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OtpInput = ({
  length = 6,
  email,
  isEmailSent,
  resetPasswordSendOtp = () => {},
}) => {
  const [otpInput, setOtpInput] = useState(Array.from({ length }, () => ""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [resetKey, setResetKey] = useState(0);
  const [disable, setDisable] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleResendOtp = async (event) => {
    if (isEmailSent) {
      resetPasswordSendOtp?.(event);
      setResetKey((prev) => prev + 1);
      setDisable(true);
    } else {
      resendVerificationOtp();
      setResetKey((prev) => prev + 1);
      setDisable(true);
    }
  };

  async function handleOtpSubmit(otp) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-email`, {
        otp,
        email,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      showToast(
        "success",
        "Email Verified",
        response.data.message || "Your email has been verified successfully.",
      );
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        "Verification Failed",
        error.response?.data?.message ||
          "We could not verify that code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendVerificationOtp() {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/resend-verification-otp`,
        {
          email,
        },
      );
      showToast(
        "success",
        "Code Sent",
        response.data.message ||
          "A new verification code has been sent to your email.",
      );
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        "Could Not Send Code",
        error.response?.data?.message ||
          "We could not send a new verification code. Please try again.",
      );
    }
  }

  async function handleResetOtpSubmit(otp) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/valiate-reset-otp`, {
        email,
        resetOtp: otp,
      });

      showToast(
        "success",
        "Code Verified",
        response.data.message ||
          "Your code has been verified. You can now set a new password.",
      );
      dispatch(setIsOtpSubmitted(true));
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        "Verification Failed",
        error.response?.data?.message ||
          "We could not verify that code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event, index) {
    const value = event.target.value;

    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);

    const newOtp = [...otpInput];
    newOtp[index] = digit;

    setOtpInput(newOtp);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const combinedOtp = newOtp.join("");

    if (combinedOtp.length === length && !isEmailSent) {
      dispatch(setOtp(combinedOtp));
      handleOtpSubmit(combinedOtp);
    }
    if (combinedOtp.length === length && isEmailSent) {
      dispatch(setOtp(combinedOtp));
      handleResetOtpSubmit(combinedOtp);
    }
  }

  function handleKeyDown(event, index) {
    switch (event.key) {
      case "Backspace":
        if (otpInput[index]) {
          const newOtp = [...otpInput];
          newOtp[index] = "";
          setOtpInput(newOtp);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;

      default:
        break;
    }
  }

  function handleClick(index) {
    const firstEmpty = otpInput.findIndex((digit) => digit === "");

    if (firstEmpty !== -1 && index > firstEmpty) {
      inputRefs.current[firstEmpty]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedOtp) return;

    const newOtp = Array.from({ length }, (_, index) => pastedOtp[index] || "");

    setOtpInput(newOtp);

    if (pastedOtp.length === length) {
      if (isEmailSent) {
        dispatch(setOtp(pastedOtp));
        handleResetOtpSubmit(pastedOtp);
      } else {
        dispatch(setOtp(pastedOtp));
        handleOtpSubmit(pastedOtp);
      }
    } else {
      inputRefs.current[pastedOtp.length]?.focus();
    }
  }

  return (
    <div className="otp-parent">
      <h2 className="otp-title">Verify Your Email</h2>

      <p className="otp-subtitle">
        We've sent a verification code to
        <span>{email}</span>
      </p>

      <div className="otp-inputs">
        {otpInput.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            type="text"
            variant="outlined"
            disabled={isSubmitting}
            inputRef={(element) => {
              inputRefs.current[index] = element;
            }}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => handleClick(index)}
            onPaste={handlePaste}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
              style: {
                textAlign: "center",
                fontSize: "22px",
                fontWeight: 600,
              },
            }}
            sx={{
              width: 60,
              "& .MuiOutlinedInput-root": {
                height: 60,
              },
            }}
          />
        ))}
      </div>

      <p className="otp-info">Enter the 6-digit code to verify your account.</p>

      <div className="otp-resend">
        Didn't receive the code?
        <Button variant="text" disabled={disable} onClick={handleResendOtp}>
          Resend Code
        </Button>
      </div>
      <div>
        <CountdownTimer
          initialTime={10}
          resetKey={resetKey}
          onComplete={() => {
            return setDisable(false);
          }}
        />
      </div>
    </div>
  );
};

export default OtpInput;
