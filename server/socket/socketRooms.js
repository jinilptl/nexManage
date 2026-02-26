import { Project } from "../models/project.models.js";

const registerRoomHandlers = (io, socket) => {
  socket.on("join-project", async ({ projectId }) => {
    try {
      if (!projectId) return;

      const userId = socket.user._id;
      const userRole = socket.user.role;

      console.log(
        `🔌 Join Request: User ${userId} (${userRole}) -> Project ${projectId}`,
      );

      if (userRole === "super_admin" || userRole === "admin") {
        const roomName = `project:${projectId}`;
        socket.join(roomName);
        console.log(
          `✅ ${userRole} ${userId} JOINED room ${roomName} (Admin Bypass)`,
        );
        return;
      }

      const project = await Project.findById(projectId);

      if (!project) {
        console.log(`❌ Project not found: ${projectId}`);
        return;
      }

      if (
        project.projectManager &&
        project.projectManager.toString() === userId.toString()
      ) {
        const roomName = `project:${projectId}`;
        socket.join(roomName);
        console.log(`✅ Project Manager ${userId} JOINED room ${roomName}`);
        return;
      }

      const memberMatch = project.projectMembers.find((member) => {
        const memberUserId = member.user?._id || member.user;
        if (!memberUserId) return false;

        return (
          memberUserId.toString() === userId.toString() &&
          member.status === "active"
        );
      });

      if (!memberMatch) {
        console.log(
          `⛔ Access Denied: User ${userId} is NOT an active member of Project ${projectId}`,
        );

        socket.emit("error", { message: "Access denied to project room" });
        return;
      }

      const roomName = `project:${projectId}`;
      socket.join(roomName);

      console.log(`✅ Member ${userId} JOINED room ${roomName}`);
    } catch (error) {
      console.error("join-project error:", error.message);
    }
  });

  socket.on("leave-project", ({ projectId }) => {
    if (!projectId) return;

    const roomName = `project:${projectId}`;
    socket.leave(roomName);

    console.log(`👤 User ${socket.user._id} left room ${roomName}`);
  });
};

export { registerRoomHandlers };
