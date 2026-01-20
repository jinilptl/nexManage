import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice"
import teamsReducer from "../Slices/teamsSlice"
import projectReducer from "../Slices/projectsSlice"
import taskreducer from "../Slices/tasksSlice"

export const rootReducer=combineReducers({
    // your reducers here
    auth:authReducer,
    teams:teamsReducer,
    projects:projectReducer,
    tasks:taskreducer
})