import React from "react";
import "./Starred.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../../Components/TaskCard/TaskCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Starred = () => {
  const [starredTasks, setStarredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarredTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/starred-tasks`);
        setStarredTasks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStarredTasks();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="starred-tasks-container">
          {starredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
