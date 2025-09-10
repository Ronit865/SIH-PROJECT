import axios from "axios";

const api = axios.create({
  // baseURL: "/", // goes through Vite proxy
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default api;
