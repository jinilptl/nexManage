import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice"

export const rootReducer=combineReducers({
    // your reducers here
    auth:authReducer
})