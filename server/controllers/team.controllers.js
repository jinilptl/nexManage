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


const getTeamById = asyncHandler(async (req, res) => {
  const { id: teamId } = req.params;

  // Validate team ID
  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // Find team by ID
  const teamDoc = await TeamModel.findById(teamId);

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
  const teamId = req.params.id;

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
  const teamId = req.params.id;

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
  const { email, roleInTeam } = req.body;

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

  // Find user by email
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc) {
    throw new ApiError(404, "User not found");
  }

  const userId = userDoc._id;

  // // Check for duplicate membership
  // const isMemberAlreadyPresent = teamDoc.members.find(
  //   (member) => member.user.toString() === userId.toString()
  // );
  // if (isMemberAlreadyPresent) {
  //   throw new ApiError(409, "This member is already part of the team");
  // }

  // Create new member record
  const newTeamMember = {
    user: userId,
    roleInTeam: roleInTeam || "developer",
    joinedAt: Date.now(),
    status: "active",
  };

  teamDoc.members.push(newTeamMember);
  await teamDoc.save();

  // Populate new member data for response
  const populatedTeamDoc = await TeamModel.findById(teamId).populate(
    "members.user",
    "name email"
  );

  const addedTeamMember = populatedTeamDoc.members.find(
    (member) =>
      member.user && member.user._id.toString() === userId.toString()
  );

  if (!addedTeamMember) {
    throw new ApiError(404, "Newly added member not found after populate");
  }


  // ✅ Send welcome email after successful addition

  try {

    //  { right now not available .. but we will fix it whenavalable
    //   se use login url right now ...
    //  const teamLink = `https://app.nexmanage.tech/team/${teamId}`;}


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

    console.log(`✅ Email sent successfully to ${userDoc.email}`);
  } catch (emailError) {
    console.error("❌ Failed to send welcome email:", emailError.message);
    // Don’t throw error here — main process succeeded
  }

  // Send API response
  return res.status(200).json(
    new ApiResponse(
     200,
     "Member added successfully and welcome email sent",
    addedTeamMember,)
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
      new ApiResponse(
        200,
        "All team members fetched successfully",
        teamDoc
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
  getTeamMembers
};
