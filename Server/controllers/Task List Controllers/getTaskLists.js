import mongoose from "mongoose";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const getTaskLists = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
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

    const taskLists = await TaskListModel.find({ userId });
    const count = taskLists.length;
    
    return res.status(200).json({
      success: true,
      message: "Task lists retrieved successfully.",
      data: taskLists,
      count,
    });
  } catch (error) {
    console.error("Get Task Lists Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving task lists.",
    });
  }
};

export default getTaskLists;
