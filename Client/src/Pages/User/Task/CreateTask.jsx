import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DialogComponent } from "../../../Components/Modal/DialogComponent";
import { showToast } from "../../../store/toastSlice";
import { setTasks } from "../../../store/taskSlice.js";
import useToast from "../../../hooks/useToast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const CreateTask = () => {
  const { taskLists = [] } = useSelector((state) => state.task);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskFile, setTaskFile] = useState(null);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => {
    return state.task;
  });


  const [taskDetails, setTaskDetails] = useState({
    listId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    starred: false,
  });

  const [errors, setErrors] = useState({
    listId: "",
    title: "",
  });

  const accessToken = localStorage.getItem("accessToken");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleStarredChange = (event) => {
    setTaskDetails((prev) => ({
      ...prev,
      starred: event.target.checked,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setTaskFile(null);
      return;
    }
    setTaskFile(file);
  };

  const removeFile = () => {
    setTaskFile(null);
  };

  const validateTask = () => {
    const newErrors = {};
    if (!taskDetails.listId) {
      newErrors.listId = "Please select a task list";
    }
    if (!taskDetails.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (taskDetails.title.length > 200) {
      newErrors.title = "Task title cannot exceed 200 characters";
    }
    if (taskDetails.description.length > 5000) {
      newErrors.description = "Description cannot exceed 5000 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTaskDetails({
      listId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
      starred: false,
    });
    setTaskFile(null);
    setErrors({
      listId: "",
      title: "",
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setOpen(false);
    resetForm();
  };

  const createTask = async () => {
    const isValid = validateTask();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("listId", taskDetails.listId);
      formData.append("title", taskDetails.title.trim());
      formData.append("description", taskDetails.description.trim());
      if (taskDetails.dueDate) {
        formData.append("dueDate", taskDetails.dueDate);
      }
      formData.append("priority", taskDetails.priority);
      formData.append("status", taskDetails.status);
      formData.append("starred", String(taskDetails.starred));
      if (taskFile) {
        formData.append("taskFile", taskFile);
      }
      const response = await axios.post(
        `${API_BASE_URL}/create-task`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      dispatch(setTasks([...tasks, response.data.data]));
      (showToast(
        "success",
        "Task Created",
        response.data.message || "Your task has been created successfully.",
      ),
        handleClose());
    } catch (error) {
      console.error("Error creating task:", error);
      showToast(
        "success",
        "Task Creation Failed",
        error.response?.data?.message ||
          "We could not create your task right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddTaskIcon />}
        onClick={() => setOpen(true)}
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 2.5,
          py: 1,
          fontWeight: 600,
        }}
      >
        Create Task
      </Button>

      <DialogComponent
        open={open}
        onClose={handleClose}
        onSubmit={createTask}
        title="Create Task"
        description="Add a new task to one of your task lists."
        submitText="Create Task"
        cancelText="Cancel"
        maxWidth="sm"
        loading={isSubmitting}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <FormControl fullWidth required error={Boolean(errors.listId)}>
            <InputLabel id="task-list-label">Task List</InputLabel>
            <Select
              labelId="task-list-label"
              name="listId"
              value={taskDetails.listId}
              onChange={handleChange}
              label="Task List"
            >
              {taskLists.length === 0 ? (
                <MenuItem disabled value="">
                  No task lists available
                </MenuItem>
              ) : (
                taskLists.map((list) => (
                  <MenuItem key={list._id} value={list._id}>
                    {list.name || list.listName || list.title || "Unnamed List"}
                  </MenuItem>
                ))
              )}
            </Select>

            {errors.listId && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.listId}
              </Typography>
            )}
          </FormControl>

          <TextField
            name="title"
            label="Task Title"
            value={taskDetails.title}
            onChange={handleChange}
            fullWidth
            required
            error={Boolean(errors.title)}
            helperText={errors.title || `${taskDetails.title.length}/200`}
            inputProps={{
              maxLength: 200,
            }}
          />

          <TextField
            name="description"
            label="Description"
            value={taskDetails.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            error={Boolean(errors.description)}
            helperText={
              errors.description || `${taskDetails.description.length}/5000`
            }
            inputProps={{
              maxLength: 5000,
            }}
            placeholder="Add more details about this task..."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={taskDetails.dueDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <CalendarTodayIcon
                    sx={{
                      mr: 1,
                      fontSize: 18,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={taskDetails.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={taskDetails.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={taskDetails.starred}
                  onChange={handleStarredChange}
                  icon={<StarIcon />}
                  checkedIcon={<StarIcon />}
                />
              }
              label="Star this task"
              sx={{
                ml: 0,
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Attachment
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {" "}
                (Optional)
              </Typography>
            </Typography>

            {!taskFile ? (
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  minHeight: 100,
                  borderStyle: "dashed",
                  borderWidth: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  py: 2,
                }}
              >
                <CloudUploadIcon
                  sx={{
                    fontSize: 30,
                    color: "primary.main",
                  }}
                />

                <Typography variant="body2" fontWeight={600}>
                  Click to upload a file
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  PDF, images, documents, etc.
                </Typography>

                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  minWidth={0}
                >
                  <AttachFileIcon color="primary" />

                  <Box minWidth={0}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {taskFile.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {(taskFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Stack>

                <IconButton size="small" onClick={removeFile} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </DialogComponent>
    </>
  );
};
