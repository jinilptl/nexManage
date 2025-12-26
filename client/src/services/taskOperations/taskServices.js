import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import TASK_END_POINTS from "./taskEndPoints";

import { addTask, setAllTasks, setLoading } from "../../Redux_Config/Slices/tasksSlice";

const {
  CREATE_TASK,
  UPDATE_TASK,

  DELETE_TASK,
  GET_PROJECT_TASKS,
  GET_TASK_DETAILS,
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
      setLoading(false);
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

      console.log("response is ---> ", response.data);
        if (response.data.success) {
          dispatch(setAllTasks(response.data?.data))
          toast.success(response.data.message)
          
        }
    } catch (error) {
      console.log("error in get Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
};
