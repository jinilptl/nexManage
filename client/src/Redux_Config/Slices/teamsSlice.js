import { createSlice } from "@reduxjs/toolkit";

const teamsSlice = createSlice({
  name: "teams",

  initialState: {
    list: [],
    loading: false, // only for GET ALL TEAMS page loader
    error: null,

    selectedTeam: {
      id: null,
      data: null,
      loading: false, // loader for view modal fetch
      error: null,
    },

    teamMembers: {
      list: [],
      loading: false, // loader for get members
      error: null,
    },

    actions: {
      creatingTeam: false,
      updatingTeam: false,
      deletingTeam: false,

      addingMember: false,
      updatingMember: false,
      removingMember: false,
    },
  },

  reducers: {
    /* ------------------------- TEAM LIST ----------------------------- */
    setTeams(state, action) {
      state.list = action.payload;
    },
    setTeamsLoading(state, action) {
      state.loading = action.payload;
    },

    /* ------------------------- SELECTED TEAM -------------------------- */
    setSelectedTeamId(state, action) {
      state.selectedTeam.id = action.payload;
    },
    setSelectedTeamData(state, action) {
      state.selectedTeam.data = action.payload;
    },
    setSelectedTeamLoading(state, action) {
      state.selectedTeam.loading = action.payload;
    },

    /* ------------------------- MEMBERS DATA --------------------------- */
    setTeamMembers(state, action) {
      state.teamMembers.list = action.payload;
    },
    setTeamMembersLoading(state, action) {
      state.teamMembers.loading = action.payload;
    },

    /* ------------------------- ACTION LOADERS ------------------------- */
    setCreateTeamLoading(state, action) {
      state.actions.creatingTeam = action.payload;
    },
    setUpdateTeamLoading(state, action) {
      state.actions.updatingTeam = action.payload;
    },
    setDeleteTeamLoading(state, action) {
      state.actions.deletingTeam = action.payload;
    },

    setAddMemberLoading(state, action) {
      state.actions.addingMember = action.payload;
    },
    setUpdateMemberLoading(state, action) {
      state.actions.updatingMember = action.payload;
    },
    setRemoveMemberLoading(state, action) {
      state.actions.removingMember = action.payload;
    },

    // after logout

    clearTeams(state) {
      state.list = [];
      state.selectedTeam = { id: null, data: null };
      state.teamMembers = { list: [] };
    },
  },
});

export const {
  // Teams
  setTeams,
  setTeamsLoading,

  // Selected team
  setSelectedTeamId,
  setSelectedTeamData,
  setSelectedTeamLoading,

  // Members
  setTeamMembers,
  setTeamMembersLoading,

  // Action loaders
  setCreateTeamLoading,
  setUpdateTeamLoading,
  setDeleteTeamLoading,

  setAddMemberLoading,
  setUpdateMemberLoading,
  setRemoveMemberLoading,

  // Clear teams on logout
  clearTeams,
} = teamsSlice.actions;

export default teamsSlice.reducer;
