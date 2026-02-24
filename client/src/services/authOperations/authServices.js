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

const {
  LOGIN,
  INVITE_MEMBER,
  SET_PASSWORD,
  GET_MY_PROFILE,
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
        { withCredentials: true },
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

export function inviteMemberService(memberData, token) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const response = await axiosInstance.post(INVITE_MEMBER, memberData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message || "Invitation sent successfully");
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Failed to send invitation",
      );
      return false;
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export async function setPasswordService(token, password) {
  try {
    const response = await axiosInstance.post(
      `${SET_PASSWORD}/${token}`,
      { password },
      { withCredentials: true },
    );

    if (response.data.success) {
      toast.success(
        response.data.message || "Password set successfully. You can now log in."
      );
      return true;
    }
    return false;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to set password. The link may have expired."
    );
    return false;
  }
}

export function getMyProfileService(token) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.get(GET_MY_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        const user = response.data.data;
        dispatch(setUser(user));
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch profile data",
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
      const response = await axiosInstance.post(
        FORGET_PASSWORD,
        { email },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Reset link sent to your email");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset link",
      );
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

export function resetPasswordService(newPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));

    try {
      const response = await axiosInstance.post(
        `${RESET_PASSWORD}/${token}`,
        { newPassword },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Password reset successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
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
