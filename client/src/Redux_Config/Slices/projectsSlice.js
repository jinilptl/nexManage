import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",

  initialState: {
    allProjects: [],          // All projects (admin or general)
    myProjects: [],        // Only user's projects
    loading: false,        // Loader for get all projects
    myLoading: false,      // Loader for my projects
    error: null,

    selectedProject: {
      id: null,
      data: null,
      loading: false,
      error: null,
    },

    actions: {
      creating: false,
      updating: false,
      deleting: false,
      archiving: false,
      syncing: false,
    },
  },

  reducers: {

    //   ALL PROJECTS
    
    setProjects(state, action) {
      state.allProjects = action.payload;
    },
    setProjectsLoading(state, action) {
      state.loading = action.payload;
    },

    //  * MY PROJECTS
  
    setMyProjects(state, action) {
      state.myProjects = action.payload;
    },
    setMyProjectsLoading(state, action) {
      state.myLoading = action.payload;
    },

   
    //  * SELECTED PROJECT
     
    setSelectedProjectId(state, action) {
      state.selectedProject.id = action.payload;
    },
    setSelectedProjectData(state, action) {
      state.selectedProject.data = action.payload;
    },
    setSelectedProjectLoading(state, action) {
      state.selectedProject.loading = action.payload;
    },

  
    //  * ACTION LOADERS
    
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

   
    //  * CLEAR ALL ON LOGOUT
    
    clearProjects(state) {
      state.allProjects = [];
      state.myProjects = [];
      state.selectedProject = { id: null, data: null, loading: false };
      state.actions = {
        creating: false,
        updating: false,
        deleting: false,
        archiving: false,
        syncing: false,
      };
    },
  },
});

export const {
  // All projects
  setProjects,
  setProjectsLoading,

  // My projects
  setMyProjects,
  setMyProjectsLoading,

  // Selected project
  setSelectedProjectId,
  setSelectedProjectData,
  setSelectedProjectLoading,

  // Action loaders
  setCreateProjectLoading,
  setUpdateProjectLoading,
  setDeleteProjectLoading,
  setArchiveProjectLoading,
  setSyncProjectLoading,

  // Clear all
  clearProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
