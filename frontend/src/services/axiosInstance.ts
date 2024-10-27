import axios from 'axios';

// Create an Axios instance with a base URL for the backend API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await api.post('/token/refresh/');  // Send request to refresh token
          isRefreshing = false;
          onRefreshed(response.data.access_token);  // Notify subscribers with new token
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);  // Return if refresh fails
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);


export default api;