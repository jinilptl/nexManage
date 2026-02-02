import axiosInstance from "../../utils/axios_instance";
import ANALYTICS_END_POINTS from "./analyticsEndPoints";

export const fetchDashboardAnalytics = async () => {
  const response = await axiosInstance.get(
    ANALYTICS_END_POINTS.DASHBOARD
  );
  return response.data;
};