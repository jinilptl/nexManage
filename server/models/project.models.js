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
      ],
      default: "contributor",
    },

    // null = directly added (NOT from any team)
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
  },
  { _id: false }
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

    // Determines project mode (team / personal / mixed)
    projectType: {
      type: String,
      enum: ["team", "personal", "mixed"],
      default: "team",
    },

    // OPTIONAL TEAMS
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    // project manager (optional but usually creator)
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // all project members (team or custom manually added)
    projectMembers: {
      type: [projectMembersSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "onhold", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export { Project };
