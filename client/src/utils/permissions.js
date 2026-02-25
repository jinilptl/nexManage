/**
 * Reusable helper to check if a user has permissions to manage tasks (Edit, Delete, Add).
 * roles: super_admin, admin, project-manager
 * @param {Object} user - The current user object from auth state.
 * @param {Array} projectMembers - The list of members in the current project.
 * @returns {Boolean}
 */
export const canManageTask = (user, projectMembers) => {
  if (!user) return false;

  // 1. Check global roles
  if (user.role === "super_admin" || user.role === "admin") {
    return true;
  }

  // 2. Check project-specific role
  if (projectMembers && Array.isArray(projectMembers)) {
    const currentMember = projectMembers.find(
      (m) => (m.user?._id || m.user)?.toString() === user._id?.toString(),
    );

    if (currentMember?.roleInProject === "project-manager") {
      return true;
    }
  }

  return false;
};
