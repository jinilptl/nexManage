import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import TASK_END_POINTS from "./taskEndPoints";

import { addTask, deleteTask, setAllTasks, setLoading, updateTask } from "../../Redux_Config/Slices/tasksSlice";

const {
  CREATE_TASK,
  UPDATE_TASK,

  DELETE_TASK,
  GET_PROJECT_TASKS,
  GET_TASK_DETAILS,
  UPDATE_TASK_ASSIGNEES
} = TASK_END_POINTS;

function GenerateErrorMessage(error) {
  const message =
    error?.response?.data?.message || error.message || "Failed to create task";

  return message;
}

export const createTaskService = (formData, projectId, token, onClose) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const endPoints = CREATE_TASK.replace(":projectId", projectId);

      const response = await axiosInstance.post(endPoints, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response is ---> ", response.data);
      if (response.data.success) {
        dispatch(addTask(response.data?.data));
        toast.success(response.data.message);
        onClose(false);
      }
    } catch (error) {
      console.log("error in create Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getAllTasksService = (projectId, token) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const endPoints = GET_PROJECT_TASKS.replace(":projectId", projectId);

      const response = await axiosInstance.get(endPoints,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // console.log("response is ---> ", response.data);
        if (response.data.success) {
          dispatch(setAllTasks(response.data?.data))
          // toast.success(response.data.message)
          
        }
    } catch (error) {
      console.log("error in get Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
     dispatch(setLoading(false));
    }
  };
};


export const updateTaskService = (formData, projectId,taskId, token, onClose) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const NEW_UPDATE_TASK = UPDATE_TASK.replace(":projectId", projectId);
      const endPoints = NEW_UPDATE_TASK.replace(":taskId", taskId);

      const response = await axiosInstance.put(endPoints, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response is on update task ---> ", response.data);

      if (response.data.success) {
        dispatch(updateTask(response.data?.data));
        toast.success(response.data.message);
        onClose(false);
        dispatch(getAllTasksService(projectId,token))
      }
    } catch (error) {
      console.log("error in update Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const deleteTaskService = (projectId,taskId, token,) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const NEW_DELETE_TASK = DELETE_TASK.replace(":projectId", projectId);
      const endPoints = NEW_DELETE_TASK.replace(":taskId", taskId);

      const response = await axiosInstance.delete(endPoints, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response is on delete task ---> ", response.data);

      if (response.data.success) {
        dispatch(deleteTask(response.data?.data));
        toast.success(response.data.message);
        dispatch(getAllTasksService(projectId,token))
        
      }
    } catch (error) {
      console.log("error in delete Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const updateAssigneesTaskService = (assignnnesData,projectId,taskId, token) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const NEW_UPDATE_TASK_ASSIGNEES = UPDATE_TASK_ASSIGNEES.replace(":projectId", projectId);
      const endPoints = NEW_UPDATE_TASK_ASSIGNEES.replace(":taskId", taskId);

      const response = await axiosInstance.patch(endPoints,{assignees:assignnnesData}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response is on update Assignee task ---> ", response.data);
         
      // make sure backend send a whole update data not only array whichis updated okk.. 
      if (response.data.success) {
        dispatch(updateTask(response.data?.data));
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("error in update assignes Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};