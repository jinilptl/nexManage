import mongoose from "mongoose";

// SUB-SCHEMA: projectMembers

const projectMembersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roleInProject: {
      type: String,
      enum: [
        "project-manager",
        "developer",
        "tester",
        "designer",
        "qa",
        "reviewer",
        "contributor",
        "observer",
      ],
      default: "contributor",
    },

    addedFromTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["active", "removed"],
      default: "active",
    },

    taskStatuses: {
      type: [String],
      default: ["To Do", "In Progress", "Review", "Done"],
    },
  },
  { _id: false },
);

// SUB-SCHEMA: taskStatus (for dynamic and dynamic identification)

const taskStatusSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
  },
  { _id: true },
);

// MAIN PROJECT SCHEMA

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectType: {
      type: String,
      enum: ["team", "personal", "mixed"],
      default: "team",
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    projectMembers: {
      type: [projectMembersSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ON_HOLD", "ARCHIVED"],
      default: "ACTIVE",
    },

    taskStatuses: {
      type: [taskStatusSchema],
      default: undefined,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
export { Project };
