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

    // Cloudinary / S3 / external URL
    fileUrl: {
      type: String,
      required: true,
    },

    // Original filename or link label
    fileName: {
      type: String,
      default: null,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskAttachment = mongoose.model("TaskAttachment", taskAttachmentSchema);
export { TaskAttachment };
