import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-multivendor-store.onrender.com/api",
});

export default api;