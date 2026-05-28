import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

function extractApiErrorMessage(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') return payload;
  const p = payload;
  return p?.data?.message || p?.error || p?.message || null;
}

function normalizeAxiosError(error) {
  const payload = error?.response?.data;

  if (typeof payload === 'string' && payload.includes('<Error>')) {
    return new Error(
      'API host misconfigured. Use https://dev.api.woliba.io/v1 (not dev.woliba.io).'
    );
  }

  const message =
    extractApiErrorMessage(payload) ||
    extractApiErrorMessage(error?.response) ||
    error?.message ||
    'Something went wrong. Please try again.';

  const err = new Error(message);
  err.status = error?.response?.status;
  err.code = error?.code;
  err.data = payload;
  return err;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    const failed =
      body?.status === 'failed' || body?.status === false || body?.status === 'error';

    if (failed) {
      const message =
        extractApiErrorMessage(body) || 'Request failed. Please try again.';
      return Promise.reject(new Error(message));
    }

    return response;
  },
  (error) => {
    return Promise.reject(normalizeAxiosError(error));
  }
);

export default apiClient;

