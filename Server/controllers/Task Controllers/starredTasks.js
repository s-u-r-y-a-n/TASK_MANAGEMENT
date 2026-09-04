import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const starredTasks = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);

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

    const tasks = await TaskModel.find({
      userId,
      starred: true,
    })
      .populate("listId", "listName")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Starred tasks retrieved successfully.",
      data: tasks,
    });
  } catch (error) {
    console.error("Starred Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message:
        "We could not get the starred tasks right now. Please try again.",
    });
  }
};

export default starredTasks;
