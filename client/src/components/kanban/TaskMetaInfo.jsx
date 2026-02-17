import React from "react";

const TaskMetaInfo = ({ attachments, comments }) => (
  <div className="flex items-center gap-3">
    {attachments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Paperclip size={14} className="text-gray-400" />
        <span className="font-medium">{attachments}</span>
      </div>
    )}
    {comments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MessageSquare size={14} className="text-gray-400" />
        <span className="font-medium">{comments}</span>
      </div>
    )}
  </div>
);

export default TaskMetaInfo;
