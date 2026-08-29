import mongoose from "mongoose";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const updateList = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    const listId = normalizeText(req.params?.listId);
    const newListName = normalizeText(req.body?.listName);

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

    if (!newListName) {
      return res.status(400).json({
        success: false,
        message: "New list name is required.",
      });
    }

    if (newListName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "List name must be 100 characters or fewer.",
      });
    }

    const existingList = await TaskListModel.findOne({
      userId,
      listName: newListName,
    });

    if (existingList) {
      return res.status(400).json({
        success: false,
        message: "A list with this name already exists.",
      });
    }

    const updatedList = await TaskListModel.findOneAndUpdate(
      { _id: listId, userId },
      { listName: newListName },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({
        success: false,
        message: "List not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "List updated successfully.",
      data: updatedList,
    });
  } catch (error) {
    console.error("Update List Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the list.",
    });
  }
};

export default updateList;
