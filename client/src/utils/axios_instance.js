import axios from "axios";

const Base_Url = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: Base_Url,
  withCredentials: true,
});

export default axiosInstance;
