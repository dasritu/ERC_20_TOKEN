import axios from "axios";
import { base_url } from "./Api";

let axiosInstance = axios.create({
    baseURL:base_url,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
    
});
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  

export default axiosInstance;