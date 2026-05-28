import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Input from '../components/Input';
import StepActions from '../components/StepActions';
import DatePicker from '../components/DatePicker';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setProfile } from '../redux/registrationSlice';
import {
  getProfileFieldErrors,
  isProfileFormValid,
  validatePassword,
} from '../utils/validations';
import { ROUTES } from '../utils/constants';

export default function CompleteProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.registration);

  const [password, setPassword] = useState(profile.password || '');
  const [confirmPassword, setConfirmPassword] = useState(profile.confirmPassword || '');
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [acceptedTerms, setAcceptedTerms] = useState(profile.acceptedTerms || false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fields = useMemo(
    () => ({
      password,
      confirmPassword,
      birthday,
      phone,
      acceptedTerms,
    }),
    [password, confirmPassword, birthday, phone, acceptedTerms]
  );

  const runValidation = useCallback(
    (nextTouched = touched, values = fields) => {
      const errors = getProfileFieldErrors(values, nextTouched);
      setFieldErrors(errors);
      return errors;
    },
    [touched, fields]
  );

  const markTouched = (key) => {
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);
    runValidation(nextTouched);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      next.password = value ? validatePassword(value) : '';
      if (confirmPassword) {
        next.confirmPassword =
          value !== confirmPassword ? 'Passwords do not match. Please re-enter.' : '';
      }
      return next;
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword:
        value && password !== value ? 'Passwords do not match. Please re-enter.' : '',
    }));
  };

  const handleBirthdaySelect = (value) => {
    setBirthday(value);
    const nextTouched = { ...touched, birthday: true };
    setTouched(nextTouched);
    runValidation(nextTouched, { ...fields, birthday: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = {
      password: true,
      confirmPassword: true,
      birthday: true,
      phone: true,
      terms: true,
    };
    setTouched(allTouched);
    const errors = getProfileFieldErrors(fields, allTouched);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    dispatch(
      setProfile({
        password,
        confirmPassword,
        birthday,
        phone,
        acceptedTerms,
      })
    );
    navigate(ROUTES.INTERESTS);
  };

  const formValid = isProfileFormValid(fields);

  return (
    <Layout pageTitle="Login Credentials">
      <form onSubmit={handleSubmit} noValidate aria-label="Complete profile form">
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => markTouched('password')}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Enter password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={() => markTouched('confirmPassword')}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />
        <div className="form-group">
          <label className="form-label" htmlFor="birthday">
            Birthday
          </label>
          <input
            id="birthday"
            readOnly
            className={`form-input form-input--picker ${
              fieldErrors.birthday ? 'form-input--error' : ''
            }`}
            placeholder="Select date of birth [MM/DD/YYYY]"
            value={birthday}
            onClick={() => setShowDatePicker(true)}
            onBlur={() => markTouched('birthday')}
            aria-invalid={Boolean(fieldErrors.birthday)}
            aria-describedby={fieldErrors.birthday ? 'birthday-error' : undefined}
          />
          {fieldErrors.birthday && (
            <p className="form-error" id="birthday-error" role="alert">
              {fieldErrors.birthday}
            </p>
          )}
        </div>
        <Input
          id="phone"
          label="Contact number"
          placeholder="Enter contact number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (touched.phone) {
              runValidation(touched, { ...fields, phone: e.target.value });
            }
          }}
          onBlur={() => markTouched('phone')}
          error={fieldErrors.phone}
          autoComplete="tel"
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (touched.terms) {
                runValidation(
                  { ...touched, terms: true },
                  {
                    ...fields,
                    acceptedTerms: e.target.checked,
                  }
                );
              }
            }}
            onBlur={() => markTouched('terms')}
          />
          <span>
            I agree to Woliba&apos;s{' '}
            <a href="https://woliba.io/terms" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="https://woliba.io/privacy" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {fieldErrors.terms && <p className="form-error">{fieldErrors.terms}</p>}
        <StepActions
          backTo={ROUTES.OTP}
          primaryLabel="Next"
          primaryType="submit"
          primaryDisabled={!formValid}
        />
      </form>
      {showDatePicker && (
        <DatePicker
          value={birthday}
          onChange={handleBirthdaySelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </Layout>
  );
}

