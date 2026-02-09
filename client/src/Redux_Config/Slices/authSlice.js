import { createSlice } from "@reduxjs/toolkit";

const storedToken =
  localStorage.getItem("token") || sessionStorage.getItem("token");

const storedUser =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  Authloading: false,
  error: null,
  isLogin: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.Authloading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setIsLogin(state, action) {
      state.isLogin = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isLogin = false;
      localStorage.clear();
      sessionStorage.clear();
    },
  },
});

export const { setAuthLoading, setUser, setToken, clearAuth, setIsLogin } =
  authSlice.actions;

export default authSlice.reducer;
