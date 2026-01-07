import mongoose from "mongoose";

const taskActivityLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const TaskActivityLog = mongoose.model(
  "TaskActivityLog",
  taskActivityLogSchema
);

export { TaskActivityLog };
