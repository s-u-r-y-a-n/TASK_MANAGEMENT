import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import TaskCard from "../../../Components/TaskCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../../store/taskSlice.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const FetchTasks = ({ selectedList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { search, priority, status, dueDate } = useSelector(
    (state) => state.task.filters,
  );

  const { tasks } = useSelector((state) => state.task);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/search-and-filter-tasks`,
          {
            params: {
              search,
              priority,
              status,
              dueDate,
              // limit: 20,
              // skip: 0,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          },
        );
        dispatch(setTasks(response.data.data));
        setTasks(response.data.data);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching tasks:", error);
        setError(error.response?.data?.message || "An error occurred.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();

    return () => controller.abort();
  }, [
    accessToken,
    selectedList?._id,
    dispatch,
    search,
    priority,
    status,
    dueDate,
  ]);

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tasks in this list yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </Box>
      )}
    </div>
  );
};
