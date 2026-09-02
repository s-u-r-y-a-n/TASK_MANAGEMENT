import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to token expiration
    if (
      error.response?.status === 401 &&
      error.response?.data?.message?.toLowerCase().includes("token")
    ) {
      // Prevent infinite loop if token refresh also fails
      if (originalRequest._retry) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        
        console.log("Refreshing token...");
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/refreshtoken`, null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        if (response.data.success) {
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

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
