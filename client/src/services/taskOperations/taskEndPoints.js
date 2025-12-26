const TASK_END_POINTS = {
  // CREATE
  CREATE_TASK: "/v1/project/task/create-task/:projectId",

  // READ
  GET_PROJECT_TASKS: "/v1/project/task/project-tasks/:projectId",
  GET_TASK_DETAILS: "/:projectId/get-task/:taskId",

  // UPDATE
  UPDATE_TASK: "/update-task/:projectId/:taskId",
  UPDATE_TASK_STATUS: "/status/:projectId/:taskId",
  UPDATE_TASK_ORDER: "/order/:projectId/:taskId",
  UPDATE_TASK_ASSIGNEES: "/updatetask-assignees/:projectId/:taskId",

  // DELETE
  DELETE_TASK: "/delete/:projectId/:taskId",
};


export default TASK_END_POINTS