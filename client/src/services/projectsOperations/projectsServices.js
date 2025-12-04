import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import PROJECTS_END_POINTS from "./projectsEndPoints";

import {
  setProjects,
  setProjectsLoading,
  setMyProjects,
  setMyProjectsLoading,
  setSelectedProjectId,
  setSelectedProjectData,
  setSelectedProjectLoading,
  setCreateProjectLoading,
  setUpdateProjectLoading,
  setDeleteProjectLoading,
  setArchiveProjectLoading,
  setSyncProjectLoading,
  clearProjects,
} from "../../Redux_Config/Slices/projectsSlice";

const {
  CREATE_PROJECT,
  GET_ALL_PROJECTS,
  GET_PROJECT,
  GET_USER_PROJECTS,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} = PROJECTS_END_POINTS;

// CREATE PROJECT

export const createProjectService = (projectData, token, onClose) => {
  return async (dispatch, getState) => {
    dispatch(setCreateProjectLoading(true));

    try {
      const response = await axiosInstance.post(CREATE_PROJECT, projectData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("create project response ---> ", response.data);

      if (response.data.success) {
        toast.success("Project created successfully!");

        const oldProjects = getState().projects.myProjects;
        dispatch(setProjects([response.data.data, ...oldProjects]));

        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project.");
    } finally {
      dispatch(setCreateProjectLoading(false));
    }
  };
};
