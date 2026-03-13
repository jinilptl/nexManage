import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "member", "observer"],
      default: "member",
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    isTempMember: {
      type: Boolean,
      default: false,
    },
    isObserver: {
      type: Boolean,
      default: false,
    },
    isInvited: {
      type: Boolean,
      default: false,
    },
    inviteToken: {
      type: String,
    },
    inviteTokenExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export { User };
