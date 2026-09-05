import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import "./styles/NewPassword.scss";
import { useNavigate } from "react-router-dom";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";
import { useSelector } from "react-redux";
import useToast from "../../hooks/useToast";
import { API_BASE_URL } from "../../utils/apiConfig.js";

const NewPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { email, otp } = useSelector((state) => state.app);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleChange(event) {
    setNewPassword(event.target.value);
  }

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

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
        "Password Updated",
        response.data.message ||
          "Your password has been updated. Please log in with your new password.",
      );
      navigate("/login");
    } catch (error) {
      showToast(
        "error",
        "Password Reset Failed",
        error.response?.data?.message ||
          "We could not update your password. Please try again.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="new-password-parent">
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
          type={showPassword ? "text" : "password"}
          required
          value={newPassword}
          onChange={handleChange}
          name="newPassword"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
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
