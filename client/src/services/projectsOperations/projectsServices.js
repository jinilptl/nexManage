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



