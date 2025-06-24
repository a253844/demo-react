import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 因為 nginx proxy 了 /api 到 backend
});

export default api;