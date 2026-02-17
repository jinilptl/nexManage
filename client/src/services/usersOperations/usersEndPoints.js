export const usersEndpoints = {
  GET_ALL_USERS: "/v1/users/all-users",
  UPDATE_USER: (userId) => `/v1/users/update-user/${userId}`,
  DELETE_USER: (userId) => `/v1/users/delete-user/${userId}`,
  CHANGE_PASSWORD: "/v1/users/change-password",
};
