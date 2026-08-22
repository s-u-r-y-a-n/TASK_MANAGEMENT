import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return false;

    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map(
            (character) =>
              `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`,
          )
          .join(""),
      ),
    );
    return (
      typeof decodedPayload.exp === "number" &&
      decodedPayload.exp * 1000 > Date.now()
    );
  } catch {
    return false;
  }
};

export const ProtectedRoutes = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const validateAccessToken = async () => {
      if (!isAccessTokenValid(accessToken)) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/validate-token`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        setIsAuthenticated(true);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setIsAuthenticated(false);
        }
      }
    };

    validateAccessToken();

    return () => controller.abort();
  }, [accessToken]);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
