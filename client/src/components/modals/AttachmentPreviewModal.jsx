import React, { useEffect } from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";

export default function AttachmentPreviewModal({
  isOpen,
  onClose,
  attachment,
  onDownload,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !attachment) return null;

  const isImage = (url) => {
    return (
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url) ||
      attachment.attachmentType === "image"
    );
  };

  const isPDF = (url) => {
    return /\.pdf$/i.test(url);
  };

  const renderPreview = () => {
    const { fileUrl, fileName } = attachment;

    if (isImage(fileUrl)) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden min-h-[300px]">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[70vh] object-contain shadow-sm"
          />
        </div>
      );
    }

    if (isPDF(fileUrl)) {
      return (
        <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-gray-200">
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-full"
            title={fileName}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
          <FileText size={48} className="text-blue-500" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2 truncate max-w-xs px-4">
          {fileName}
        </h4>
        <p className="text-gray-500 mb-6 font-medium">
          Preview not available for this file type
        </p>
        <button
          onClick={() => onDownload(attachment)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Download size={18} />
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-10000 flex items-center justify-center p-4 backdrop-blur-sm modal-backdrop-enter">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden modal-content-enter">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 truncate max-w-md">
              {attachment.fileName}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Attachment Preview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownload(attachment)}
              className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto bg-gray-50/50">
          {renderPreview()}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-white flex justify-between items-center text-xs text-gray-400 font-medium">
          <span>NexManage File Viewer</span>
          <a
            href={attachment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
          >
            Open Original <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
