export const TASK_END_POINTS = {
  CREATE_TASK: "/v1/project/task/create-task/:projectId",

  GET_PROJECT_TASKS: "/v1/project/task/project-tasks/:projectId",
  GET_TASK_DETAILS: "/v1/project/task/:projectId/get-task/:taskId",

  UPDATE_TASK: "/v1/project/task/update-task/:projectId/:taskId",

  UPDATE_TASK_ASSIGNEES:
    "/v1/project/task/updatetask-assignees/:projectId/:taskId",

  DELETE_TASK: "/v1/project/task/delete/:projectId/:taskId",

  UPDATE_TASK_STATUS: "/v1/project/task/status/:projectId/:taskId",
  UPDATE_TASK_ORDER: "/v1/project/task/order/:projectId/:taskId",
};

export const SUB_TASK_END_POINTS = {
  CREATE_SUB_TASK: "/v1/project/task/subtask/:projectId/create-subtask/:taskId",
  GET_ALL_SUB_TASK: "/v1/project/task/subtask/:projectId/get-subtask/:taskId",
  TOGGLE_SUBTASK_COMPLETE:
    "/v1/project/task/subtask/:projectId/:taskId/complete/:subTaskId",
  DELETE_SUBTASK:
    "/v1/project/task/subtask/:projectId/:taskId/delete/:subTaskId",
};

export const ATTACHMENT_END_POINTS = {
  ADD_TASK_ATTACHMENT: "/v1/project/task/attachments/:projectId/:taskId",
  GET_TASK_ATTACHMENTS: "/v1/project/task/attachments/:projectId/:taskId",
  DELETE_TASK_ATTACHMENT:
    "/v1/project/task/attachments/:projectId/:taskId/:attachmentId",
};

export const ACTIVITY_END_POINTS = {
  GET_TASK_ACTIVITY: "/v1/project/task/activity/:projectId/:taskId",
};
