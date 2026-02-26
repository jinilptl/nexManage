export const formatDueDate = (dateString) => {
  if (!dateString) return "No Date";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};
