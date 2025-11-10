

const AUTH_END_POINTS = {
    LOGIN: '/v1/user/login',
    ADD_MEMBER: '/v1/user/register', // THIS IS SECURE ENDPOINT FOR ONLY ADMINS ANS SUPERS ADMIN
    LOGOUT: '/v1/user/logout',
    FORGET_PASSWORD: '/v1/user/forget-password',
    RESET_PASSWORD: '/v1/user/reset-password', //TOKEN will be appended dynamically SO RESET/:TOKEN
    CHANGE_PASSWORD: '/v1/user/change-password',
}

export default AUTH_END_POINTS;