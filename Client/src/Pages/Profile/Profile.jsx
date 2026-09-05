import { useEffect, useState, useId } from "react";
import axiosInstance from "../../utils/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/appSlice.js";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import "./Profile.scss";

export const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = useId();
  const buttonId = `${id}-avatar-btn`;
  const menuId = `${id}-profile-menu`;
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get("/user-details");
        setUserDetails(response.data.data);
        console.log("Fetched user details:", response.data.data);
        dispatch(setUserData(response.data.data));
      } catch (error) {
        console.error(
          "Error fetching user details:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigateAccount = () => {
    handleCloseMenu();
    navigate("/profile-details");
  };

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosInstance.post("/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login", { replace: true });
    }
  };

  if (loading) return null;
  if (!userDetails) return null;

  const initial = userDetails?.username
    ? userDetails.username.trim().charAt(0).toUpperCase()
    : "?";

  return (
    <div className="profile-container">
      <button
        id={buttonId}
        type="button"
        className="profile-avatar-btn"
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpenMenu}
      >
        <span className="profile-avatar-initial">{initial}</span>
      </button>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          list: {
            "aria-labelledby": buttonId,
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.1))",
            mt: 1.2,
            minWidth: 190,
            borderRadius: "10px",
            border: "1px solid #e8edf4",
          },
        }}
      >
        <div className="profile-header-info">
          <p className="user-name">{userDetails.username}</p>
          <p className="user-email">{userDetails.email}</p>
        </div>

        <Divider />

        <MenuItem
          onClick={handleNavigateAccount}
          sx={{ fontSize: "0.9rem", py: 1 }}
        >
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          My Account
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{ fontSize: "0.9rem", py: 1, color: "#dc2626" }}
        >
          <ListItemIcon sx={{ color: "#dc2626" }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};
