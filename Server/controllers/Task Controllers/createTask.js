import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const createTask = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.body?.listId);
    const title = normalizeText(req.body?.title);
    const description = normalizeText(req.body?.description);
    const dueDateInput = normalizeText(req.body?.dueDate);
    const priority = normalizeText(req.body?.priority);
    const status = normalizeText(req.body?.status);
    const starredInput = req.body?.starred;
    const taskFile = req.file || null;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
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

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High.",
      });
    }

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Pending or Completed.",
      });
    }

    let starred = false;
    if (typeof starredInput === "boolean") {
      starred = starredInput;
    } else if (starredInput !== undefined && starredInput !== "") {
      if (starredInput !== "true" && starredInput !== "false") {
        return res.status(400).json({
          success: false,
          message: "Starred must be true or false.",
        });
      }
      starred = starredInput === "true";
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

    const taskList = await TaskListModel.exists({ _id: listId, userId });
    if (!taskList) {
      return res.status(404).json({
        success: false,
        message: "Task list not found.",
      });
    }

    const attachment = {
      fileName: taskFile?.originalname || "",
      fileUrl: taskFile
        ? `data:${taskFile.mimetype};base64,${taskFile.buffer.toString("base64")}`
        : "",
      mimeType: taskFile?.mimetype || "",
    };

    const task = await TaskModel.create({
      userId,
      listId,
      title,
      description,
      dueDate,
      priority,
      status,
      starred,
      attachment,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not create the task right now. Please try again.",
    });
  }
};

export default createTask;
