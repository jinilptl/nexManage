import {configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../Reducers/RootReducers";


export const Store=configureStore({
    reducer:rootReducer
})