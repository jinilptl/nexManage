import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import AUTH_END_POINTS from "./authEndPoints";
import {
  setAuthLoading,
  setToken,
  setUser,
  setIsLogin,
  clearAuth,
} from "../../Redux_Config/Slices/authSlice";
import { clearTeams } from "../../Redux_Config/Slices/teamsSlice";

let Logger = console.log;

const {
  LOGIN,
  ADD_MEMBER,
  LOGOUT,
  FORGET_PASSWORD, 
  RESET_PASSWORD,
  CHANGE_PASSWORD,
} = AUTH_END_POINTS;

export function loginUserService(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const Login_response = await axiosInstance.post(
        LOGIN,
        { email, password },
        { withCredentials: true }
      );
      // Logger("login response from service", Login_response.data);

      if (Login_response.data.success) {
        let token = Login_response.data.data.token;
        let user = Login_response.data.data.userdDetailes;
        toast.success(Login_response.data.data.message||"login succesfully")
        // Logger("login success, dispatching to slice", user, token.slice(0,20));
        dispatch(setUser(user));
        dispatch(setToken(token));
        dispatch(setIsLogin(true));
        navigate("/dashboard");
      }
    } catch (error) {
      // Logger("login error from service", error);
      toast.error(error.response.data.message||"error while login")
      dispatch(setAuthLoading(false));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export function forgotPasswordService(email) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const forgot_password_response = await axiosInstance.post(
        FORGET_PASSWORD,
        { email },
        { withCredentials: true }
      );
      // Logger("forgot password response from service", forgot_password_response);
    } catch (error) {
      // Logger("forgot password error from service", error);
      dispatch(setAuthLoading(false));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export function resetPasswordService(newPassword, token) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const resetPassword_response = await axiosInstance.post(
        `${RESET_PASSWORD}/${token}`,
        { newPassword },
        { withCredentials: true }
      );

      // Logger("reset password response from service", resetPassword_response);
    } catch (error) {
      // Logger("reset password error from service", error);
      dispatch(setAuthLoading(false));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export const logoutService = (token, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(setAuthLoading(true));

      await axiosInstance.post(
        LOGOUT,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Redux clear
      dispatch(clearAuth());
      dispatch(clearTeams());
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      toast.success("Logged out successfully!");
      navigate("/");

    } catch (error) {
      toast.error("Logout failed!");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

