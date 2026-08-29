import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const deleteTask = async (req, res) => {
  try {
    const taskId = normalizeText(req.params?.taskId);
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.body?.listId);

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

    const deletedTask = await TaskModel.findByIdAndDelete(taskId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: deletedTask,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not delete the task right now. Please try again.",
    });
  }
};

export default deleteTask;
