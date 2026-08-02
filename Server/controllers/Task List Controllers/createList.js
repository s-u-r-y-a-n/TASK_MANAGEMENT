import mongoose from "mongoose";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const createList = async (req, res) => {
  try {
    const userId = normalizeText(req.body.userId);
    const listName = normalizeText(req.body.listName);

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

    if (!listName) {
      return res.status(400).json({
        success: false,
        message: "Please enter a list name.",
      });
    }

    if (listName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "List name must be 100 characters or fewer.",
      });
    }

    const existingList = await TaskListModel.findOne({
      userId,
      listName,
    });

    if (existingList) {
      return res.status(409).json({
        success: false,
        message: "A task list with this name already exists.",
      });
    }

    const taskList = await TaskListModel.create({
      userId,
      listName,
    });

    return res.status(201).json({
      success: true,
      message: "Task list created successfully.",
      data: taskList,
    });
  } catch (error) {
    console.error("Create List Error:", error);

    return res.status(500).json({
      success: false,
      message: "We could not create the task list right now. Please try again.",
    });
  }
};

export default createList;
