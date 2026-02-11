import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Team } from "../../models/team.models.js";

/**
 * Allows team creator or admin/super_admin to change team status (e.g. archive).
 */
const canChangeTeamStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const teamId = req.params.teamId || req.params.id;

  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const isAdmin =
    req.user?.role === "admin" || req.user?.role === "super_admin";
  const isCreator =
    team.createdby && team.createdby.toString() === userId.toString();

  if (isAdmin || isCreator) {
    req.team = team;
    return next();
  }

  throw new ApiError(
    403,
    "Only team creator or admin can change team status"
  );
});

export { canChangeTeamStatus };
