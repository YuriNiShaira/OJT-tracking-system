import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending/receiving cookies
});

// Response interceptor to handle 401 errors and refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Endpoints that don't need refresh logic
    const isAuthEndpoint =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/check-auth') ||
      originalRequest.url.includes('/auth/register/');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        // Try refreshing the token
        await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          {},
          { withCredentials: true } // cookies sent
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
