import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskList",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    starred: {
      type: Boolean,
      default: false,
    },

    attachment: {
      fileName: {
        type: String,
        default: "",
      },

      fileUrl: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Optimize retrieval of starred tasks for the menu
taskSchema.index({ userId: 1, starred: 1, createdAt: -1 });

// Optimize retrieval of tasks by list & status
taskSchema.index({ userId: 1, listId: 1, status: 1 });

// Optimize dashboard overdue checks
taskSchema.index({ userId: 1, dueDate: 1, status: 1 });

const TaskModel = mongoose.models.task || mongoose.model("task", taskSchema);

export default TaskModel;
