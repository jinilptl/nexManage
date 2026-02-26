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
  setProjectMembersLoading,
  addTaskStatusIntoProject,
} from "../../Redux_Config/Slices/projectsSlice";

import { moveAllTasksToStatus } from "../../Redux_Config/Slices/tasksSlice";

const {
  CREATE_PROJECT,
  GET_ALL_PROJECTS,
  GET_PROJECT,
  GET_USER_PROJECTS,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT_STATUS,
  PATCH_PROJECT_STATUS,
  ADD_TASK_STATUSES,
  ADD_PROJECT_MEMBER,
  UPDATE_PROJECT_MEMBER,
  REMOVE_PROJECT_MEMBER,
  GET_PROJECT_MEMBERS,
  ACTIVE_PROJECT_MEMBER,
  DELETE_TASK_STATUSES,
} = PROJECTS_END_POINTS;

function GenerateErrorMessage(error) {
  const message =
    error?.response?.data?.message || error.message || "Failed to create task";

  return message;
}

export const createProjectService = (projectData, token, onClose) => {
  return async (dispatch, getState) => {
    dispatch(setCreateProjectLoading(true));

    try {
      const response = await axiosInstance.post(CREATE_PROJECT, projectData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

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

export const fetchAllProjectsService = (token, role, status = "") => {
  return async (dispatch) => {
    dispatch(setProjectsLoading(true));

    try {
      const endpoint =
        role === "admin" || role === "super_admin"
          ? GET_ALL_PROJECTS
          : GET_USER_PROJECTS;

      const params = {};
      if (status && status.trim()) params.status = status.trim();

      const response = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        params,
      });

      if (response.data.success) {
        if (role === "admin" || role === "super_admin") {
          dispatch(setProjects(response.data.data));
        } else {
          dispatch(setMyProjects(response.data.data));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch projects.");
    } finally {
      dispatch(setProjectsLoading(false));
    }
  };
};

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

export const updateProjectService = (
  projectId,
  updatedData,
  token,
  onClose,
) => {
  return async (dispatch, getState) => {
    dispatch(setUpdateProjectLoading(true));

    try {
      const response = await axiosInstance.post(
        `${UPDATE_PROJECT}/${projectId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        toast.success("Project updated successfully!");

        dispatch(setSelectedProjectData(response.data.data));

        const updatedList = getState().projects.myProjects.map((p) =>
          p._id === projectId ? response.data.data : p,
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

export const deleteProjectService = (projectId, token, onClose) => {
  return async (dispatch, getState) => {
    dispatch(setDeleteProjectLoading(true));

    try {
      const response = await axiosInstance.delete(
        `${DELETE_PROJECT}/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Project deleted successfully!");

        const updated = getState().projects.myProjects.filter(
          (p) => p._id !== projectId,
        );

        const allupdated = getState().projects.allProjects.filter(
          (p) => p._id !== projectId,
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

export const archiveProjectService = (
  projectId,
  status,
  token,
  currentStatusFilter = "",
) => {
  return async (dispatch, getState) => {
    dispatch(setArchiveProjectLoading(true));

    try {
      const normalized = String(status).toUpperCase();
      const url = `${PATCH_PROJECT_STATUS}/${projectId}/status`;

      const response = await axiosInstance.patch(
        url,
        { status: normalized },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(
          normalized === "ARCHIVED"
            ? "Project archived."
            : "Project status updated.",
        );

        dispatch(setSelectedProjectData(response.data.data));
        const role = getState().auth.user.role;
        dispatch(fetchAllProjectsService(token, role, currentStatusFilter));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update project status.",
      );
    } finally {
      dispatch(setArchiveProjectLoading(false));
    }
  };
};

export const addTaskStatusesIntoProjectService = (
  formData,
  projectId,
  token,
) => {
  return async (dispatch, getstate) => {
    try {
      const endpoint = ADD_TASK_STATUSES.replace(":projectId", projectId);
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(addTaskStatusIntoProject(response.data.data));
        toast("Status Column added succesfully");
      }
    } catch (error) {
      console.log(
        "error in the add taskStatuses into the project-->",
        GenerateErrorMessage(error),
      );

      toast.error(GenerateErrorMessage(error) || "error in adding task Status");
    }
  };
};

export const deleteTaskStatusFromProjectService = (
  projectId,
  statusId,
  token,
) => {
  return async (dispatch, getState) => {
    try {
      const endpoint = DELETE_TASK_STATUSES.replace(
        ":projectId",
        projectId,
      ).replace(":statusId", statusId);
      const response = await axiosInstance.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Column deleted successfully");
        const prevProject = getState().projects.selectedProject.data;
        if (prevProject) {
          const updatedStatuses = prevProject.taskStatuses.filter(
            (s) => s._id !== statusId,
          );
          dispatch(
            setSelectedProjectData({
              ...prevProject,
              taskStatuses: updatedStatuses,
            }),
          );
        }

        const todoStatusId = response.data.data?.todoStatusId;
        if (todoStatusId) {
          dispatch(
            moveAllTasksToStatus({
              fromStatusId: statusId,
              toStatusId: todoStatusId,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(GenerateErrorMessage(error) || "Error deleting column");
    }
  };
};

export const syncProjectMembersService = (projectId, token) => {
  return async (dispatch) => {
    dispatch(setSyncProjectLoading(true));

    try {
      const response = await axiosInstance.patch(
        `${SYNC_PROJECT_MEMBERS}/${projectId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
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

export const fetchProjectMembersService = (projectId, token) => {
  return async (dispatch, getState) => {
    dispatch(setProjectMembersLoading(true));

    try {
      const response = await axiosInstance.get(
        `${GET_PROJECT_MEMBERS}/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        const members = response.data.data;

        dispatch(setProjectMembers(members));

        const currentProject = getState().projects.selectedProject.data;

        if (currentProject) {
          dispatch(
            setSelectedProjectData({
              ...currentProject,
              projectMembers: members,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch members.");
    } finally {
      dispatch(setProjectMembersLoading(false));
    }
  };
};

export const addProjectMemberService = (
  projectId,
  memberData,
  token,
  onClose,
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
        },
      );

      if (response.data.success) {
        toast.success("Invitation sent successfully!");

        const newMember = response.data.data;

        const oldMembers = getState().projects.projectMembers.list;
        dispatch(setProjectMembers([...oldMembers, newMember]));

        const prevProject = getState().projects.selectedProject.data;

        if (prevProject) {
          dispatch(
            setSelectedProjectData({
              ...prevProject,
              projectMembers: [...prevProject.projectMembers, newMember],
            }),
          );
        }
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member.");
    } finally {
      dispatch(setAddMemberLoading(false));
    }
  };
};

export const updateProjectMemberService = (
  projectId,
  memberId,
  updatedData,
  token,
  onClose,
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
        },
      );

      if (response.data.success) {
        toast.success("Member updated successfully!");
        dispatch(setProjectMembers(response.data.data.allMembers));
        if (response.data.data.project) {
          dispatch(setSelectedProjectData(response.data.data.project));
        }
        onClose(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update member.");
    } finally {
      dispatch(setUpdateMemberLoading(false));
    }
  };
};

export const removeProjectMemberService = (projectId, memberId, token) => {
  return async (dispatch, getState) => {
    dispatch(setRemoveMemberLoading(true));

    try {
      const response = await axiosInstance.delete(
        `${REMOVE_PROJECT_MEMBER}/${projectId}/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Member removed!");

        const prevMembers = getState().projects.projectMembers.list;

        const updatedMembersList = prevMembers.map((m) =>
          m.user._id === memberId ? { ...m, status: "removed" } : m,
        );
        dispatch(setProjectMembers(updatedMembersList));

        const prevProject = getState().projects.selectedProject.data;

        if (prevProject) {
          const updatedMembers = prevProject.projectMembers.map((m) =>
            m.user._id === memberId ? { ...m, status: "removed" } : m,
          );

          dispatch(
            setSelectedProjectData({
              ...prevProject,
              projectMembers: updatedMembers,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member.");
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
        },
      );

      if (response.data.success) {
        toast.success("Member reActivate!");

        const prevMembers = getState().projects.projectMembers.list;

        const updatedMembersList = prevMembers.map((m) =>
          m.user._id === memberId ? { ...m, status: "active" } : m,
        );
        dispatch(setProjectMembers(updatedMembersList));

        const prevProject = getState().projects.selectedProject.data;

        if (prevProject) {
          const updatedMembers = prevProject.projectMembers.map((m) =>
            m.user._id === memberId ? { ...m, status: "active" } : m,
          );

          dispatch(
            setSelectedProjectData({
              ...prevProject,
              projectMembers: updatedMembers,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to active member.");
    } finally {
      dispatch(setActiveMemberLoading(false));
    }
  };
};
