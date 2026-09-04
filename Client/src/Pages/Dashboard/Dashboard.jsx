import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [dashboardMetrics, setDashboardMetrics] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-metrics`);
        setDashboardMetrics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return <div>
    
  </div>;
};
