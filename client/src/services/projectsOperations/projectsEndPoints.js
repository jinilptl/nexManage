

const PROJECTS_END_POINTS = {

    CREATE_PROJECT: '/v1/project/create-project',
    GET_ALL_PROJECTS: '/v1/project/get-all-projects', // THIS IS SECURE ENDPOINT FOR ONLY ADMINS ANS SUPERS ADMIN
    GET_PROJECT: '/v1/project/get-project/:projectId',
    GET_USER_PROJECTS: '/v1/project/get-my-projects',
    UPDATE_PROJECT: '/v1/project/update-project/:projectId',
    DELETE_PROJECT: '/v1/project/delete-project/:projectId',

    // PROJECTS member endpoints ?

    // ADD_PROJECT_MEMBER: '/v1/project/add-member',
    // REMOVE_PROJECT_MEMBER: '/v1/project/remove-member',
    // GET_PROJECT_MEMBERS: '/v1/project/get-all-members',  
    // UPDATE_PROJECT_MEMBER: '/v1/project/update-member',

}

export default PROJECTS_END_POINTS;