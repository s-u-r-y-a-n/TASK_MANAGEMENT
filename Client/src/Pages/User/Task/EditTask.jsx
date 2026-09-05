import { useState, useEffect } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../utils/axiosConfig.js";
import { DialogComponent } from "../../../Components/Modal/DialogComponent";
import useToast from "../../../hooks/useToast";
import { setTaskStarred, setTasks } from "../../../store/taskSlice.js";
import { FILE_UPLOAD_RULES } from "../../../Config/fileValidation.js";

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

export const EditTask = ({ task, open, onClose, onTaskUpdated }) => {
  const { taskLists = [] } = useSelector((state) => state.task);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskFile, setTaskFile] = useState(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
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

  useEffect(() => {
    if (task && open) {
      setTaskDetails({
        listId: task.listId,
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        starred: task.starred || false,
      });
      setTaskFile(null);
      setRemoveExistingFile(false);
      setErrors({
        listId: "",
        title: "",
      });
    }
  }, [task, open]);

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

  const removeExistingAttachment = () => {
    setRemoveExistingFile(true);
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
    if (taskFile && taskFile.size > FILE_UPLOAD_RULES.maxSize.bytes) {
      newErrors.taskFile = FILE_UPLOAD_RULES.maxSize.message;
    }
    if (
      taskFile &&
      !FILE_UPLOAD_RULES.allowedExtensions.extensions.includes(
        taskFile.name.split(".").pop(),
      )
    ) {
      newErrors.taskFile = FILE_UPLOAD_RULES.allowedExtensions.message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const editTaskSubmit = async () => {
    const isValid = validateTask();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("listId", taskDetails.listId);
      formData.append("taskName", taskDetails.title.trim());
      formData.append("taskDescription", taskDetails.description.trim());
      if (taskDetails.dueDate) {
        formData.append("taskDueDate", taskDetails.dueDate);
      }
      formData.append("priority", taskDetails.priority);
      formData.append("status", taskDetails.status);
      formData.append("starred", String(taskDetails.starred));
      if (removeExistingFile) {
        formData.append("removeAttachment", "true");
      }
      if (taskFile) {
        formData.append("taskFile", taskFile);
      }

      const response = await axiosInstance.put(
        `/edit-task/${task._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? response.data.data : t,
      );
      dispatch(setTasks(updatedTasks));

      const selectedList = taskLists.find(
        (list) =>
          (list._id || list.id) ===
          (response.data.data.listId?._id || response.data.data.listId),
      );
      const taskWithListName = selectedList
        ? {
            ...response.data.data,
            listId: {
              _id: response.data.data.listId?._id || response.data.data.listId,
              listName: selectedList.listName,
            },
          }
        : response.data.data;
      dispatch(
        setTaskStarred({
          taskId: task._id,
          starred: response.data.data.starred,
          task: taskWithListName,
        }),
      );
      showToast(
        "success",
        "Task Updated",
        response.data.message || "Your task has been updated successfully.",
      );
      onTaskUpdated?.();
      handleClose();
    } catch (error) {
      console.error("Error editing task:", error);
      showToast(
        "error",
        "Task Update Failed",
        error.response?.data?.message ||
          "We could not update your task right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={handleClose}
      onSubmit={editTaskSubmit}
      title="Edit Task"
      description="Update your task details."
      submitText="Save Changes"
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
        </Box>

        <TextField
          name="dueDate"
          label="Due Date"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="date"
          value={taskDetails.dueDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={taskDetails.starred}
              onChange={handleStarredChange}
            />
          }
          label="Mark as starred"
        />

        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Attachment
            <Typography component="span" variant="body2" color="text.secondary">
              {" "}
              (Optional)
            </Typography>
          </Typography>

          {!taskFile && !removeExistingFile && task?.attachment?.fileName ? (
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
                mb: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
                <AttachFileIcon color="primary" />

                <Box minWidth={0}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {task.attachment.fileName}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Current attachment
                  </Typography>
                </Box>
              </Stack>

              <IconButton
                size="small"
                onClick={removeExistingAttachment}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : null}

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
              <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
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
              {errors.taskFile && (
                <Typography variant="caption" color="error">
                  {errors.taskFile}
                </Typography>
              )}
              <IconButton size="small" onClick={removeFile} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </DialogComponent>
  );
};
