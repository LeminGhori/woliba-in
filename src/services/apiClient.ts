import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

function extractApiErrorMessage(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === 'string') return payload;
  const p = payload as any;
  return p?.data?.message || p?.error || p?.message || null;
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
    const body = response.data as any;
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
    const payload = error.response?.data as unknown;

    if (typeof payload === 'string' && payload.includes('<Error>')) {
      return Promise.reject(
        new Error(
          'API host misconfigured. Use https://dev.api.woliba.io/v1 (not dev.woliba.io).'
        )
      );
    }

    const message =
      extractApiErrorMessage(payload) ||
      (error as Error).message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

