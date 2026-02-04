import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskStatus",
      required: true,
      index: true,
    },

    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },

    completedAt: {
      type: Date,
      index: true,
      default: null,
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

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export { Task };
