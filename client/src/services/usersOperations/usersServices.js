import axiosInstance from "../../utils/axios_instance";
import { usersEndpoints } from "./usersEndPoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        usersEndpoints.GET_ALL_USERS
      );

      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        usersEndpoints.UPDATE_USER(userId),
        data
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(usersEndpoints.DELETE_USER(userId));
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "users/updatePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        usersEndpoints.CHANGE_PASSWORD,
        {
          oldPassword: currentPassword,
          newPassword,
        }
      );

      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update password"
      );
    }
  }
);
