import React, { useState } from "react";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "axios";
import useToast from "../../hooks/useToast.js";
import "./ProfileDetails.scss";
import { ChangePassword } from "./ChangePassword.jsx";

export const ProfileDetails = () => {
  const userData = useSelector((state) => state.app.userData);
  const { showSuccess, showError } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const initial = userData?.username
    ? userData.username.trim().charAt(0).toUpperCase()
    : "?";

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  };

  const handleToggleForm = () => {
    setIsChangingPassword((prev) => !prev);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setFormError("");
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!passwordData.oldPassword.trim()) {
      setFormError("Please enter your current password.");
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setFormError("Please enter a new password.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setFormError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError("New password and confirm password do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data?.success) {
        showSuccess(response.data.message || "Password changed successfully.");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to change password. Please check your current password.";
      setFormError(message);
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-details-page">
      <div className="profile-details-card">
        <div className="profile-card-header">
          <div className="avatar-badge">
            <span>{initial}</span>
          </div>
          <h2 className="profile-title">
            {userData?.username || "User Profile"}
          </h2>
          <p className="profile-subtitle">{userData?.email}</p>
        </div>

        <div className="profile-card-body">
          <div className="info-group">
            <div className="info-icon">
              <PersonIcon fontSize="small" />
            </div>
            <div className="info-content">
              <label>Username</label>
              <p>{userData?.username || "—"}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon">
              <EmailIcon fontSize="small" />
            </div>
            <div className="info-content">
              <label>Email Address</label>
              <p>{userData?.email || "—"}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon">
              <CalendarTodayOutlinedIcon fontSize="small" />
            </div>
            <div className="info-content">
              <label>Account Created</label>
              <p>{formattedDate}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-icon">
              <VerifiedUserOutlinedIcon fontSize="small" />
            </div>
            <div className="info-content">
              <label>Account Status</label>
              <span
                className={`status-tag ${
                  userData?.isAccountVerified ? "verified" : "unverified"
                }`}
              >
                {userData?.isAccountVerified
                  ? "Verified"
                  : "Pending Verification"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-card-footer">
          <div className="section-divider">
            <span>Security</span>
          </div>
          <div className="security-placeholder">
            <div>
              <p className="section-subtext">Password & Authentication</p>
              <span className="info-hint">
                Change your password to keep your account safe
              </span>
            </div>
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        <ChangePassword
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
};
