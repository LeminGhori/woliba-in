// Use same-origin `/v1` so Vite (dev) and Vercel (prod) proxy avoid browser CORS.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1';
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'https://staging.gcp.woliba.io';
export const CLOUDFRONT_BASE_URL = 'https://d38xnw03cl4zf4.cloudfront.net';
export const OTP_RESEND_SECONDS = 180;
export const OTP_LENGTH = 6;

export const ROUTES = {
  COMPANY_VERIFY: '/',
  USER_DETAILS: '/user-details',
  OTP: '/verify-otp',
  PROFILE: '/complete-profile',
  INTERESTS: '/interests',
  PILLARS: '/wellbeing-pillars',
  PROCESSING: '/processing',
  WELCOME: '/welcome',
};

export const REGISTRATION_STEPS = [
  ROUTES.COMPANY_VERIFY,
  ROUTES.USER_DETAILS,
  ROUTES.OTP,
  ROUTES.PROFILE,
  ROUTES.INTERESTS,
  ROUTES.PILLARS,
  ROUTES.PROCESSING,
  ROUTES.WELCOME,
];

