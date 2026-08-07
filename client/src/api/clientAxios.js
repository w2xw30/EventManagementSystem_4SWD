import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const clientApi = axios.create({
  baseURL: `${API_BASE}/client`,
});

clientApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("clientToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("clientToken");
      window.location.href = "/client/login";
    }
    return Promise.reject(error);
  },
);

const clientAuthApi = axios.create({
  baseURL: `${API_BASE}/client-auth`,
});

export { clientApi, clientAuthApi };
export default clientApi;
