import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import TEAMS_END_POINTS from "./teamsEndPoints";
import {
  setTeamsLoading,
  setTeams,
  setSelectedTeamId,
  setSelectedTeamData,
} from "../../Redux_Config/Slices/teamsSlice";

let logger = console.log;

const {
  CREATE_TEAM,
  GET_ALL_TEAMS,
  GET_TEAM,
  DELETE_TEAM,
  UPDATE_TEAM,
  GET_USER_TEAMS,

  //  teams member
  ADD_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER,
  GET_TEAM_MEMBERS,
  UPDATE_TEAM_MEMBER,
} = TEAMS_END_POINTS;

// FUNCTION TO CREATE A NEW TEAM

//works

export const createTeamService = (teamData, token, navigate) => {
  return async (dispatch, getState) => {
    dispatch(setTeamsLoading(true));

    try {
      const response = await axiosInstance.post(CREATE_TEAM, teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      logger("---- response from createTeam teamsServices ----", response);

      if (response.data.success) {
        toast.success("Team created successfully!");

        // GET LATEST TEAMS LIST
        const oldTeams = getState().teams.list;

        // ADD NEW TEAM
        dispatch(setTeams([...oldTeams, response.data.data]));

        navigate("/dashboard/teams");
      }
    } catch (error) {
      logger("---- error in createTeam teamsServices ----", error);

      toast.error(error.response?.data?.message || "Failed to create team.");
    } finally {
      dispatch(setTeamsLoading(false));
    }
  };
};


// works

export const fetchTeamsService = (token, role) => {
    return async (dispatch) => {
        dispatch(setTeamsLoading(true));
        try {
            const endpoint =
                role === "admin" || role === "super_admin"
                    ? GET_ALL_TEAMS       // admin endpoints
                    : GET_USER_TEAMS;     // member endpoints

            const response = await axiosInstance.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // logger("---- fetchTeamsService response ----", response.data.data);

            if (response.data.success) {
                dispatch(setTeams(response.data.data));
                toast.success("Teams fetched successfully!");
            }
        } catch (error) {
            console.log("Error fetching teams:", error);
            toast.error(error.response?.data?.message || "Failed to fetch teams.");
        } finally {
            dispatch(setTeamsLoading(false));
        }
    };
};


//works

export const fetchSingleTeamService = (teamId, token) => {
  return async (dispatch) => {
    try {
      dispatch(setSelectedTeamData(null));  // clear old data (optional UI polish)

      const response = await axiosInstance.get(`${GET_TEAM}/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logger("---- fetchSingleTeamService response ----", response.data.data);

      if(response.data.success){
        dispatch(setSelectedTeamData(response.data.data));
      }

    } catch (err) {
      console.log("Error fetching single team:", err);
    }
  };
};
