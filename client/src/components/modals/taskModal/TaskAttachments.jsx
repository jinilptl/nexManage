import { Paperclip, Trash2, Download, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskAttachmentService,
  deleteTaskAttachmentService,
} from "../../../services/taskOperations/taskServices";
import ConfirmationModal from "../ConfirmationModal";
import AttachmentPreviewModal from "../AttachmentPreviewModal";

export default function TaskAttachments({ task, canManage }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const attachmentLoading = useSelector(
    (s) => s.tasks.selectedTaskAttachments.loading,
  );

  const { data: attachments = [] } = useSelector(
    (s) => s.tasks.selectedTaskAttachments,
  );

  // States for modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("attachmentType", "file");
    formData.append("file", file);

    const projId =
      typeof task.project === "object" ? task.project._id : task.project;

    dispatch(addTaskAttachmentService(projId, task._id, formData, token));
    e.target.value = null;
  };

  const handleDownload = async (att) => {
    try {
      const response = await fetch(att.fileUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = att.fileName || "attachment";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback
      window.open(att.fileUrl, "_blank");
    }
  };

  const confirmDelete = async () => {
    if (!attachmentToDelete) return;

    setIsDeleting(true);
    const projId =
      typeof task.project === "object" ? task.project._id : task.project;

    await dispatch(
      deleteTaskAttachmentService(projId, task._id, attachmentToDelete, token),
    );

    setIsDeleting(false);
    setAttachmentToDelete(null);
  };

  const handleOpenPreview = (att) => {
    setSelectedAttachment(att);
    setIsPreviewOpen(true);
  };

  return (
    <section className="mt-8 bg-white/50 rounded-2xl p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2.5 uppercase tracking-wider">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Paperclip size={16} />
          </div>
          Attachments
          <span className="text-xs font-medium text-gray-400 normal-case tracking-normal">
            ({attachments.length})
          </span>
        </h3>

        {canManage && (
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer hover:bg-blue-100 transition-all border border-blue-100 group">
            <span className="group-hover:scale-110 transition-transform">+</span>{" "}
            Add File
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
        )}
      </div>

      {attachmentLoading && attachments.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 py-4 animate-pulse">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          Loading attachments...
        </div>
      )}

      {attachments.length === 0 && !attachmentLoading && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <Paperclip size={24} className="text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 font-medium">
            No attachments yet
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {attachments.map((att) => (
          <div
            key={att._id}
            className="group flex justify-between items-center bg-white hover:bg-blue-50/30 rounded-xl px-4 py-3 border border-gray-100 hover:border-blue-100 transition-all shadow-sm"
          >
            <div
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              onClick={() => handleOpenPreview(att)}
            >
              <div className="p-2 bg-gray-100 text-gray-400 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                <FileText size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {att.fileName}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {new Date(att.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 opacity-100 transition-opacity">
              <button
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                onClick={() => handleOpenPreview(att)}
                title="Preview"
              >
                <Eye size={16} />
              </button>

              <button
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(att);
                }}
                title="Download"
              >
                <Download size={16} />
              </button>

              {canManage && (
                <button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAttachmentToDelete(att._id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Modals */}
      <AttachmentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attachment={selectedAttachment}
        onDownload={handleDownload}
      />

      <ConfirmationModal
        isOpen={!!attachmentToDelete}
        onClose={() => setAttachmentToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Attachment"
        message="Are you sure you want to permanently delete this attachment? This action cannot be undone."
        isLoading={isDeleting}
      />
    </section>
  );
}
