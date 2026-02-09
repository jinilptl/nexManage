import { Paperclip, Trash2, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addTaskAttachmentService } from "../../../services/taskOperations/taskServices";

export default function TaskAttachments({ task }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  

  const { data: attachments = [], loading } = useSelector(
    (s) => s.tasks.selectedTaskAttachments
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("attachmentType", "file");
    formData.append("file", file);

    dispatch(addTaskAttachmentService(task.project, task._id, formData, token));
    e.target.value = null;
  };
  
  
function handleDownload(att){
  console.log(att);
  
  window.open(att.fileUrl,"_blank")
}

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Paperclip size={16} /> Attachments
        </h3>

        <label className="text-xs cursor-pointer text-blue-600">
          + Add
          <input type="file" hidden onChange={handleFileUpload} />
        </label>
      </div>

      {loading && (
        <p className="text-xs text-gray-400">Loading attachments...</p>
      )}

      {!loading && attachments.length === 0 && (
        <p className="text-xs text-gray-400">No attachments added</p>
      )}

      <ul className="space-y-2">
        {attachments.map((att) => (
          <li
            key={att._id}
            className="flex justify-between items-center border rounded-lg px-3 py-2"
          >
            <span className="truncate text-sm">{att.fileName}</span>

            <div className="flex gap-3">
              <button className="cursor-pointer" onClick={() => handleDownload(att) }>
                <Download size={16} />
              </button>
              <button className="cursor-pointer" onClick={() => console.log("delete ", att._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
