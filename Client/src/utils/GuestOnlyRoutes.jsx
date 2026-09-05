import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAccessTokenValid } from "./authToken.js";
import axiosInstance from "./axiosConfig.js";

export const GuestOnlyRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [isGuest, setIsGuest] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkAuthentication = async () => {
      if (!isAccessTokenValid(accessToken)) {
        setIsGuest(true);
        return;
      }

      try {
        await axiosInstance.get("/validate-token", {
          signal: controller.signal,
        });
        setIsGuest(false);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsGuest(true);
        }
      }
    };

    checkAuthentication();

    return () => controller.abort();
  }, [accessToken]);

  if (isGuest === null) return null;

  if (!isGuest) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
