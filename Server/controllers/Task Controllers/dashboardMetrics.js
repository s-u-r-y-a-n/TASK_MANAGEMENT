import mongoose from "mongoose";
import TaskListModel from "../../models/taskListModel.js";
import TaskModel from "../../models/taskModel.js";
import { normalizeText } from "../../utils/inputFields.js";

const dashboardMetrics = async (req, res) => {
  try {
    const userId = normalizeText(req.user?.id);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "A valid User ID is required.",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    // Run task aggregation and list lookup concurrently in parallel
    const [taskStatsResult, taskLists] = await Promise.all([
      TaskModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $facet: {
            // 1. Overall counts
            overview: [
              {
                $group: {
                  _id: null,
                  totalTasks: { $sum: 1 },
                  completedTasks: {
                    $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                  },
                  pendingTasks: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                  },
                  starredTasks: {
                    $sum: { $cond: [{ $eq: ["$starred", true] }, 1, 0] },
                  },
                  hasAttachments: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ifNull: ["$attachment.fileName", false] },
                            { $ne: ["$attachment.fileName", ""] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  overdueTasks: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $eq: ["$status", "Pending"] },
                            { $ne: ["$dueDate", null] },
                            { $lt: ["$dueDate", now] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
            ],

            // 2. Status distribution for charts
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],

            // 3. Priority breakdown for charts
            byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],

            // 4. Tasks per list for category charts
            // byList: [{ $group: { _id: "$listId", count: { $sum: 1 } } }],
            // Inside your $facet object in dashboardMetrics.js:
            // 4. Tasks per list for category charts
            byList: [
              {
                $group: {
                  _id: "$listId",
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  // Uses the exact runtime collection name from your model
                  from: TaskListModel.collection.name,
                  localField: "_id",
                  foreignField: "_id",
                  as: "listInfo",
                },
              },
              {
                $unwind: {
                  path: "$listInfo",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  count: 1,
                  name: { $ifNull: ["$listInfo.listName", "Unassigned"] }, // <-- Changed to listName
                },
              },
            ],
          },
        },
      ]),

      TaskListModel.find({ userId }).select("title color createdAt").lean(),
    ]);

    // Extract facet values (fallback to defaults if user has 0 tasks)
    const metrics = taskStatsResult[0]?.overview[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      starredTasks: 0,
      hasAttachments: 0,
      overdueTasks: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved dashboard metrics.",
      data: {
        summary: {
          ...metrics,
          totalLists: taskLists.length,
        },
        distributions: {
          status: taskStatsResult[0]?.byStatus || [],
          priority: taskStatsResult[0]?.byPriority || [],
          tasksPerList: taskStatsResult[0]?.byList || [],
        },
        taskLists,
      },
    });
  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving dashboard metrics.",
    });
  }
};

export default dashboardMetrics;
