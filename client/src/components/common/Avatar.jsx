import React from "react";
import { getAvatarColor } from "../../utils/getAvatarColor";

/**
 * Reusable Avatar Component
 * 
 * @param {Object} props
 * @param {Object} props.user - The user object containing _id, email, or name.
 * @param {string} props.className - Tailwind utility classes (e.g. w-10 h-10 text-lg).
 */
export default function Avatar({ user, className = "" }) {
    // Use user id or email or name to generate a deterministic color
    // ID is preferred as it is guaranteed to be unique
    const identifier = user?._id || user?.email || user?.name || "unknown";

    const { bg, text } = getAvatarColor(identifier);

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    // Provide sensible defaults if not covered by custom className
    const defaultSize = className.includes("w-") || className.includes("h-") ? "" : "w-10 h-10";
    const defaultTextSize = className.includes("text-") ? "" : "text-base";

    return (
        <div
            className={`rounded-full flex items-center justify-center font-bold shrink-0 ${bg} ${text} ${defaultSize} ${defaultTextSize} ${className}`}
            title={user?.name || "Unknown User"}
        >
            {initial}
        </div>
    );
}
