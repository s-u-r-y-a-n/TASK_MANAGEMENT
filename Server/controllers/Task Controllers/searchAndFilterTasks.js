import mongoose from "mongoose";
import TaskModel from "../../models/taskModel.js";
import TaskListModel from "../../models/taskListModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const priority = ["Low", "Medium", "High"];
const status = ["Pending", "Completed"];

const searchAndFilterTasks = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);
    // GET request filters belong in the query string. Express parses repeated
    // `listId` parameters as an array (for example: ?listId=a&listId=b).
    const listId = req.query?.listId ?? req.query?.["listId[]"];
    const searchInput = normalizeText(req.query.search);
    const priorityInput = normalizeText(req.query.priority);
    const statusInput = normalizeText(req.query.status);
    const dueDateInput = normalizeText(req.query.dueDate);

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

    if (statusInput && !status.includes(statusInput)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Pending or Completed.",
      });
    }

    if (priorityInput && !priority.includes(priorityInput)) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High.",
      });
    }

    let listIds = [];
    if (listId) {
      const listIdArray = (Array.isArray(listId) ? listId : [listId])
        .map(normalizeText)
        .filter(Boolean);

      for (const id of listIdArray) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: `List ID ${id} is invalid.`,
          });
        }
      }
      listIds = listIdArray;
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

    let filter = {
      userId,
    };

    if (listIds.length > 0) {
      // User selected specific lists
      const validListIds = await TaskListModel.find(
        { _id: { $in: listIds }, userId },
        "_id",
      );

      if (validListIds.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No valid task lists found.",
        });
      }

      if (validListIds.length !== listIds.length) {
        return res.status(404).json({
          success: false,
          message: "Some task lists not found or unauthorized.",
        });
      }

      const validIds = validListIds.map((list) => list._id);
      filter.listId = { $in: validIds };
    } else {
      // No lists selected - get all lists for this user
      const userLists = await TaskListModel.find({ userId }, "_id");
      if (userLists.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No task lists found.",
          data: [],
          pagination: {
            total: 0,
            limit: 50,
            skip: 0,
            hasMore: false,
          },
        });
      }
      const allListIds = userLists.map((list) => list._id);
      filter.listId = { $in: allListIds };
    }

    if (searchInput) {
      filter.$or = [
        { title: new RegExp(searchInput, "i") },
        { description: new RegExp(searchInput, "i") },
      ];
    }

    if (priorityInput) {
      filter.priority = priorityInput;
    }

    if (statusInput) {
      filter.status = statusInput;
    }

    if (dueDate) {
      filter.dueDate = { $lte: dueDate };
    }

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = Math.max(parseInt(req.query.skip) || 0, 0);

    const populatedTasks = await TaskModel.find(filter)
      .populate("listId", "listName")
      .sort({ dueDate: 1, priority: 1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const tasks = populatedTasks.map((task) => ({
      ...task,
      listName: task.listId?.listName || "",
      listId: task.listId?._id || task.listId,
    }));

    const totalCount = await TaskModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Tasks found successfully.",
      data: tasks,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Search and Filter Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message:
        "We could not search and filter the tasks right now. Please try again.",
    });
  }
};

export default searchAndFilterTasks;
