import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  withCredentials: true, // send/receive httpOnly JWT cookies
});

export default api;
