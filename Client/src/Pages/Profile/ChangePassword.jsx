import { useState } from "react";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DialogComponent } from "../../Components/Modal/DialogComponent";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";
import useToast from "../../hooks/useToast";
import axiosInstance from "../../utils/axiosConfig.js";
import { encryptPassword } from "../../utils/passwordEncryption.js";
import "./ChangePassword.scss";

export const ChangePassword = ({ open, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRegex =
    /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/;

  const handleClose = () => {
    setGeneralError("");
    setFieldErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setFormValues({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPassword({ old: false, new: false, confirm: false });
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = value.replace(/\s/g, "");

    setFormValues((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateCredentials = (values) => {
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!values.oldPassword.trim()) {
      errors.oldPassword = "Old Password is required";
    }

    if (!values.newPassword.trim()) {
      errors.newPassword = "New Password is required";
    } else if (!passwordRegex.test(values.newPassword)) {
      errors.newPassword =
        "Must be 8+ characters and contain uppercase, lowercase, number & special character.";
    }

    if (!values.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.newPassword.trim() !== values.confirmPassword.trim()) {
      errors.confirmPassword =
        "New password and confirm password do not match.";
    }

    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (submittedData) => {
    // Falls back to formValues in case submittedData is serialized without custom inputs
    const payload = {
      oldPassword: submittedData.oldPassword || formValues.oldPassword,
      newPassword: submittedData.newPassword || formValues.newPassword,
      confirmPassword:
        submittedData.confirmPassword || formValues.confirmPassword,
    };

    const isValid = validateCredentials(payload);
    if (!isValid) return;

    setLoading(true);
    setGeneralError("");

    try {
      const response = await axiosInstance.post("/change-password", {
        oldPassword: encryptPassword(payload.oldPassword),
        newPassword: encryptPassword(payload.newPassword),
      });

      handleClose();
      showToast(
        "success",
        "Password Changed",
        response.data?.message ||
          "Your password has been changed successfully.",
      );
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        "Failed to change password. Please check your current password.";
      setGeneralError(serverMessage);
      showToast("error", "Password Change Failed", serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Change Password"
      description="Enter your current password and choose a secure new password."
      submitText="Update Password"
      cancelText="Cancel"
      loading={loading}
      maxWidth="xs"
    >
      <Box className="change-password-dialog-content">
        {generalError && (
          <div className="password-error-alert">{generalError}</div>
        )}

        <div className="dialog-form-group">
          <TextField
            id="oldPassword"
            name="oldPassword"
            label="Current Password"
            type={showPassword.old ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter current password"
            disabled={loading}
            value={formValues.oldPassword}
            onChange={handleChange}
            fullWidth
            error={Boolean(fieldErrors.oldPassword)}
            helperText={fieldErrors.oldPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("old")}
                      edge="end"
                      aria-label={
                        showPassword.old ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className="dialog-form-group">
          <TextField
            id="newPassword"
            name="newPassword"
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter new password"
            value={formValues.newPassword}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            error={Boolean(fieldErrors.newPassword)}
            helperText={fieldErrors.newPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("new")}
                      edge="end"
                      aria-label={
                        showPassword.new ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        {formValues.newPassword.length > 0 && (
          <PasswordValidation password={formValues.newPassword} />
        )}

        <div className="dialog-form-group">
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter new password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            error={Boolean(fieldErrors.confirmPassword)}
            helperText={fieldErrors.confirmPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                      edge="end"
                      aria-label={
                        showPassword.confirm ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword.confirm ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </Box>
    </DialogComponent>
  );
};
