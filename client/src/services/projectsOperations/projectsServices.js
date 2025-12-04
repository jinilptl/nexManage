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


// fetch project service

export const fetchAllProjectsService = (token, role) => {
  return async (dispatch) => {
    dispatch(setProjectsLoading(true));

    try {
      const endpoint =
        role === "admin" || role === "super_admin"
          ? GET_ALL_PROJECTS
          : GET_USER_PROJECTS;

      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // console.log("Fetch projects response → ", response.data);

      if (response.data.success) {
        if (role === "admin" || role === "super_admin") {
          dispatch(setProjects(response.data.data)); // all projects
        } else {
          dispatch(setMyProjects(response.data.data)); // user-specific projects
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch projects."
      );
    } finally {
      dispatch(setProjectsLoading(false));
    }
  };
};


//fetch single project service

export const fetchSingleProjectService = (projectId, token) => {
  return async (dispatch) => {
    dispatch(setSelectedProjectLoading(true));
    dispatch(setSelectedProjectData(null));

    try {
      const response = await axiosInstance.get(`${GET_PROJECT}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        dispatch(setSelectedProjectData(response.data.data));
      }
    } catch (error) {
      toast.error("Failed to fetch project details.");
    } finally {
      dispatch(setSelectedProjectLoading(false));
    }
  };
};


    // UPDATE PROJECT

export const updateProjectService = (
  projectId,
  updatedData,
  token,
  onClose
) => {
  return async (dispatch, getState) => {
    dispatch(setUpdateProjectLoading(true));

    try {
      const response = await axiosInstance.put(
        `${UPDATE_PROJECT}/${projectId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Project updated successfully!");

        // Update selected project
        dispatch(setSelectedProjectData(response.data.data));

        // Update myProjects list
        const updatedList = getState().projects.myProjects.map((p) =>
          p._id === projectId ? response.data.data : p
        );
        dispatch(setMyProjects(updatedList));

        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
    } finally {
      dispatch(setUpdateProjectLoading(false));
    }
  };
};