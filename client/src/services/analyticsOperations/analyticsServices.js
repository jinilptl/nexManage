import axiosInstance from "../../utils/axios_instance";
import ANALYTICS_END_POINTS from "./analyticsEndPoints";

export const fetchDashboardAnalytics = async (token) => {
  const response = await axiosInstance.get(ANALYTICS_END_POINTS.DASHBOARD, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const fetchMainDashboard = async (token) => {
  const response = await axiosInstance.get(
    ANALYTICS_END_POINTS.MAIN_DASHBOARD,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );
  return response.data;
};
