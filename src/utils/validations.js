const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateCompanyPassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number.';
  }
  return '';
}

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.';
  return '';
}

export function validateName(value, label) {
  if (!value?.trim()) return `${label} is required.`;
  if (!NAME_REGEX.test(value.trim())) {
    return `${label} cannot contain numbers or special characters.`;
  }
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters with 1 uppercase letter and 1 number.';
  }
  return '';
}

export function validateConfirmPassword(password, confirmPassword, options = {}) {
  const { live = false } = options;
  if (!confirmPassword) {
    return live ? '' : 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match. Please re-enter.';
  }
  return '';
}

/** Live + submit validation for Login Credentials step (per Figma/PDF) */
export function getProfileFieldErrors(fields, touched = {}) {
  const { password, confirmPassword, birthday, phone, acceptedTerms } = fields;
  const errors = {};

  if (password) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  } else if (touched.password) {
    errors.password = 'Password is required.';
  }

  if (confirmPassword) {
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }
  } else if (touched.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  }

  if (touched.birthday || birthday) {
    const birthdayError = validateBirthday(birthday);
    if (birthdayError) errors.birthday = birthdayError;
  }

  if (touched.phone || phone) {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (touched.terms && !acceptedTerms) {
    errors.terms = 'You must accept the Terms of Service and Privacy Policy.';
  }

  return errors;
}

export function isProfileFormValid(fields) {
  return (
    !validatePassword(fields.password) &&
    !validateConfirmPassword(fields.password, fields.confirmPassword) &&
    !validateBirthday(fields.birthday) &&
    !validatePhone(fields.phone) &&
    fields.acceptedTerms
  );
}

export function validateBirthday(value) {
  if (!value?.trim()) return 'Birthday is required.';
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return 'Enter birthdate in MM/DD/YYYY format.';
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Please enter a valid date.';
  }
  return '';
}

export function birthdayToApiFormat(mmddyyyy) {
  const match = mmddyyyy.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return '';
  return `${match[3]}-${match[1]}-${match[2]}`;
}

export function validatePhone(phone) {
  if (!phone?.trim()) return 'Contact number is required.';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return 'Please enter a valid contact number.';
  return '';
}

export function validateOtp(otp) {
  if (!otp || otp.length !== 6) return 'Please enter the 6-digit OTP.';
  if (!/^\d{6}$/.test(otp)) return 'OTP must contain only numbers.';
  return '';
}

