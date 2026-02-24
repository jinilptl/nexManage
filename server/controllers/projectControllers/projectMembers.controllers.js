import { Project as ProjectModel } from "../../models/project.models.js";
import { User as UserModel } from "../../models/user.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Team as TeamModel } from "../../models/team.models.js";
import sendEmail from "../../utils/sendMail.js";
import { project_invite_email_template } from "../../templates/projectInviteMail.js";
import crypto from "crypto";

const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, roleInProject } = req.body;

  if (!projectId) throw new ApiError(400, "Project ID is required");
  if (!email) throw new ApiError(400, "Email is required");

  const validRoles = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor",
    "observer",
  ];

  if (roleInProject && !validRoles.includes(roleInProject)) {
    throw new ApiError(400, "Invalid roleInProject value");
  }

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  let userDoc = await UserModel.findOne({ email });
  let isNewUser = false;

  if (!userDoc) {
    isNewUser = true;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    userDoc = await UserModel.create({
      name: email.split("@")[0],
      email,
      role: "member",
      isTempMember: true,
      isObserver: true,
      isInvited: true,
      inviteToken: hashedToken,
      inviteTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
      createdby: req.user?._id,
    });

    const userId = userDoc._id;

    const exists = project.projectMembers.find(
      (m) => m.user.toString() === userId.toString(),
    );
    if (exists && exists.status === "active") {
      throw new ApiError(409, "This user is already a member of this project");
    }

    // If previously removed, reactivate
    if (exists && exists.status === "removed") {
      exists.roleInProject = "observer";
      exists.status = "active";
      exists.addedAt = Date.now();
      await project.save();

      try {
        const setPasswordLink = `${process.env.CLIENT_URL}/set-password/${rawToken}`;
        const message = project_invite_email_template(
          project.projectName,
          email,
          setPasswordLink,
          false,
        );
        await sendEmail({
          email,
          subject: `Project Invitation: ${project.projectName}`,
          message,
        });
      } catch (err) {
        console.error("Failed to send project invite email:", err);
      }

      const populatedProject = await ProjectModel.findById(projectId).populate(
        "projectMembers.user",
        "name email isTempMember",
      );
      const populatedMember = populatedProject.projectMembers.find(
        (m) => m.user && m.user._id.toString() === userId.toString(),
      );
      return res
        .status(201)
        .json(
          new ApiResponse(201, "Observer re-added to project successfully", populatedMember),
        );
    }

    const newMember = {
      user: userId,
      roleInProject: "observer",
      status: "active",
      addedFromTeam: null,
      addedAt: Date.now(),
    };

    project.projectMembers.push(newMember);
    await project.save();

    try {
      const setPasswordLink = `${process.env.CLIENT_URL}/set-password/${rawToken}`;
      const message = project_invite_email_template(
        project.projectName,
        email,
        setPasswordLink,
        false,
      );

      await sendEmail({
        email,
        subject: `Project Invitation: ${project.projectName}`,
        message,
      });
    } catch (err) {
      console.error("Failed to send project invite email:", err);
    }

    const populatedProject = await ProjectModel.findById(projectId).populate(
      "projectMembers.user",
      "name email isTempMember",
    );

    const populatedNewMember = populatedProject.projectMembers.find(
      (m) => m.user && m.user._id.toString() === userId.toString(),
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Observer added to project successfully",
          populatedNewMember,
        ),
      );
  }

  const userId = userDoc._id;

  const exists = project.projectMembers.find(
    (m) => m.user.toString() === userId.toString(),
  );
  if (exists && exists.status === "active") {
    throw new ApiError(409, "This user is already a member of this project");
  }

  // If previously removed, reactivate
  if (exists && exists.status === "removed") {
    exists.roleInProject = "observer";
    exists.status = "active";
    exists.addedAt = Date.now();
    await project.save();

    try {
      const loginLink = `${process.env.CLIENT_URL}/`;
      const message = project_invite_email_template(
        project.projectName,
        email,
        loginLink,
        true,
      );
      await sendEmail({
        email,
        subject: `Project Invitation: ${project.projectName}`,
        message,
      });
    } catch (err) {
      console.error("Failed to send project invite email:", err);
    }

    const populatedProject = await ProjectModel.findById(projectId).populate(
      "projectMembers.user",
      "name email isTempMember",
    );
    const populatedMember = populatedProject.projectMembers.find(
      (m) => m.user && m.user._id.toString() === userId.toString(),
    );
    return res
      .status(201)
      .json(
        new ApiResponse(201, "Observer re-added to project successfully", populatedMember),
      );
  }

  const newMember = {
    user: userId,
    roleInProject: "observer",
    status: "active",
    addedFromTeam: null,
    addedAt: Date.now(),
  };

  project.projectMembers.push(newMember);
  await project.save();

  try {
    const loginLink = `${process.env.CLIENT_URL}/`;
    const message = project_invite_email_template(
      project.projectName,
      email,
      loginLink,
      true,
    );

    await sendEmail({
      email,
      subject: `Project Invitation: ${project.projectName}`,
      message,
    });
  } catch (err) {
    console.error("Failed to send project invite email:", err);
  }

  const populatedProject = await ProjectModel.findById(projectId).populate(
    "projectMembers.user",
    "name email isTempMember",
  );

  const populatedNewMember = populatedProject.projectMembers.find(
    (m) => m.user && m.user._id.toString() === userId.toString(),
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Observer added to project successfully",
        populatedNewMember,
      ),
    );
});

const getAllProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) throw new ApiError(400, "Project ID is required");

  const project = await ProjectModel.findById(projectId)
    .populate({
      path: "projectMembers.user",
      select: "name email role isTempMember",
    })
    .populate({
      path: "projectMembers.addedFromTeam",
      select: "teamName",
    })
    .lean();

  if (!project) throw new ApiError(404, "Project not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Project members fetched successfully",
        project.projectMembers,
      ),
    );
});

const updateProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { roleInProject, status } = req.body;

  if (!projectId || !memberId) {
    throw new ApiError(400, "Project ID and Member ID are required");
  }

  const validRoles = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor",
  ];

  const validStatus = ["active", "removed"];

  if (roleInProject && !validRoles.includes(roleInProject)) {
    throw new ApiError(400, "Invalid roleInProject value");
  }

  if (status && !validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = project.projectMembers.find(
    (m) => m.user.toString() === memberId.toString(),
  );

  if (!member) {
    throw new ApiError(404, "Member not found in this project");
  }

  if (roleInProject) member.roleInProject = roleInProject;
  if (status) member.status = status;

  await project.save();

  const populatedProject = await ProjectModel.findById(projectId).populate(
    "projectMembers.user",
    "name email isTempMember",
  );

  const updatedMember = populatedProject.projectMembers.find(
    (m) => m.user._id.toString() === memberId.toString(),
  );

  return res.status(200).json(
    new ApiResponse(200, "Member updated successfully", {
      updatedMember,
      allMembers: populatedProject.projectMembers,
    }),
  );
});

const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  if (!projectId || !memberId)
    throw new ApiError(400, "Project ID and member ID are required");

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const member = project.projectMembers.find(
    (m) => m.user.toString() === memberId.toString(),
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  if (member.user.toString() === project.projectManager?.toString()) {
    throw new ApiError(
      400,
      "Cannot remove project manager. Assign a new manager first.",
    );
  }

  member.status = "removed";

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Member removed successfully", member));
});

const activateProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  if (!projectId || !memberId)
    throw new ApiError(400, "Project ID and member ID are required");

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const member = project.projectMembers.find(
    (m) => m.user.toString() === memberId.toString(),
  );

  if (!member) throw new ApiError(404, "Member not found");

  if (member.status === "active") {
    throw new ApiError(400, "Member is already active");
  }

  member.status = "active";

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Member reactivated successfully", member));
});

const syncProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) throw new ApiError(400, "Project ID is required");

  const project = await ProjectModel.findById(projectId).populate("teams");
  if (!project) throw new ApiError(404, "Project not found");

  if (project.projectType === "personal") {
    throw new ApiError(400, "Personal projects do not support team syncing");
  }

  let autoMembers = [];

  for (const team of project.teams) {
    for (const tMember of team.members) {
      autoMembers.push({
        user: tMember.user.toString(),
        addedFromTeam: team._id.toString(),
        roleInProject: "contributor",
        status: "active",
      });
    }
  }

  const map = new Map();
  autoMembers.forEach((m) => map.set(m.user, m));
  autoMembers = Array.from(map.values());

  autoMembers.forEach((auto) => {
    const exists = project.projectMembers.find(
      (m) => m.user.toString() === auto.user.toString(),
    );

    if (!exists) {
      project.projectMembers.push(auto);
    }
  });

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Project members synced with teams", project));
});

export {
  addProjectMember,
  updateProjectMember,
  removeProjectMember,
  activateProjectMember,
  syncProjectMembers,
  getAllProjectMembers,
};
