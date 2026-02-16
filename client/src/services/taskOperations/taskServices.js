import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import {
  TASK_END_POINTS,
  SUB_TASK_END_POINTS,
  ATTACHMENT_END_POINTS,
  ACTIVITY_END_POINTS
} from "./taskEndPoints";

import {
  addAttachment,
  addSubtask,
  addTask,
  deleteSubtask,
  deleteTask,
  setActivityLogs,
  setAllTasks,
  setAttachmentLoading,
  setAttachments,
  setLoading,
  setSubtaskLoading,
  setSubtasks,
  updateSubtask,
  updateTask,
  upsertTask,
} from "../../Redux_Config/Slices/tasksSlice";



const {
  CREATE_TASK,
  UPDATE_TASK,

  DELETE_TASK,
  GET_PROJECT_TASKS,
  GET_TASK_DETAILS,
  UPDATE_TASK_ASSIGNEES,

  UPDATE_TASK_ORDER,
  UPDATE_TASK_STATUS,
} = TASK_END_POINTS;

const {
  CREATE_SUB_TASK,
  GET_ALL_SUB_TASK,
  TOGGLE_SUBTASK_COMPLETE,
  DELETE_SUBTASK,
} = SUB_TASK_END_POINTS;

const {
  ADD_TASK_ATTACHMENT,
  GET_TASK_ATTACHMENTS,
  DELETE_TASK_ATTACHMENT,
} = ATTACHMENT_END_POINTS;
const { GET_TASK_ACTIVITY } = ACTIVITY_END_POINTS;


export const deleteTaskAttachmentService = (
  projectId,
  taskId,
  attachmentId,
  token
) => {
  return async (dispatch) => {
    dispatch(setAttachmentLoading(true));
    try {
      const endpoint = DELETE_TASK_ATTACHMENT.replace(":projectId", projectId)
        .replace(":taskId", taskId)
        .replace(":attachmentId", attachmentId);

      const response = await axiosInstance.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Attachment deleted");
        // We could also filter locally but refetching is safer for simple apps
        dispatch(fetchTaskAttachmentsService(projectId, taskId, token));
      }
    } catch (error) {
      toast.error(GenerateErrorMessage(error));
    } finally {
      dispatch(setAttachmentLoading(false));
    }
  };
};

function GenerateErrorMessage(error) {
  const message =
    error?.response?.data?.message || error.message || "Failed to create task";

  return message;
}

const normalizeSubtask = (subtask, taskId) => ({
  ...subtask,
  task:
    typeof subtask.task === "object"
      ? subtask.task?._id
      : subtask.task || taskId,
});

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

      // console.log("response is ---> ", response.data);
      if (response.data.success) {
        dispatch(addTask(response.data?.data));
        toast.success(response.data.message);
        onClose(false);
      }
    } catch (error) {
      // console.log("error in create Task---> ", error);
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

      const response = await axiosInstance.get(endPoints, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // console.log("response is ---> ", response.data);
      if (response.data.success) {
        dispatch(setAllTasks(response.data?.data));
        // toast.success(response.data.message)
      }
    } catch (error) {
      // console.log("error in get Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};



export const getSingleTasksService = (projectId, taskId, token) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const endPoints = GET_TASK_DETAILS.replace(":projectId", projectId).replace(":taskId", taskId);

      const response = await axiosInstance.get(endPoints, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("response of single task fetch is ---> ", response.data);
        dispatch(upsertTask(response.data.data));
        // toast.success(response.data.message)
      }
    } catch (error) {
      // console.log("error in get Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateTaskService = (
  formData,
  projectId,
  taskId,
  token,
  onClose
) => {
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

      // console.log("response is on update task ---> ", response.data);

      if (response.data.success) {
        dispatch(updateTask(response.data?.data));
        toast.success(response.data.message);
        onClose(false);
        dispatch(getAllTasksService(projectId, token));
      }
    } catch (error) {
      // console.log("error in update Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteTaskService = (projectId, taskId, token) => {
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

      // console.log("response is on delete task ---> ", response.data);

      if (response.data.success) {
        dispatch(deleteTask(response.data?.data));
        toast.success(response.data.message);
        dispatch(getAllTasksService(projectId, token));
      }
    } catch (error) {
      // console.log("error in delete Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateAssigneesTaskService = (
  assignnnesData,
  projectId,
  taskId,
  token
) => {
  return async (dispatch, getstate) => {
    dispatch(setLoading(true));
    try {
      const NEW_UPDATE_TASK_ASSIGNEES = UPDATE_TASK_ASSIGNEES.replace(
        ":projectId",
        projectId
      );
      const endPoints = NEW_UPDATE_TASK_ASSIGNEES.replace(":taskId", taskId);

      const response = await axiosInstance.patch(
        endPoints,
        { assignees: assignnnesData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // console.log("response is on update Assignee task ---> ", response.data);

      // make sure backend send a whole update data not only array whichis updated okk..
      if (response.data.success) {
        dispatch(updateTask(response.data?.data));
        toast.success(response.data.message);
      }
    } catch (error) {
      // console.log("error in update assignes Task---> ", error);
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


// order and chnage status
export const updateTaskStatusService = (projectId, taskId, statusId, token) => {
  return async (dispatch) => {
    try {
      const endpoint = UPDATE_TASK_STATUS.replace(
        ":projectId",
        projectId
      ).replace(":taskId", taskId);

      const response = await axiosInstance.patch(
        endpoint,
        { statusId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedTask = response.data.data;
        console.log("update task status response--> ", updatedTask);

        dispatch(updateTask(updatedTask));

        toast.success("Task moved successfully");
      }
    } catch (error) {
      console.error("Status update failed", error);
      toast.error(
        error?.response?.data?.message || "Failed to update task status"
      );
    }
  };
};

export const updateTaskOrderService = (projectId, taskId, newOrder, token) => {
  return async (dispatch) => {
    try {
      const endpoint = UPDATE_TASK_ORDER.replace(
        ":projectId",
        projectId
      ).replace(":taskId", taskId);

      const response = await axiosInstance.patch(
        endpoint,
        { order: newOrder },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedTask = response.data.data;

        console.log("updated task Order response --> ", updatedTask);
        dispatch(updateTask(updatedTask));
        // toast.success("order chnage succesfully");
      }
    } catch (error) {
      console.error("Order update failed", error);
      toast.error(error?.response?.data?.message || "Failed to reorder task");
    }
  };
};

// sub task services

export const createSubTaskService = (title, projectId, taskId, token) => {
  return async (dispatch) => {
    dispatch(setSubtaskLoading(true));

    try {
      const endpoint = CREATE_SUB_TASK.replace(":projectId", projectId).replace(
        ":taskId",
        taskId
      );

      const response = await axiosInstance.post(
        endpoint,
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { subTask } = response.data.data;

        const flattenedSubtask = {
          ...subTask,
          task: taskId,
        };

        dispatch(
          addSubtask({
            taskId,
            subtask: flattenedSubtask,
          })
        );

        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(GenerateErrorMessage(error));
    } finally {
      dispatch(setSubtaskLoading(false));
    }
  };
};

export const fetchAllSubTaskService = (projectId, taskId, token) => {
  return async (dispatch) => {
    dispatch(setSubtaskLoading(true));

    try {
      const endpoint = GET_ALL_SUB_TASK.replace(
        ":projectId",
        projectId
      ).replace(":taskId", taskId);

      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const normalizedSubtasks = response.data.data.map((s) =>
          normalizeSubtask(s, taskId)
        );

        dispatch(
          setSubtasks({
            taskId,
            subtasks: normalizedSubtasks,
          })
        );
      }
    } catch (error) {
      const message = GenerateErrorMessage(error);
      toast.error(message);
    } finally {
      dispatch(setSubtaskLoading(false));
    }
  };
};

export const toggleSubtaskCompleteService = (
  isCompleted,
  subtaskId,
  taskId,
  projectId,
  token
) => {
  return async (dispatch) => {
    try {
      const endpoint = TOGGLE_SUBTASK_COMPLETE.replace(":projectId", projectId)
        .replace(":subTaskId", subtaskId)
        .replace(":taskId", taskId);

      const response = await axiosInstance.patch(
        endpoint,
        { isCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedSubtask = response.data.data;
        const normalizedData = normalizeSubtask(updatedSubtask, taskId);

        dispatch(
          updateSubtask({
            taskId,
            subtask: normalizedData,
          })
        );
      }
    } catch (error) {
      console.log("error in toggle sub task -->", error);

      toast.error(GenerateErrorMessage(error));
    }
  };
};

export const deleteSubtaskService = (subtaskId, taskId, projectId, token) => {
  return async (dispatch) => {
    try {
      const endpoint = DELETE_SUBTASK.replace(":projectId", projectId)
        .replace(":subTaskId", subtaskId)
        .replace(":taskId", taskId);

      const response = await axiosInstance.delete(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("response id for delete sub task --> ", response.data);

      if (response.data.success) {
        dispatch(
          deleteSubtask({
            taskId,
            subtaskId,
          })
        );
      }
    } catch (error) {
      console.log("error in toggle sub task -->", error);

      toast.error(GenerateErrorMessage(error));
    }
  };
};

//ATTECHMENT SERVICES

export const addTaskAttachmentService = (
  projectId,
  taskId,
  formData,
  token
) => {
  return async (dispatch, getstate) => {
    dispatch(setAttachmentLoading(true));
    try {
      const endpoint = ADD_TASK_ATTACHMENT.replace(
        ":projectId",
        projectId
      ).replace(":taskId", taskId);


      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let Axios handle the Content-Type for FormData
        },
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("response in attechment----> ", response.data);

        dispatch(
          addAttachment({
            taskId: taskId,
            attachment: response.data.data,
          })
        );
      }
    } catch (error) {
      toast.error(GenerateErrorMessage(error));
    } finally {
      dispatch(setAttachmentLoading(false));
    }
  };
};

export const fetchTaskAttachmentsService = (projectId, taskId, token) => {
  return async (dispatch) => {
    dispatch(setAttachmentLoading(true));

    try {
      const endpoint = GET_TASK_ATTACHMENTS.replace(
        ":projectId",
        projectId
      ).replace(":taskId", taskId);

      const res = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        dispatch(
          setAttachments({
            taskId,
            attachments: res.data.data,
          })
        );
      }
    } catch (err) {
      toast.error(GenerateErrorMessage(err));
    } finally {
      dispatch(setAttachmentLoading(false));
    }
  };
};


// activity services

export const fetchTaskActivityService = (taskId, projectId, token) => {
  return async (dispatch) => {

    try {
      const endPoints = GET_TASK_ACTIVITY.replace(":taskId", taskId).replace(":projectId", projectId)

      const response = await axiosInstance.get(endPoints, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      //  console.log("response of get activity taask---> ",response);

      if (response.data.success) {
        dispatch(setActivityLogs(response.data.data.logs))
      }


    } catch (error) {
      console.log("error in fetch task activity --> ", GenerateErrorMessage(error));

      toast.error(GenerateErrorMessage(error) || "Failed to fetch task activity");
    }
  }
}