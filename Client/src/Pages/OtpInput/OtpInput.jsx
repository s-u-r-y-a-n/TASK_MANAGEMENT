import React, { useEffect, useRef, useState } from "react";
import "./OtpInput.scss";
import { TextField } from "@mui/material";
import { Toast } from "primereact/toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OtpInput = ({ length = 6, email }) => {
  const [otpInput, setOtpInput] = useState(Array.from({ length }, () => ""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);
  const toast = useRef(null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  console.log("EMAILFROMOTPINPUT", email);

  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life,
    });
  };

  async function handleOtpSubmit(otp) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-email`, {
        otp,
        email,
      });

      showToast(
        "success",
        "Success",
        response.data.message || "Email verified successfully.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        "Verification Failed",
        error.response?.data?.message || "Unable to verify email.",
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

    if (combinedOtp.length === length) {
      handleOtpSubmit(combinedOtp);
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
      handleOtpSubmit(pastedOtp);
    } else {
      inputRefs.current[pastedOtp.length]?.focus();
    }
  }

  return (
    <div className="otp-parent">
      <Toast ref={toast} />

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
        <button>Resend OTP</button>
      </div>
    </div>
  );
};

export default OtpInput;
