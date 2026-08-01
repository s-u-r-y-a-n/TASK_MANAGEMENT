import React, { useContext, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import "./NewPassword.scss";
import { Toast } from "primereact/toast";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NewPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { email, otp } = useContext(AppContext);
  const [newPassword, setNewPassword] = useState("");
  const toast = useRef(null);

  function handleChange(event) {
    setNewPassword(event.target.value);
  }

  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life,
    });
  };

  async function resetPassword(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword,
        resetOtp: otp,
      });
      console.log(response);
      showToast(
        "success",
        "Success",
        response.data.message || "Email verified successfully.",
      );
    } catch (error) {
      showToast(
        "error",
        "Verification Failed",
        error.response?.data?.message || "Unable to verify email.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="new-password-parent">
      <Toast ref={toast} />

      <Box
        component="form"
        className="new-password-form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="on"
        onSubmit={resetPassword}
      >
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          required
          value={newPassword}
          onChange={handleChange}
          name="newPassword"
        />
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Reset Password"}
        </Button>
      </Box>

      <PasswordValidation password={newPassword} />
    </div>
  );
};

export default NewPassword;
