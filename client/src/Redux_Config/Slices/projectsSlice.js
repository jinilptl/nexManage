import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    allProjects: [],
    myProjects: [],
    loading: false,
    myLoading: false,
    error: null,

    selectedProject: {
      id: null,
      data: null,
      loading: false,
      error: null,
    },

    projectMembers: {
      list: [],
      loading: false,
      error: null,
    },

    actions: {
      creating: false,
      updating: false,
      deleting: false,
      archiving: false,
      syncing: false,

      addingMember: false,
      updatingMember: false,
      removingMember: false,
      activingMember: false,
    },
  },

  reducers: {
    setProjects(state, action) {
      state.allProjects = action.payload;
    },
    setProjectsLoading(state, action) {
      state.loading = action.payload;
    },

    setMyProjects(state, action) {
      state.myProjects = action.payload;
    },
    setMyProjectsLoading(state, action) {
      state.myLoading = action.payload;
    },

    setSelectedProjectId(state, action) {
      state.selectedProject.id = action.payload;
    },
    setSelectedProjectData(state, action) {
      state.selectedProject.data = action.payload;
    },
    addTaskStatusIntoProject(state, action) {
      const payload = action.payload;

      const data = state.selectedProject.data;
    },
    setSelectedProjectLoading(state, action) {
      state.selectedProject.loading = action.payload;
    },

    setProjectMembers(state, action) {
      state.projectMembers.list = action.payload;
    },
    setProjectMembersLoading(state, action) {
      state.projectMembers.loading = action.payload;
    },

    setCreateProjectLoading(state, action) {
      state.actions.creating = action.payload;
    },
    setUpdateProjectLoading(state, action) {
      state.actions.updating = action.payload;
    },
    setDeleteProjectLoading(state, action) {
      state.actions.deleting = action.payload;
    },
    setArchiveProjectLoading(state, action) {
      state.actions.archiving = action.payload;
    },
    setSyncProjectLoading(state, action) {
      state.actions.syncing = action.payload;
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
    setActiveMemberLoading(state, action) {
      state.actions.activingMember = action.payload;
    },
    clearProjects(state) {
      state.allProjects = [];
      state.myProjects = [];

      state.selectedProject = {
        id: null,
        data: null,
        loading: false,
      };

      state.projectMembers = {
        list: [],
        loading: false,
      };

      state.actions = {
        creating: false,
        updating: false,
        deleting: false,
        archiving: false,
        syncing: false,

        addingMember: false,
        updatingMember: false,
        removingMember: false,
      };
    },
  },
});

export const {
  setProjects,
  setProjectsLoading,

  setMyProjects,
  setMyProjectsLoading,

  setSelectedProjectId,
  setSelectedProjectData,
  addTaskStatusIntoProject,
  setSelectedProjectLoading,

  setProjectMembers,
  setProjectMembersLoading,

  setCreateProjectLoading,
  setUpdateProjectLoading,
  setDeleteProjectLoading,
  setArchiveProjectLoading,
  setSyncProjectLoading,

  setAddMemberLoading,
  setUpdateMemberLoading,
  setRemoveMemberLoading,
  setActiveMemberLoading,

  clearProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
