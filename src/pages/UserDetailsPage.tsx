import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserDetails } from '../api/registrationApi';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setUserDetails,
  setOtpToken,
  setEmailVerified,
  setLoading,
  setError,
  clearError,
} from '../redux/registrationSlice';
import { validateEmail, validateName } from '../utils/validations';
import { ROUTES } from '../utils/constants';

type UserDetailsErrors = Partial<Record<'email' | 'fname' | 'lname', string>>;
type Touched = Partial<Record<'email' | 'fname' | 'lname', boolean>>;

export default function UserDetailsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { company, userDetails, loading, error } = useAppSelector((state) => state.registration);

  const [email, setEmail] = useState<string>(userDetails.email || '');
  const [fname, setFname] = useState<string>(userDetails.fname || '');
  const [lname, setLname] = useState<string>(userDetails.lname || '');
  const [fieldErrors, setFieldErrors] = useState<UserDetailsErrors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validateForm = (): UserDetailsErrors => {
    const errors: UserDetailsErrors = {
      email: validateEmail(email),
      fname: validateName(fname, 'First name'),
      lname: validateName(lname, 'Last name'),
    };
    return Object.fromEntries(
      Object.entries(errors).filter(([, v]) => v)
    ) as UserDetailsErrors;
  };

  const isFormComplete =
    !validateEmail(email) &&
    !validateName(fname, 'First name') &&
    !validateName(lname, 'Last name');

  const handleVerifyEmail = async () => {
    dispatch(clearError());
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    dispatch(setLoading(true));

    try {
      const response: any = await saveUserDetails({
        company_id: company.id,
        mail: email.trim(),
        fname: fname.trim(),
        lname: lname.trim(),
      });

      const token = response?.data?.token;
      if (!token) {
        throw new Error('Failed to send OTP. Please try again.');
      }

      dispatch(
        setUserDetails({
          email: email.trim(),
          fname: fname.trim(),
          lname: lname.trim(),
        })
      );
      dispatch(setOtpToken(token));
      dispatch(setEmailVerified(true));
      navigate(ROUTES.OTP);
    } catch (err) {
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Layout pageTitle="Registration">
      <ErrorAlert message={error} />
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (isFormComplete) void handleVerifyEmail();
        }}
      >
        <Input
          id="email"
          label="Email ID"
          type="email"
          placeholder="Enter email id"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (touched.email) {
              setFieldErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value),
              }));
            }
          }}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            setTouched((t) => ({ ...t, email: true }));
            setFieldErrors((prev) => ({
              ...prev,
              email: validateEmail(e.target.value),
            }));
          }}
          error={fieldErrors.email}
        />
        <Input
          id="fname"
          label="First name"
          placeholder="Enter First name"
          value={fname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFname(e.target.value);
            if (touched.fname) {
              setFieldErrors((prev) => ({
                ...prev,
                fname: validateName(e.target.value, 'First name'),
              }));
            }
          }}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            setTouched((t) => ({ ...t, fname: true }));
            setFieldErrors((prev) => ({
              ...prev,
              fname: validateName(e.target.value, 'First name'),
            }));
          }}
          error={fieldErrors.fname}
        />
        <Input
          id="lname"
          label="Last name"
          placeholder="Enter Last name"
          value={lname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLname(e.target.value);
            if (touched.lname) {
              setFieldErrors((prev) => ({
                ...prev,
                lname: validateName(e.target.value, 'Last name'),
              }));
            }
          }}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            setTouched((t) => ({ ...t, lname: true }));
            setFieldErrors((prev) => ({
              ...prev,
              lname: validateName(e.target.value, 'Last name'),
            }));
          }}
          error={fieldErrors.lname}
        />
        <Input
          id="companyDisplay"
          label="Company name"
          value={company?.company_name || ''}
          disabled
          inputClassName="form-input--readonly"
        />
        <Button
          type="button"
          className="btn--block btn--verify"
          onClick={handleVerifyEmail}
          loading={loading}
          disabled={!isFormComplete}
        >
          Verify email
        </Button>
      </form>
    </Layout>
  );
}

