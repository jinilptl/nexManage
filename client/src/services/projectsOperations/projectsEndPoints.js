const PROJECTS_END_POINTS = {
  CREATE_PROJECT: "/v1/project/create-project",
  GET_ALL_PROJECTS: "/v1/project/get-all-projects",
  GET_PROJECT: "/v1/project/get-project",
  GET_USER_PROJECTS: "/v1/project/get-my-projects",
  UPDATE_PROJECT: "/v1/project/update-project",
  DELETE_PROJECT: "/v1/project/delete-project",
  UPDATE_PROJECT_STATUS: "/v1/project/update-project-status",
  PATCH_PROJECT_STATUS: "/v1/project", // PATCH /v1/project/:projectId/status
  ADD_TASK_STATUSES: "/v1/project/:projectId/status",

  ADD_PROJECT_MEMBER: "/v1/project/add-members",
  REMOVE_PROJECT_MEMBER: "/v1/project/remove-members",
  ACTIVE_PROJECT_MEMBER: "/v1/project/active-members",
  GET_PROJECT_MEMBERS: "/v1/project/all-members",
  UPDATE_PROJECT_MEMBER: "/v1/project/update-members",
};

export default PROJECTS_END_POINTS;