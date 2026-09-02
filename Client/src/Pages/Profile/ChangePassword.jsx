import React, { useState } from "react";
import { DialogComponent } from "../../Components/Modal/DialogComponent";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";
import useToast from "../../hooks/useToast";
import axios from "axios";
import "./ChangePassword.scss";

export const ChangePassword = ({ open, onClose }) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleClose = () => {
    setErrorMessage("");
    setNewPassword("");
    onClose();
  };

  const handleSubmit = async (formValues) => {
    const oldPassword = formValues.oldPassword?.trim();
    const confirmPassword = formValues.confirmPassword?.trim();
    setErrorMessage("");
    if (!oldPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data?.success) {
        showSuccess(response.data.message || "Password changed successfully.");
        handleClose();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to change password. Please check your current password.";
      setErrorMessage(message);
      showError(message);
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
      <div className="change-password-dialog-content">
        {errorMessage && (
          <div className="password-error-alert">{errorMessage}</div>
        )}

        <div className="dialog-form-group">
          <label htmlFor="oldPassword">Current Password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            placeholder="Enter current password"
            disabled={loading}
          />
        </div>

        <div className="dialog-form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {newPassword.length > 0 && (
          <PasswordValidation password={newPassword} />
        )}

        <div className="dialog-form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            disabled={loading}
          />
        </div>
      </div>
    </DialogComponent>
  );
};
