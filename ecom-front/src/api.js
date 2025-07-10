import axios from "axios";

const api = axios.create({
  baseURL: "https://full-ecom-website-gva6.vercel.app/api/v1/",
  withCredentials: true,
});
export default api;
