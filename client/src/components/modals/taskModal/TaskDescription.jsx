export default function TaskDescription({ description }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Description</h3>
      <p className="rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
        {description || "No description provided."}
      </p>
    </section>
  );
}