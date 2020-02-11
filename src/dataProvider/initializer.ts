import axios from 'axios';
import { HttpError } from './errors';

// Handle HTTP errors.
export default () => {
  // Request interceptor
  axios.interceptors.request.use(
    config => {
      const accessToken = localStorage.getItem('access_token');
      const newConfig = config;
      // When a 'token' is available set as Bearer token.
      if (accessToken) {
        newConfig.headers.Authorization = `Basic ${accessToken}`;
      }

      return newConfig;
    },
    err => Promise.reject(err)
  );

  // Response interceptor
  axios.interceptors.response.use(
    response => response,
    error => {
      const { status, data } = error.response;

      if (status < 200 || status >= 300) {
        return Promise.reject(new HttpError(data, status));
      }

      return Promise.reject(error);
    }
  );
};
