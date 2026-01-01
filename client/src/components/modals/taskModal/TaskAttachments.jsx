import { Paperclip, Download } from "lucide-react";

export default function TaskAttachments({ attachments, setAttachments }) {
  const addAttachment = (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAttachments([
      ...attachments,
      {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: "#",
      },
    ]);
  };

  return (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Attachments</h3>

      {attachments.map((file, i) => (
        <div
          key={i}
          className="flex justify-between rounded-lg border p-3 text-sm"
        >
          <div className="flex gap-2">
            <Paperclip size={16} />
            {file.name}
          </div>
          <a href={file.url} download className="text-blue-600">
            <Download size={14} /> Download
          </a>
        </div>
      ))}

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border px-3 py-2">
        <Paperclip size={16} /> Add attachment
        <input type="file" hidden onChange={addAttachment} />
      </label>
    </section>
  );
}
