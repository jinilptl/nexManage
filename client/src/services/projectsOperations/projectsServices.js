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
  setProjectMembers,
  setAddMemberLoading,
  setUpdateMemberLoading,
  setRemoveMemberLoading,
  setActiveMemberLoading,
} from "../../Redux_Config/Slices/projectsSlice";

const {
  CREATE_PROJECT,
  GET_ALL_PROJECTS,
  GET_PROJECT,
  GET_USER_PROJECTS,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT_STATUS,

  // members end points
  ADD_PROJECT_MEMBER,
  UPDATE_PROJECT_MEMBER,
  REMOVE_PROJECT_MEMBER,
  GET_PROJECT_MEMBERS,
  ACTIVE_PROJECT_MEMBER
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
        dispatch(fetchAllProjectsService(token, getState().auth.user.role));
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
      toast.error(error.response?.data?.message || "Failed to fetch projects.");
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
      // console.log("response is --> ",response);

      if (response.data.success) {
        dispatch(setSelectedProjectData(response.data.data));
        toast.success("succesfully fetched single project");
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
      const response = await axiosInstance.post(
        `${UPDATE_PROJECT}/${projectId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("update responcse==> ", response);

      if (response.data.success) {
        toast.success("Project updated successfully!");

        // Update selected project
        dispatch(setSelectedProjectData(response.data.data));

        // Update myProjects list
        const updatedList = getState().projects.myProjects.map((p) =>
          p._id === projectId ? response.data.data : p
        );
        dispatch(setMyProjects(updatedList));
        dispatch(setProjects(updatedList));

        dispatch(fetchAllProjectsService(token, getState().auth.user.role));

        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
    } finally {
      dispatch(setUpdateProjectLoading(false));
    }
  };
};

// DELETE PROJECT

export const deleteProjectService = (projectId, token, onClose) => {
  return async (dispatch, getState) => {
    dispatch(setDeleteProjectLoading(true));

    try {
      const response = await axiosInstance.delete(
        `${DELETE_PROJECT}/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Project deleted successfully!");

        const updated = getState().projects.myProjects.filter(
          (p) => p._id !== projectId
        );

        const allupdated = getState().projects.allProjects.filter(
          (p) => p._id !== projectId
        );
        dispatch(setMyProjects(updated));
        dispatch(setProjects(allupdated));
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project.");
    } finally {
      dispatch(setDeleteProjectLoading(false));
    }
  };
};

// ARCHIVE / UNARCHIVE PROJECT

export const archiveProjectService = (projectId, status, token) => {
  return async (dispatch, getState) => {
    dispatch(setArchiveProjectLoading(true));

    try {
      const response = await axiosInstance.post(
        `${UPDATE_PROJECT_STATUS}/${projectId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("response is ---> ", response);

      if (response.data.success) {
        toast.success(
          `Project ${status === "archived" ? "archived" : "restored"}!`
        );

        dispatch(setSelectedProjectData(response.data.data));
        dispatch(fetchAllProjectsService(token, getState().auth.user.role));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update project status."
      );
    } finally {
      dispatch(setArchiveProjectLoading(false));
    }
  };
};

// SYNC PROJECT MEMBERS
// (in the last use this )

export const syncProjectMembersService = (projectId, token) => {
  return async (dispatch) => {
    dispatch(setSyncProjectLoading(true));

    try {
      const response = await axiosInstance.patch(
        `${SYNC_PROJECT_MEMBERS}/${projectId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Members synced successfully!");
      }
    } catch (error) {
      toast.error("Failed to sync project members.");
    } finally {
      dispatch(setSyncProjectLoading(false));
    }
  };
};

// ---------------------------Members in Projects ----------------------------

//  ADD MEMBER TO PROJECT
export const addProjectMemberService = (
  projectId,
  memberData,
  token,
  onClose
) => {
  return async (dispatch, getState) => {
    dispatch(setAddMemberLoading(true));

    try {
      const response = await axiosInstance.post(
        `${ADD_PROJECT_MEMBER}/${projectId}`,
        memberData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("response is---> ", response.data);

      if (response.data.success) {
        toast.success("Member added successfully!");

        // Get existing members from slice
        const oldMembers = getState().projects.projectMembers.list;

        // Append new member
        dispatch(setProjectMembers([...oldMembers, response.data.data]));

        // Close modal
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member.");
    } finally {
      dispatch(setAddMemberLoading(false));
    }
  };
};

//update member

export const updateProjectMemberService = (
  projectId,
  memberId,
  updatedData,
  token,
  onClose
) => {
  return async (dispatch) => {
    dispatch(setUpdateMemberLoading(true));

    try {
      const response = await axiosInstance.post(
        `${UPDATE_PROJECT_MEMBER}/${projectId}/${memberId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("response is --> ", response.data);

      if (response.data.success) {
        toast.success("Member updated successfully!");

        // Replace full member list from backend
        dispatch(setProjectMembers(response.data.data.allMembers));

        // Close modal + reset selected
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update member.");
    } finally {
      dispatch(setUpdateMemberLoading(false));
    }
  };
};

//remove member(only status changing )

export const removeProjectMemberService = (projectId, memberId, token) => {
  return async (dispatch, getState) => {
    dispatch(setRemoveMemberLoading(true));

    try {
      const response = await axiosInstance.delete(
        `${REMOVE_PROJECT_MEMBER}/${projectId}/${memberId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Member removed!");

        const prevProject = getState().projects.selectedProject.data;

        if (prevProject) {
          const updatedMembers = prevProject.projectMembers.map((m) =>
            m.user._id === memberId ? { ...m, status: "removed" } : m
          );

          dispatch(
            setSelectedProjectData({
              ...prevProject,
              projectMembers: updatedMembers,
            })
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member.");
      console.log("error is --> ",error);
      
    } finally {
      dispatch(setRemoveMemberLoading(false));
    }
  };
};

export const activeProjectMemberService = (projectId, memberId, token) => {
  return async (dispatch, getState) => {
    dispatch(setActiveMemberLoading(true));

    try {
      const response = await axiosInstance.patch(
        `${ACTIVE_PROJECT_MEMBER}/${projectId}/${memberId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Member reActivate!");

        const prevProject = getState().projects.selectedProject.data;

        if (prevProject) {
          const updatedMembers = prevProject.projectMembers.map((m) =>
            m.user._id === memberId ? { ...m, status: "active" } : m
          );

          dispatch(
            setSelectedProjectData({
              ...prevProject,
              projectMembers: updatedMembers,
            })
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to active member.");
      console.log("error is --> ",error);
      
    } finally {
      dispatch(setActiveMemberLoading(false));
    }
  };
};
