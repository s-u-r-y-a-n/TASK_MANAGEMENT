import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const createTask = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.body?.listId);
    const taskName = normalizeText(req.body?.taskName);
    const taskDescription = normalizeText(req.body?.taskDescription);
    const title = normalizeText(req.body?.title);
    const priority = normalizeText(req.body?.priority);
    const status = normalizeText(req.body?.status);
    const starred = normalizeText(req.body?.starred);
    const taskDueDate = normalizeText(req.body?.taskDueDate);
    const taskFile = req.file ? req.file : null;
    const base64File = taskFile ? taskFile.buffer.toString("base64") : null;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is invalid.",
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

    if (!taskName) {
      return res.status(400).json({
        success: false,
        message: "Please enter a task name.",
      });
    }

    if (taskName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Task name must be 100 characters or fewer.",
      });
    }

    const attachment = {
      fileName: taskFile ? taskFile.originalname : "",
      fileUrl: base64File
        ? `data:${taskFile.mimetype};base64,${base64File}`
        : "",
      mimetype: taskFile ? taskFile.mimetype : "",
    };

    const task = await TaskModel.create({
      userId,
      listId,
      taskName,
      taskDescription,
      title,
      priority,
      status,
      starred,
      taskDueDate,
      attachment,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
  }
};

export default createTask;
