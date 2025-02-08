import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/posts",withCredentials: true  // Backend API
});

export default api;
