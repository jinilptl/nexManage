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

export function loginUserService(email, password, navigate, rememberMe) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const Login_response = await axiosInstance.post(
        LOGIN,
        { email, password },
        { withCredentials: true }
      );

      if (Login_response.data.success) {
        const token = Login_response.data.data.token;
        const user = Login_response.data.data.userdDetailes;

        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        dispatch(setUser(user));
        dispatch(setToken(token));
        dispatch(setIsLogin(true));

        toast.success(Login_response.data.data.message || "Login successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error while login");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export function addMemberService(memberData, token) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const response = await axiosInstance.post(ADD_MEMBER, memberData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "User registered successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to add member",
      );
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
        { withCredentials: true },
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
        { withCredentials: true },
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
        },
      );

      // Redux clear
      dispatch(clearAuth());
      dispatch(clearTeams());
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed!");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};
