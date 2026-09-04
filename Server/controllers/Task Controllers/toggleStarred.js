import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const toggleStarred = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const taskId = normalizeText(req.params?.taskId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "A valid User ID is required.",
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
        message: "A valid Task ID is required.",
      });
    }

    const task = await TaskModel.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you do not have permission to modify it.",
      });
    }

    task.starred = !task.starred;
    await task.save();

    await task.populate("listId", "listName");

    return res.status(200).json({
      success: true,
      message: `Task ${task.starred ? "starred" : "unstarred"} successfully.`,
      data: task,
    });
  } catch (error) {
    console.error("Toggle Starred Error:", error);
    return res.status(500).json({
      success: false,
      message:
        "We could not toggle the starred status right now. Please try again.",
    });
  }
};

export default toggleStarred;
