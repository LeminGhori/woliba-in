import apiClient from '../services/apiClient';
import { API_ORIGIN } from '../utils/constants';

export async function verifyCompany(companyName, password) {
  const { data } = await apiClient.post('/verify-by-company-name-and-password', {
    company_name: companyName.trim(),
    password,
  });
  return data;
}

export async function saveUserDetails(payload) {
  const { data } = await apiClient.post('/save-user-details-and-send-otp', payload);
  return data;
}

export async function verifyOtp(otp, token) {
  const { data } = await apiClient.post('/verify-otp-for-user-registration', {
    otp,
    token,
  });
  return data;
}

export async function resendOtp(email) {
  const { data } = await apiClient.post('/send-otp-for-user-registration', {
    email,
  });
  return data;
}

export async function fetchWellnessInterests() {
  const { data } = await apiClient.get('/viewWellnessInterest', {
    headers: {
      Origin: API_ORIGIN,
      Referer: `${API_ORIGIN}/`,
    },
  });
  return data;
}

export async function fetchWellbeingPillars(languageId = 1) {
  const { data } = await apiClient.get(`/get-wellbeing-pillars/${languageId}`);
  return data;
}

export async function completeRegistration(payload) {
  const { data } = await apiClient.post('/user-registration', payload);
  return data;
}

