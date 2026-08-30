import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const getTasksByListId = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.params?.listId);

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

    const taskList = await TaskListModel.exists({ _id: listId, userId });
    if (!taskList) {
      return res.status(404).json({
        success: false,
        message: "Task list not found.",
      });
    }

    const tasks = await TaskModel.find(
      { listId },
      "title description dueDate priority status starred attachment",
    ).sort({ dueDate: 1, priority: 1 });

    return res.status(200).json({
      success: true,
      message: "Tasks found successfully.",
      data: tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not get the tasks right now. Please try again.",
    });
  }
};

export default getTasksByListId;
