import mongoose from "mongoose";

const taskAttachmentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    attachmentType: {
      type: String,
      enum: ["file", "url"],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      default: null,
    },

    publicId: {
      type: String,
      required: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const TaskAttachment = mongoose.model("TaskAttachment", taskAttachmentSchema);
export { TaskAttachment };
