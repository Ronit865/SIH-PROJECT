import axios from "axios";

const api = axios.create({
  baseURL: "/api", // goes through Vite proxy
  withCredentials: true,
});

export default api;
