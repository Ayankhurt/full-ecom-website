import axios from "axios";

const api = axios.create({
  baseURL: "https://full-ecom-website-gva6.vercel.app/",
  withCredentials: true,
});
export default api;
