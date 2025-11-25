import mongoose from "mongoose";

//  sub schema for project module

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

//main schema for project

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },

    // in future.. so check please ... this features keep or not in our module teams 
      // MULTIPLE TEAMS CAN WORK ON SAME PROJECT
    // a project MUST belong to at least 1 team
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true, 
      },
    ],

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },

    projectMembers: [projectMembersSchema], 

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
