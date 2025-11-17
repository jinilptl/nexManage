import mongoose, { mongo } from "mongoose";

//sub schema for members details

const memberSubSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roleInTeam: {
      type: String,
      enum: [
        "team lead",
        "member",
        "developer",
        "tester",
        "manager",
        "designer",
        "QA",
      ],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { _id: false }
);


const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  members: [memberSubSchema],
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Team = mongoose.model("Team", teamSchema);

export { Team };
