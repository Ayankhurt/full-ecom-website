import axios from "axios";

const api = axios.create({
  baseURL: "https://full-ecom-website-nu.vercel.app/api/v1/",
  withCredentials: true,
});
export default api;
