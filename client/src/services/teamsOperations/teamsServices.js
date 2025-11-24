import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import TEAMS_END_POINTS from "./teamsEndPoints";

import {
  setTeams,
  setTeamsLoading,

  setSelectedTeamId,
  setSelectedTeamData,
  setSelectedTeamLoading,

  setTeamMembers,
  setTeamMembersLoading,

  setCreateTeamLoading,
  setUpdateTeamLoading,
  setDeleteTeamLoading,

  setAddMemberLoading,
  setUpdateMemberLoading,
  setRemoveMemberLoading,
} from "../../Redux_Config/Slices/teamsSlice";

const {
  CREATE_TEAM,
  GET_ALL_TEAMS,
  GET_TEAM,
  DELETE_TEAM,
  UPDATE_TEAM,
  GET_USER_TEAMS,

  ADD_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER,
  GET_TEAM_MEMBERS,
  UPDATE_TEAM_MEMBER,
} = TEAMS_END_POINTS;

let logger = console.log;

/* =====================================================
   🚀 CREATE TEAM
===================================================== */
export const createTeamService = (teamData, token, onClose) => {
  return async (dispatch, getState) => {
    
    dispatch(setCreateTeamLoading(true));

    try {
      const response = await axiosInstance.post(
        CREATE_TEAM,
        teamData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Team created successfully!");

        const oldTeams = getState().teams.list;
        dispatch(setTeams([...oldTeams, response.data.data]));

        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team.");
    } finally {
      dispatch(setCreateTeamLoading(false));
    }
  };
};

/* =====================================================
   🚀 FETCH ALL TEAMS
===================================================== */
export const fetchTeamsService = (token, role) => {
  return async (dispatch) => {
    dispatch(setTeamsLoading(true));

    try {
      const endpoint =
        role === "admin" || role === "super_admin"
          ? GET_ALL_TEAMS
          : GET_USER_TEAMS;

      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        dispatch(setTeams(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch teams.");
    } finally {
      dispatch(setTeamsLoading(false));
    }
  };
};

/* =====================================================
   🚀 FETCH SINGLE TEAM (VIEW MODAL)
===================================================== */
export const fetchSingleTeamService = (teamId, token) => {
  return async (dispatch) => {
    dispatch(setSelectedTeamLoading(true));
    dispatch(setSelectedTeamData(null));

    try {
      const response = await axiosInstance.get(
        `${GET_TEAM}/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        dispatch(setSelectedTeamData(response.data.data));
      }
    } catch (error) {
      toast.error("Failed to fetch team details.");
    } finally {
      dispatch(setSelectedTeamLoading(false));
    }
  };
};

/* =====================================================
   🚀 DELETE TEAM
===================================================== */
export const deleteTeamService = (teamId, token) => {
  return async (dispatch, getState) => {

    dispatch(setDeleteTeamLoading(true));

    try {
      const response = await axiosInstance.post(
        `${DELETE_TEAM}/${teamId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Team deleted successfully!");

        const updatedTeams = getState().teams.list.filter(
          (t) => t._id !== teamId
        );

        dispatch(setTeams(updatedTeams));
        dispatch(setSelectedTeamId(null));
        dispatch(setSelectedTeamData(null));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete team.");
    } finally {
      dispatch(setDeleteTeamLoading(false));
    }
  };
};

/* =====================================================
   🚀 UPDATE TEAM
===================================================== */
export const updateTeamService = (teamId, updatedData, token, onClose) => {
  return async (dispatch, getState) => {

    dispatch(setUpdateTeamLoading(true));

    try {
      const response = await axiosInstance.post(
        `${UPDATE_TEAM}/${teamId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Team updated successfully!");

        dispatch(setSelectedTeamData(response.data.data));

        const updatedList = getState().teams.list.map((t) =>
          t._id === teamId ? response.data.data : t
        );

        dispatch(setTeams(updatedList));
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update team.");
    } finally {
      dispatch(setUpdateTeamLoading(false));
    }
  };
};

/* =====================================================
   🚀 FETCH TEAM MEMBERS
===================================================== */
export const fetchTeamMembersService = (teamId, token) => {
  return async (dispatch) => {

    dispatch(setTeamMembersLoading(true));

    try {
      const response = await axiosInstance.get(
        `${GET_TEAM_MEMBERS}/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        dispatch(setTeamMembers(response.data.data.members));
      }
    } catch (error) {
      toast.error("Failed to fetch team members.");
    } finally {
      dispatch(setTeamMembersLoading(false));
    }
  };
};

/* =====================================================
   🚀 ADD TEAM MEMBER
===================================================== */
export const addTeamMemberService = (teamId, memberData, token, onClose) => {
  return async (dispatch, getState) => {

    dispatch(setAddMemberLoading(true));

    try {
      const response = await axiosInstance.post(
        `${ADD_TEAM_MEMBER}/${teamId}`,
        memberData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Member added!");

        const oldMembers = getState().teams.teamMembers.list;
        dispatch(setTeamMembers([...oldMembers, response.data.data]));

        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member.");
    } finally {
      dispatch(setAddMemberLoading(false));
    }
  };
};

/* =====================================================
   🚀 UPDATE MEMBER
===================================================== */
export const updateTeamMemberService = (
  teamId,
  memberId,
  updatedData,
  token,
  onClose,
  setMember
) => {
  return async (dispatch) => {
    dispatch(setUpdateMemberLoading(true));

    try {
      const response = await axiosInstance.post(
        `${UPDATE_TEAM_MEMBER}/${teamId}/${memberId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Member updated!");

        dispatch(setTeamMembers(response.data.data.allMembers));
        onClose(false);
        setMember(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update member.");
    } finally {
      dispatch(setUpdateMemberLoading(false));
    }
  };
};

/* =====================================================
   🚀 REMOVE MEMBER
===================================================== */
export const removeTeamMemberService = (teamId, memberId, token) => {
  return async (dispatch) => {

    dispatch(setRemoveMemberLoading(true));

    try {
      const response = await axiosInstance.post(
        `${REMOVE_TEAM_MEMBER}/${teamId}/${memberId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Member removed!");
        dispatch(setTeamMembers(response.data.data.allMembers));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member.");
    } finally {
      dispatch(setRemoveMemberLoading(false));
    }
  };
};
