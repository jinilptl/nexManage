import axiosInstance from "../../utils/axios_instance";
import toast from "react-hot-toast";
import AUTH_END_POINTS from "./authEndPoints";
import {
  setLoading,
  setToken,
  setUser,
  setIsLogin,
} from "../../Redux_Config/Slices/authSlice";

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
    dispatch(setLoading(true));
    try {
      const Login_response = await axiosInstance.post(
        LOGIN,
        { email, password },
        { withCredentials: true }
      );
      Logger("login response from service", Login_response.data);

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
      Logger("login error from service", error);
      toast.error(error.response.data.message||"error while login")
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function forgotPasswordService(email) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const forgot_password_response = await axiosInstance.post(
        FORGET_PASSWORD,
        { email },
        { withCredentials: true }
      );
      Logger("forgot password response from service", forgot_password_response);
    } catch (error) {
      Logger("forgot password error from service", error);
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function resetPasswordService(newPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const resetPassword_response = await axiosInstance.post(
        `${RESET_PASSWORD}/${token}`,
        { newPassword },
        { withCredentials: true }
      );

      Logger("reset password response from service", resetPassword_response);
    } catch (error) {
      Logger("reset password error from service", error);
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };
}
