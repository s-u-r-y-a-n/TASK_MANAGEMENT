import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import TaskCard from "../../Components/TaskCard.jsx";
import axiosInstance from "../../utils/axiosConfig.js";
import "./Starred.scss";
import useToast from "../../hooks/useToast.js";
import { useDispatch, useSelector } from "react-redux";

import { setStarredTasks, setTaskStarred } from "../../store/taskSlice.js";

export const Starred = () => {
  const dispatch = useDispatch();
  const { starredTasks, starredTasksLoaded } = useSelector(
    (state) => state.task,
  );
  const [isLoading, setIsLoading] = useState(() => !starredTasksLoaded);
  const [error, setError] = useState("");
  const [undoTask, setUndoTask] = useState(null);
  const pendingUnstarRequest = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const fetchStarredTasks = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await axiosInstance.get("/starred-tasks", {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setIsLoading(false);
        dispatch(setStarredTasks(response.data.data || []));
      } catch (requestError) {
        if (!controller.signal.aborted) {
          console.error("Error fetching starred tasks:", requestError);
          setError(
            requestError.response?.data?.message ||
              "We could not load your starred tasks.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (!starredTasksLoaded) {
      fetchStarredTasks();
    }
    return () => controller.abort();
  }, [dispatch, starredTasksLoaded]);

  const unstarTask = (task) => {
    dispatch(setTaskStarred({ taskId: task._id, starred: false }));
    setUndoTask(task);

    const request = axiosInstance.patch(`/toggle-starred/${task._id}`);
    pendingUnstarRequest.current = { taskId: task._id, request };

    request.catch((requestError) => {
      dispatch(setTaskStarred({ taskId: task._id, starred: true, task }));
      setUndoTask((currentTask) =>
        currentTask?._id === task._id ? null : currentTask,
      );
      console.error("Error unstarring task:", requestError);
      showToast("error", "Update Failed", "We could not unstar this task.");
    });
  };

  const handleUndo = async () => {
    if (!undoTask) return;
    const task = undoTask;
    setUndoTask(null);
    dispatch(setTaskStarred({ taskId: task._id, starred: true, task }));

    let unstarSucceeded = false;
    try {
      const pendingRequest = pendingUnstarRequest.current;
      if (pendingRequest?.taskId === task._id) {
        await pendingRequest.request;
        unstarSucceeded = true;
      }
      const response = await axiosInstance.patch(`/toggle-starred/${task._id}`);
      dispatch(
        setTaskStarred({
          taskId: task._id,
          starred: response.data.data.starred,
          task: response.data.data,
        }),
      );
    } catch (requestError) {
      // If the original unstar failed, the task is already starred on the
      // server, so the optimistic restore above is already correct.
      if (!unstarSucceeded) return;
      console.error("Error restoring starred task:", requestError);
      showToast("error", "Undo Failed", "The task could not be restored.");
    }
  };

  const handleStarClick = (task) => {
    if (task.starred) unstarTask(task);
  };

  return (
    <Box component="section" className="starred-page">
      <div className="starred-header">
        <h1> Starred tasks</h1>
        <p> Keep your most important work in one place.</p>
      </div>

      {isLoading ? (
        <Box className="starred-page__state" aria-label="Loading starred tasks">
          <CircularProgress size={28} />
        </Box>
      ) : error ? (
        <Box className="starred-page__state">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : starredTasks.length === 0 ? (
        <Box className="starred-page__empty">
          <StarBorderOutlinedIcon fontSize="large" />
          <Typography variant="h6" fontWeight={600}>
            No starred tasks yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Star a task from one of your lists to see it here.
          </Typography>
        </Box>
      ) : (
        <Box className="starred-page__tasks">
          {starredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onStar={handleStarClick} />
          ))}
        </Box>
      )}

      <Snackbar
        open={Boolean(undoTask)}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setUndoTask(null);
        }}
        message="Task removed from Starred"
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            Undo
          </Button>
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Starred;
