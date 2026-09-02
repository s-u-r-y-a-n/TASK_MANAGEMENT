import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const editTask = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const taskId = normalizeText(req.params.taskId);
    const listId = normalizeText(req.body?.listId);
    const title = normalizeText(req.body?.taskName);
    const description = normalizeText(req.body?.taskDescription);
    const dueDateInput = normalizeText(req.body?.taskDueDate);
    const priority = normalizeText(req.body?.priority);
    const status = normalizeText(req.body?.status);
    const starredInput = req.body?.starred;
    const removeAttachmentInput = req.body?.removeAttachment;
    const taskFile = req.file || null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "User ID is invalid.",
      });
    }

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Task ID is invalid.",
      });
    }

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({
        success: false,
        message: "List ID is invalid.",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please enter a task name.",
      });
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Task name must be 200 characters or fewer.",
      });
    }

    if (description.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Task description must be 5000 characters or fewer.",
      });
    }

    if (priority && !["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High.",
      });
    }

    if (status && !["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Pending or Completed.",
      });
    }

    let starred = null;
    if (starredInput !== undefined && starredInput !== "") {
      if (typeof starredInput === "boolean") {
        starred = starredInput;
      } else if (starredInput === "true" || starredInput === "false") {
        starred = starredInput === "true";
      } else {
        return res.status(400).json({
          success: false,
          message: "Starred must be true or false.",
        });
      }
    }

    let dueDate = null;
    if (dueDateInput) {
      dueDate = new Date(dueDateInput);
      if (Number.isNaN(dueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Due date is invalid.",
        });
      }
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (task.listId.toString() !== listId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const taskList = await TaskListModel.exists({ _id: listId, userId });
    if (!taskList) {
      return res.status(404).json({
        success: false,
        message: "Task list not found.",
      });
    }

    const updateData = {};
    if (title) {
      updateData.title = title;
    }
    if (req.body?.taskDescription !== undefined) {
      updateData.description = description;
    }
    if (dueDate) {
      updateData.dueDate = dueDate;
    }
    if (priority) {
      updateData.priority = priority;
    }
    if (status) {
      updateData.status = status;
    }
    if (starred !== null) {
      updateData.starred = starred;
    }
    if (removeAttachmentInput === "true") {
      updateData.attachment = null;
    }
    if (taskFile) {
      updateData.attachment = {
        fileName: taskFile.originalname || "",
        fileUrl: `data:${taskFile.mimetype};base64,${taskFile.buffer.toString("base64")}`,
        mimeType: taskFile.mimetype || "",
      };
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Edit Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not update the task right now. Please try again.",
    });
  }
};

export default editTask;
