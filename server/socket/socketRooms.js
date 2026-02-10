import { Project } from "../models/project.models.js";

const registerRoomHandlers = (io, socket) => {
  socket.on("join-project", async ({ projectId }) => {
    try {
      if (!projectId) return;

      const userId = socket.user._id;
      const userRole = socket.user.role;

      //  Super admin bypass
      if (userRole === "super_admin") {
        const roomName = `project:${projectId}`;
        socket.join(roomName);

        console.log(`Super Admin ${userId} joined room ${roomName}`);
        return;
      }

      //Fetch project
      const project = await Project.findById(projectId);

      if (!project) {
        console.log("Project not found:", projectId);
        return;
      }

      // Project Manager check
      if (
        project.projectManager &&
        project.projectManager.toString() === userId.toString()
      ) {
        const roomName = `project:${projectId}`;
        socket.join(roomName);

        console.log(`Project Manager ${userId} joined room ${roomName}`);
        return;
      }

      //  Active project member check
      const isActiveMember = project.projectMembers.some(
        (member) =>
          member.user.toString() === userId.toString() &&
          member.status === "active",
      );

      if (!isActiveMember) {
        console.log(` User ${userId} not allowed to join project ${projectId}`);
        return;
      }

      // Join room
      const roomName = `project:${projectId}`;
      socket.join(roomName);

      console.log(`👤 User ${userId} joined room ${roomName}`);
    } catch (error) {
      console.error("join-project error:", error.message);
    }
  });

  // Leave Project Room

  socket.on("leave-project", ({ projectId }) => {
    if (!projectId) return;

    const roomName = `project:${projectId}`;
    socket.leave(roomName);

    console.log(`👤 User ${socket.user._id} left room ${roomName}`);
  });
};

export { registerRoomHandlers };
