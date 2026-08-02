import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    listName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "My Tasks",
    },
  },
  {
    timestamps: true,
  },
);

taskListSchema.index(
  {
    userId: 1,
    listName: 1,
  },
  {
    unique: true,
  },
);

const TaskListModel =
  mongoose.models.taskList || mongoose.model("taskList", taskListSchema);

export default TaskListModel;
