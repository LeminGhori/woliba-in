import { birthdayToApiFormat } from './validations';

/** Flatten nested interest arrays returned by viewWellnessInterest */
export function normalizeInterests(data) {
  if (!Array.isArray(data)) return [];
  if (data.length > 0 && Array.isArray(data[0])) {
    return data.flat();
  }
  return data;
}

/**
 * POST /user-registration body per API doc (section 7).
 * `email` is required by the API even though the doc sample omits it (-106 without it).
 */
export function buildUserRegistrationPayload(registrationState) {
  const { userDetails, profile, otpToken, selectedInterests, selectedPillars } =
    registrationState;

  const email = userDetails?.email?.trim();
  if (!email) {
    throw new Error('Email is required to complete registration.');
  }
  if (!otpToken) {
    throw new Error('OTP verification is required. Please verify your email again.');
  }

  return {
    fname: userDetails.fname?.trim(),
    lname: userDetails.lname?.trim(),
    email,
    password: profile.password,
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    token: otpToken,
    areas_of_interest: selectedInterests,
    wellbeing_pillars: selectedPillars,
    accepted_privacy_policy: Boolean(profile.acceptedTerms),
    birthday: birthdayToApiFormat(profile.birthday),
    phone_number: profile.phone?.trim() || '',
    user_type: 0,
    gender: 'Male',
    language_id: 1,
    smoke: 'no',
    exercise_day_per_week: '3-4 days',
    average_sleep_per_night: '7-8 hours',
    average_water_intake: '8+ glasses',
    pain_experience: 'rarely',
    prescription_intake: 'none',
    physical_exam_frequency: 'annually',
  };
}

export function isEmailAlreadyRegisteredError(message) {
  return (
    typeof message === 'string' &&
    message.toLowerCase().includes('already registered')
  );
}

export function isSessionExpiredError(message) {
  return (
    typeof message === 'string' && message.toLowerCase().includes('session expired')
  );
}

/** Normalize user-registration success payload (API shape varies on dev). */
export function parseRegistrationUser(apiResponse, fallback) {
  const data = apiResponse?.data || {};
  const apiUser = data?.user || apiResponse?.user || null;

  // If the API returns a nested user object, merge it with our fallback.
  if (apiUser && typeof apiUser === 'object') {
    return {
      ...fallback,
      ...apiUser,
      fname: apiUser.fname || fallback.fname,
      lname: apiUser.lname || fallback.lname,
      email: apiUser.email || fallback.email,
      user_name: apiUser.user_name || apiUser.userName || fallback.user_name,
    };
  }

  // If the API returns the fields at the top level.
  if (data?.fname || data?.lname || data?.email) {
    return {
      ...fallback,
      ...data,
    };
  }

  // If the API returns only user_name, surface it.
  if (data?.user_name || data?.userName) {
    return {
      ...fallback,
      user_name: data.user_name || data.userName,
      fname: fallback.fname,
    };
  }

  return fallback;
}

export function parseRegistrationAuthToken(apiResponse) {
  return apiResponse?.data?.token || apiResponse?.token || null;
}

