import { createSlice } from "@reduxjs/toolkit";

const teamsSlice = createSlice({
  name: "teams",

  initialState: {
    list: [],
    loading: false,
    error: null,

    selectedTeam: {
      id: null,
      data: null,
      loading: false,
      error: null,
    },

    teamMembers: {
      list: [],
      loading: false,
      error: null,
    },
  },

  reducers: {
    // LIST
    setTeams(state, action) {
      state.list = action.payload;
    },
    setTeamsLoading(state, action) {
      state.loading = action.payload;
    },

    // SELECTED TEAM
    setSelectedTeamId(state, action) {
      state.selectedTeam.id = action.payload;
    },
    setSelectedTeamData(state, action) {
      state.selectedTeam.data = action.payload;
    },

    // TEAM MEMBERS
    setTeamMembers(state, action) {
      console.log("action.payload---> ", action.payload);
      
      state.teamMembers.list = action.payload;
    },
  },
});

export const {
  setTeams,
  setTeamsLoading,

  setSelectedTeamId,
  setSelectedTeamData,

  setTeamMembers,
} = teamsSlice.actions;

export default teamsSlice.reducer;
