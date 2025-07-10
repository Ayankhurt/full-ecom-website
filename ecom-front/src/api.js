import axios from "axios";

const api = axios.create({
  baseURL: "https://full-ecom-website-ybmw.vercel.app",
  withCredentials: true,
});
export default api;
