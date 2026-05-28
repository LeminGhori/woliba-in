import type { ChangeEvent, FormEvent } from 'react';
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

type ProfileFields = {
  password: string;
  confirmPassword: string;
  birthday: string;
  phone: string;
  acceptedTerms: boolean;
};

type Touched = Partial<Record<'password' | 'confirmPassword' | 'birthday' | 'phone' | 'terms', boolean>>;

export default function CompleteProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.registration);

  const [password, setPassword] = useState<string>(profile.password || '');
  const [confirmPassword, setConfirmPassword] = useState<string>(
    profile.confirmPassword || ''
  );
  const [birthday, setBirthday] = useState<string>(profile.birthday || '');
  const [phone, setPhone] = useState<string>(profile.phone || '');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(
    profile.acceptedTerms || false
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Touched>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fields: ProfileFields = useMemo(
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
    (nextTouched: Touched = touched, values: ProfileFields = fields) => {
      const errors = getProfileFieldErrors(values, nextTouched as any) as Record<
        string,
        string
      >;
      setFieldErrors(errors);
      return errors;
    },
    [touched, fields]
  );

  const markTouched = (key: keyof Touched) => {
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);
    runValidation(nextTouched);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      next.password = value ? validatePassword(value) : '';
      if (confirmPassword) {
        next.confirmPassword =
          value !== confirmPassword
            ? 'Passwords do not match. Please re-enter.'
            : '';
      }
      return next;
    });
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword:
        value && password !== value
          ? 'Passwords do not match. Please re-enter.'
          : '',
    }));
  };

  const handleBirthdaySelect = (value: string) => {
    setBirthday(value);
    const nextTouched: Touched = { ...touched, birthday: true };
    setTouched(nextTouched);
    runValidation(nextTouched, { ...fields, birthday: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched: Touched = {
      password: true,
      confirmPassword: true,
      birthday: true,
      phone: true,
      terms: true,
    };
    setTouched(allTouched);
    const errors = getProfileFieldErrors(fields, allTouched as any) as Record<
      string,
      string
    >;
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
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => markTouched('password')}
          error={fieldErrors.password}
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
          />
          {fieldErrors.birthday && (
            <p className="form-error" role="alert">
              {fieldErrors.birthday}
            </p>
          )}
        </div>
        <Input
          id="phone"
          label="Contact number"
          placeholder="Enter contact number"
          value={phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPhone(e.target.value);
            if (touched.phone) {
              runValidation(touched, { ...fields, phone: e.target.value });
            }
          }}
          onBlur={() => markTouched('phone')}
          error={fieldErrors.phone}
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
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

