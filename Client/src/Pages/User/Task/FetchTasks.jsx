import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import TaskCard from "../../../Components/TaskCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setTaskStarred, setTasks } from "../../../store/taskSlice.js";
import { EditTask } from "./EditTask.jsx";
import useToast from "../../../hooks/useToast.js";
import { DialogComponent } from "../../../Components/Modal/DialogComponent.jsx";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import Loader from "../../../Components/Loader/Loader.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const FetchTasks = ({ selectedList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { selectedListIds, taskLists } = useSelector((state) => state.task);
  const { search, priority, status, dueDate } = useSelector(
    (state) => state.task.filters,
  );

  const { tasks } = useSelector((state) => state.task);
  const { showToast } = useToast();

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
              listId: selectedListIds,
              search,
              priority,
              status,
              dueDate,
              // limit: 20,
              // skip: 0,
            },
            paramsSerializer: { indexes: null },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          },
        );
        dispatch(setTasks(response.data.data));
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
    selectedListIds,
    dispatch,
    search,
    priority,
    status,
    dueDate,
  ]);

  const handleMenuOpen = (event, task) => {
    setSelectedTask(task);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/delete-task/${selectedTask._id}`, {
        data: {
          listId: selectedTask.listId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedTasks = tasks.filter(
        (task) => task._id !== selectedTask._id,
      );
      dispatch(setTasks(updatedTasks));
      showToast(
        "success",
        "Task Deleted",
        "Your task has been deleted successfully.",
      );
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast(
        "error",
        "Delete Failed",
        error.response?.data?.message ||
          "We could not delete your task right now. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleTask = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const formData = new FormData();
      formData.append("listId", task.listId);
      formData.append("taskName", task.title);
      formData.append("taskDescription", task.description || "");
      formData.append("priority", task.priority);
      formData.append("status", newStatus);
      formData.append("starred", String(task.starred || false));
      if (task.dueDate) {
        formData.append("taskDueDate", task.dueDate);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/edit-task/${task._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? response.data.data : t,
      );
      dispatch(setTasks(updatedTasks));
    } catch (error) {
      console.error("Error updating task status:", error);
      showToast(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "We could not update your task right now. Please try again.",
      );
    }
  };

  const handleStarTask = async (task) => {
    const nextStarredStatus = !task.starred;
    const list = taskLists.find(
      (taskList) => (taskList._id || taskList.id) === task.listId,
    );
    const taskWithListName = list
      ? { ...task, listId: { _id: task.listId, listName: list.listName } }
      : task;

    dispatch(
      setTaskStarred({
        taskId: task._id,
        starred: nextStarredStatus,
        task: taskWithListName,
      }),
    );

    try {
      const response = await axios.put(
        `${API_BASE_URL}/toggle-starred/${task._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      dispatch(
        setTaskStarred({
          taskId: task._id,
          starred: response.data.data.starred,
          task: response.data.data,
        }),
      );
    } catch (error) {
      dispatch(
        setTaskStarred({
          taskId: task._id,
          starred: task.starred,
          task: taskWithListName,
        }),
      );
      console.error("Error updating task starred status:", error);
      showToast(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "We could not update your task right now. Please try again.",
      );
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader message="Loading Tasks" />
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
            <TaskCard
              key={task._id}
              task={task}
              onMenu={handleMenuOpen}
              onToggle={handleToggleTask}
              onStar={handleStarTask}
            />
          ))}
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        className="task-list-action-menu"
        // PaperProps={{
        //   sx: {
        //     boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        //   },
        // }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditOutlined fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteOutlined fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Task Dialog */}
      <EditTask
        task={selectedTask}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onTaskUpdated={() => {
          setSelectedTask(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DialogComponent
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleConfirmDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        submitText="Delete"
        cancelText="Cancel"
        maxWidth="xs"
        loading={isDeleting}
      />
    </div>
  );
};
