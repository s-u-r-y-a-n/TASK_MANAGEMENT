import React, { useEffect, useState } from "react";
import axios from "axios";

export const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/user-details`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserDetails(response.data.data);
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
  }, [API_BASE_URL]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userDetails) {
    return <p>Unable to load user details.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>

      <p>Name: {userDetails.username}</p>
      <p>Email: {userDetails.email}</p>
      <p>Verified: {userDetails.isAccountVerified ? "Yes" : "No"}</p>
      <p>Created: {new Date(userDetails.createdAt).toLocaleDateString()}</p>
      
    </div>
  );
};
