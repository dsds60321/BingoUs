import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// --- Configuration ---
const BASE_URL = 'https://api.bingous.com/v1'; // Replace with env variable if needed

// --- State ---
let accessToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

// --- Client Instance ---
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// --- Helpers ---
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// --- Interceptors ---

// Request Interceptor: Attach Token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // 1. Clear token
      accessToken = null;
      // 2. Trigger redirect callback
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default client;
