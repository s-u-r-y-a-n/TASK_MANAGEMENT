import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { ReusablePieChart } from "../../Components/Piechart/ReusablePieChart.jsx";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import "./Dashboard.scss";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader.jsx";

// Semantic palettes for status, priority, and lists
const STATUS_COLORS = {
  Completed: "#10b981",
  Pending: "#f59e0b",
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#3b82f6",
};

const CATEGORY_PALETTE = [
  "#6366f1",
  "#3b82f6",
  "#14b8a6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
];

export const Dashboard = () => {
  const { tasks } = useSelector((state) => state.task);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await axiosInstance.get("/dashboard-metrics");
        if (response.data?.success) {
          setMetrics(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [tasks]);

  if (loading) {
    return <Loader message="Loading Analytics" />;
  }

  const summary = metrics?.summary || {};
  const statusData = metrics?.distributions?.status || [];
  const priorityData = metrics?.distributions?.priority || [];
  const categoryData = metrics?.distributions?.tasksPerList || [];

  const statusColors = statusData.map(
    (item) => STATUS_COLORS[item._id] || "#718096",
  );
  const priorityColors = priorityData.map(
    (item) => PRIORITY_COLORS[item._id] || "#718096",
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor your task flow, category load, and upcoming deadlines.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <AssignmentTurnedInOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Tasks</span>
            <span className="metric-value">{summary.totalTasks ?? 0}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <PendingActionsOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Pending</span>
            <span className="metric-value">{summary.pendingTasks ?? 0}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completed">
            <AssignmentTurnedInOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{summary.completedTasks ?? 0}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon overdue">
            <WarningAmberOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Overdue</span>
            <span className="metric-value">{summary.overdueTasks ?? 0}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon starred">
            <StarBorderOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Starred</span>
            <span className="metric-value">{summary.starredTasks ?? 0}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon lists">
            <FolderOpenOutlinedIcon />
          </div>
          <div className="metric-details">
            <span className="metric-label">Task Lists</span>
            <span className="metric-value">{summary.totalLists ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-item">
          <ReusablePieChart
            title="Tasks by Status"
            data={statusData}
            nameKey="_id"
            dataKey="count"
            innerRadius={55}
            outerRadius={85}
            colors={statusColors}
            height={320}
            showLegend={true}
          />
        </div>

        <div className="chart-item">
          <ReusablePieChart
            title="Tasks by Priority"
            data={priorityData}
            nameKey="_id"
            dataKey="count"
            innerRadius={55}
            outerRadius={85}
            colors={priorityColors}
            height={320}
            showLegend={true}
          />
        </div>

        <div className="chart-item">
          <ReusablePieChart
            title="Tasks by Category"
            data={categoryData}
            nameKey="name"
            dataKey="count"
            innerRadius={55}
            outerRadius={85}
            colors={CATEGORY_PALETTE}
            height={320}
            showLegend={true}
          />
        </div>
      </div>
    </div>
  );
};
