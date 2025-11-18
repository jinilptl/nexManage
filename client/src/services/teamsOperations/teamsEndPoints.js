

const TEAMS_END_POINTS = {
    CREATE_TEAM: '/v1/team/create-team',
    GET_ALL_TEAMS: '/v1/team/get-all-teams', // THIS IS SECURE ENDPOINT FOR ONLY ADMINS ANS SUPERS ADMIN
    GET_TEAM: '/v1/team/get-team',
    UPDATE_TEAM: '/v1/team/update-team',
    DELETE_TEAM: '/v1/team/delete-team',
    GET_USER_TEAMS: '/v1/team/user-teams',

    // teams member endpoints ?
    ADD_TEAM_MEMBER: '/v1/team/add-member',
    REMOVE_TEAM_MEMBER: '/v1/team/remove-member/:teamId/:memberId',
    GET_TEAM_MEMBERS: '/v1/team/get-all-members',  
    UPDATE_TEAM_MEMBER: '/v1/team/update-member/:teamId/:memberId',

}

export default TEAMS_END_POINTS;