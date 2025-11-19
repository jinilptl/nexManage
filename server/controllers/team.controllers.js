import { Team as TeamModel } from "../models/team.models.js";
import { User as UserModel } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/emailSender.js";
import { team_member_added_email_template } from "../templates/team_member_added_email_template.js";

const createNewTeam = asyncHandler(async (req, res) => {
  const { teamName, description } = req.body;

  // Basic input validation
  if (!teamName || !description) {
    throw new ApiError(400, "All fields are required");
  }

  // Logged-in user's ID (creator)
  const creatorId = req.user._id;

  // Validate user existence
  const userDoc = await UserModel.findById(creatorId);
  if (!userDoc) {
    throw new ApiError(401, "User not authorized or not found");
  }

  // Check for duplicate team name
  const existingTeamName = await TeamModel.findOne({ teamName });
  if (existingTeamName) {
    throw new ApiError(400, "Team name already exists");
  }

  // Create new team
  const createdTeamDoc = await TeamModel.create({
    teamName,
    description,
    createdby: creatorId,
  });

  if (!createdTeamDoc) {
    throw new ApiError(500, "Internal server error while creating team");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Team created successfully", createdTeamDoc));
});

const getAllTeams = asyncHandler(async (req, res) => {
  // Fetch all teams
  const teamList = await TeamModel.find();

  return res
    .status(200)
    .json(new ApiResponse(200, "All teams fetched successfully", teamList));
});

const getUsersAllTeams = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
 
  if(!userId){
    throw new ApiError(400, "User ID is required");
  }
  const allTeams = await TeamModel.find({ 'members.user': userId }).populate('members.user', 'name email');

  console.log("users all teams:----> ",allTeams);
  

  return res
    .status(200)
    .json(new ApiResponse(200, "User's teams fetched successfully", allTeams));
})

const getTeamById = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  // Validate team ID
  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // Find team by ID
  const teamDoc = await TeamModel.findById(teamId).populate("members.user", "name email role");

  if (!teamDoc) {
    throw new ApiError(404, "No team found with the provided ID");
  }

  // Respond with team data
  return res
    .status(200)
    .json(new ApiResponse(200, "Team fetched successfully", teamDoc));
});

const updateTeamDetails = asyncHandler(async (req, res) => {
  // Extract updated details and team ID from request
  const { teamName, description } = req.body;
  const teamId = req.params.teamId;

  // Validate input fields
  if (!teamName || !description) {
    throw new ApiError(400, "All fields are required");
  }

  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // Check if team exists
  const teamDoc = await TeamModel.findById(teamId);
  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }

  // Update team information
  teamDoc.teamName = teamName;
  teamDoc.description = description;
  await teamDoc.save();

  // Fetch updated team details
  const updatedTeamDoc = await TeamModel.findById(teamId);

  // Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, "Team updated successfully", updatedTeamDoc));
});

const deleteTeamById = asyncHandler(async (req, res) => {
  // Extract team ID from request parameters
  const teamId = req.params.teamId;

  // Validate team ID
  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // Check if the team exists
  const teamDoc = await TeamModel.findById(teamId);
  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }

  // Delete the team
  const deletedTeamDoc = await TeamModel.findByIdAndDelete(teamId);

  // Respond based on deletion result
  if (!deletedTeamDoc) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the team. Please try again."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Team deleted successfully", deletedTeamDoc));
});

// member add , update , delete , all member
const addTeamMember = asyncHandler(async (req, res) => {
  const teamId = req.params.teamId;
  const { email, roleInTeam, status } = req.body;
  console.log(email,roleInTeam,status);
  

  // Validate inputs
  if (!email || !roleInTeam) {
    throw new ApiError(400, "All fields are required");
  }
  if (!teamId) {
    throw new ApiError(400, "Team ID is missing");
  }

  // Find the team
  const teamDoc = await TeamModel.findById(teamId);
  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }
  if (teamDoc.isActive === "false") {
    throw new ApiError(400, "This team is archived");
  }

  // Find user
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc) {
    throw new ApiError(404, "User not found");
  }

  const userId = userDoc._id;

  // Check duplicate membership
  const isMemberAlreadyPresent = teamDoc.members.find(
    (member) => member.user.toString() === userId.toString()
  );
  if (isMemberAlreadyPresent) {
    throw new ApiError(409, "This member is already part of the team");
  }

  // 🔥 TEAMLEAD CHECK HERE — only 1 allowed
  const isTeamLeadAlreadyPresent = teamDoc.members.find(
    (member) => member.roleInTeam === "team lead"
  );

  if (roleInTeam === "team lead" && isTeamLeadAlreadyPresent) {
    throw new ApiError(
      400,
      "Only one team lead is allowed in this team. Please update existing team lead first."
    );
  }

  // Create new member
  const newTeamMember = {
    user: userId,
    roleInTeam: roleInTeam || "developer",
    joinedAt: Date.now(),
    status: status || "active",
  };

  teamDoc.members.push(newTeamMember);
  await teamDoc.save();

  // Populate new member
  const populatedTeamDoc = await TeamModel.findById(teamId).populate(
    "members.user",
    "name email"
  );

  const addedTeamMember = populatedTeamDoc.members.find(
    (member) => member.user && member.user._id.toString() === userId.toString()
  );

  if (!addedTeamMember) {
    throw new ApiError(404, "Newly added member not found after populate");
  }

  // Send welcome email
  try {
    const teamLink = `${process.env.CLIENT_URL}/`;
    const htmlMessage = team_member_added_email_template(
      userDoc.name || "New Member",
      addedTeamMember.roleInTeam || "Member",
      teamDoc.teamName,
      teamLink
    );

    await sendEmail({
      email: userDoc.email,
      subject: `Welcome to ${teamDoc.teamName} on NexManage 🎉`,
      message: htmlMessage,
    });

    console.log(`✅ Email sent to ${userDoc.email}`);
  } catch (emailError) {
    console.error("❌ Email sending failed:", emailError.message);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Member added successfully and welcome email sent",
        addedTeamMember
      )
    );
});


const getTeamMembers = asyncHandler(async (req, res) => {
  const teamId = req.params.teamId;

  // Validate team ID
  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // Fetch team details with members
  const teamDoc = await TeamModel.findById(teamId)
    .select("teamName description members")
    .populate("members.user", "name email roleInTeam");

  // Check if team exists
  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All team members fetched successfully", teamDoc)
    );
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const teamId = req.params.teamId;
  const memberId = req.params.memberId;
  const { roleInTeam, status } = req.body;

  if (!teamId || !memberId) {
    throw new ApiError(400, "Team ID & Member ID are required");
  }

  if (!roleInTeam || !status) {
    throw new ApiError(400, "All fields are required");
  }

  const teamDoc = await TeamModel.findById(teamId);
  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }

  const existingMember = teamDoc.members.find(
    (member) => member.user.toString() === memberId.toString()
  );

  if (!existingMember) {
    throw new ApiError(404, "Member not found in this team");
  }

  // 🚨 ONLY ONE TEAM LEAD ALLOWED
  if (roleInTeam === "team lead") {
    const existingTeamLead = teamDoc.members.find(
      (member) =>
        member.roleInTeam === "team lead" &&
        member.user.toString() !== memberId.toString()
    );

    if (existingTeamLead) {
      throw new ApiError(400, "Only 1 Team Lead allowed in a team");
    }
  }

  // Update values
  existingMember.roleInTeam = roleInTeam;
  existingMember.status = status;

  await teamDoc.save();

  const updatedTeamDoc = await TeamModel.findById(teamId).populate(
    "members.user",
    "name email"
  );

  const updatedMember = updatedTeamDoc.members.find(
    (member) => member.user._id.toString() === memberId.toString()
  );

  return res.status(200).json(
    new ApiResponse(200, "Member updated successfully", {
      updatedMember,
      allMembers: updatedTeamDoc.members,
    })
  );
});


const removeTeamMember = asyncHandler(async (req, res) => {
  const teamId = req.params.teamId;
  const memberId = req.params.memberId;

  // Validate input params
  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  if (!memberId) {
    throw new ApiError(400, "Member ID is required");
  }

  // Find the team
  const teamDoc = await TeamModel.findById(teamId).populate(
    "members.user",
    "name email"
  );

  if (!teamDoc) {
    throw new ApiError(404, "Team not found");
  }

  // Check if member exists in the team
  const existingMember = teamDoc.members.find(
    (member) => member.user._id.toString() === memberId.toString()
  );

  if (!existingMember) {
    throw new ApiError(404, "Member not found in this team");
  }

  // Capture removed member details before deletion
  const removedMemberDetails = {
    userId: existingMember.user._id,
    name: existingMember.user.name,
    email: existingMember.user.email,
    roleInTeam: existingMember.roleInTeam,
  };

  // Remove member using MongoDB $pull
  const removeResult = await TeamModel.updateOne(
    { _id: teamId },
    { $pull: { members: { user: memberId } } }
  );

  console.log("Member removal acknowledged:", removeResult.acknowledged);

  if (!removeResult.acknowledged) {
    throw new ApiError(500, "Internal server error while removing member");
  }

  // Optional: fetch updated team members
  const updatedTeamDoc = await TeamModel.findById(teamId).populate(
    "members.user",
    "name email"
  );

  // Build response payload
  const responsePayload = {
    removedMember: removedMemberDetails,
    allMembers:updatedTeamDoc.members
  };

  // Return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Member removed from team successfully",
        responsePayload
      )
    );
});





export {
  createNewTeam,
  getAllTeams,
  getTeamById,
  updateTeamDetails,
  deleteTeamById,
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  removeTeamMember,
  getUsersAllTeams
};
