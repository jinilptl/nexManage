import axios from "axios";

const Base_Url=import.meta.env.VITE_BASE_URL
console.log("backend baseurl is -------",Base_Url);


const axiosInstance = axios.create({
  baseURL: Base_Url, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;