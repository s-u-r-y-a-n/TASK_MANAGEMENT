import mongoose from "mongoose";
import TaskListModel from "../../models/taskListModel.js";
import TaskModel from "../../models/taskModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const deleteList = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.params?.listId);

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

    const deletedList = await TaskListModel.findOneAndDelete({
      _id: listId,
      userId,
    });

    const tasks = await TaskModel.deleteMany({
      listId,
      userId,
    });

    if (tasks.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    if (!deletedList) {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "List deleted successfully.",
      data: deletedList,
    });
  } catch (error) {
    console.error("Delete List Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the list.",
    });
  }
};

export default deleteList;
