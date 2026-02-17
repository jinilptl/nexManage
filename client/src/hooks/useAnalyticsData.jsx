import { useEffect, useState } from "react";
import { fetchDashboardAnalytics } from "../services/analyticsOperations/analyticsServices";

export default function useAnalyticsData() {
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    statusData: [],
    priorityData: [],
    velocityData: [],
    contributors: [],
    activeProjects: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchDashboardAnalytics();

        if (res?.success) {
          setData(res.data);
        } else {
          setError("Failed to fetch analytics");
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return {
    ...data,
    loading,
    error,
  };
}
