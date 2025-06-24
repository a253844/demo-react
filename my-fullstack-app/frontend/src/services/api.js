import axios from "axios";

const token = localStorage.getItem('token');
debugger;
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); //  每次動態取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;