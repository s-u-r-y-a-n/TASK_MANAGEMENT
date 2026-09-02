import { useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Decode JWT token to get expiry time
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Calculate time until token expiry
const getTimeUntilExpiry = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const timeUntilExpiry = expiryTime - currentTime;
  
  return timeUntilExpiry > 0 ? timeUntilExpiry : null;
};

// Refresh token by calling the API
const performTokenRefresh = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refreshtoken`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data.success) {
      // Store new tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Dispatch event to notify about token refresh
      window.dispatchEvent(
        new CustomEvent("tokenRefreshed", {
          detail: {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        })
      );

      return {
        success: true,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return { success: false };
  }
};

export const useTokenRefresh = () => {
  const timerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  const scheduleTokenRefresh = async () => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      return;
    }

    const timeUntilExpiry = getTimeUntilExpiry(accessToken);

    if (!timeUntilExpiry) {
      console.warn("Could not determine token expiry time");
      return;
    }

    // Refresh at 50% of token lifetime (for 1-minute token, refresh at 30 seconds)
    // Or 10 seconds before expiry, whichever is earlier
    const refreshTime = Math.min(timeUntilExpiry * 0.5, timeUntilExpiry - 10000);

    if (refreshTime <= 0) {
      // Token expires soon, refresh immediately
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        await performTokenRefresh(refreshToken);
        isRefreshingRef.current = false;
        // Reschedule after refresh
        scheduleTokenRefresh();
      }
      return;
    }

    console.log(
      `Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
    );

    // Schedule refresh
    timerRef.current = setTimeout(async () => {
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        console.log("Refreshing token...");
        const result = await performTokenRefresh(refreshToken);
        isRefreshingRef.current = false;

        if (result.success) {
          console.log("Token refreshed successfully");
          // Reschedule refresh for the new token
          scheduleTokenRefresh();
        }
      }
    }, refreshTime);
  };

  useEffect(() => {
    // Schedule token refresh on component mount
    scheduleTokenRefresh();

    // Listen for token refresh events and reschedule
    const handleTokenRefreshed = () => {
      console.log("Token refreshed event detected, rescheduling...");
      scheduleTokenRefresh();
    };

    window.addEventListener("tokenRefreshed", handleTokenRefreshed);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
    };
  }, []);

  const manualRefresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken && !isRefreshingRef.current) {
      isRefreshingRef.current = true;
      const result = await performTokenRefresh(refreshToken);
      isRefreshingRef.current = false;
      if (result.success) {
        scheduleTokenRefresh();
      }
      return result;
    }
  };

  return { manualRefresh, scheduleTokenRefresh };
};

export default useTokenRefresh;
