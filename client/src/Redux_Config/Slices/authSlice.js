import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  Authloading: false,
  error: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // your reducers here
    setAuthLoading(state, action) {
      state.Authloading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },

    setIsLogin(state, action) {
      state.isLogin = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isLogin = false;
    },
  },
});

export const { setAuthLoading, setUser, setToken, clearAuth, setIsLogin } =
  authSlice.actions;

export default authSlice.reducer;
