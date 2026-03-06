/**
 * Converts a date value into a human-friendly relative time string.
 * Examples: "Just now", "5 minutes ago", "Yesterday at 3:45 PM", "Mar 3"
 *
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
    if (!date) return "";

    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;

    if (isNaN(diffMs)) return "";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return `Yesterday at ${then.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDay < 7) return `${diffDay} days ago`;

    // Older than a week — show a short date
    return then.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: diffDay > 365 ? "numeric" : undefined });
}
