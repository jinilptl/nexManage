import mongoose from "mongoose";

const taskStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    color: {
      type: String,
      default: "#9CA3AF",
    },

    order: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const TaskStatus = mongoose.model("TaskStatus", taskStatusSchema);
export { TaskStatus };
