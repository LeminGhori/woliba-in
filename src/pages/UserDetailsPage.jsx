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

export default function UserDetailsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { company, userDetails, loading, error } = useAppSelector(
    (state) => state.registration
  );

  const [email, setEmail] = useState(userDetails.email || '');
  const [fname, setFname] = useState(userDetails.fname || '');
  const [lname, setLname] = useState(userDetails.lname || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const errors = {
      email: validateEmail(email),
      fname: validateName(fname, 'First name'),
      lname: validateName(lname, 'Last name'),
    };
    return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
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
      const response = await saveUserDetails({
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
      dispatch(setError(err?.message || 'Something went wrong. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Layout pageTitle="Registration">
      <ErrorAlert message={error} />
      <form
        aria-label="User details form"
        onSubmit={(e) => {
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
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched.email) {
              setFieldErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value),
              }));
            }
          }}
          onBlur={(e) => {
            setTouched((t) => ({ ...t, email: true }));
            setFieldErrors((prev) => ({
              ...prev,
              email: validateEmail(e.target.value),
            }));
          }}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <Input
          id="fname"
          label="First name"
          placeholder="Enter First name"
          value={fname}
          onChange={(e) => {
            setFname(e.target.value);
            if (touched.fname) {
              setFieldErrors((prev) => ({
                ...prev,
                fname: validateName(e.target.value, 'First name'),
              }));
            }
          }}
          onBlur={(e) => {
            setTouched((t) => ({ ...t, fname: true }));
            setFieldErrors((prev) => ({
              ...prev,
              fname: validateName(e.target.value, 'First name'),
            }));
          }}
          error={fieldErrors.fname}
          autoComplete="given-name"
        />
        <Input
          id="lname"
          label="Last name"
          placeholder="Enter Last name"
          value={lname}
          onChange={(e) => {
            setLname(e.target.value);
            if (touched.lname) {
              setFieldErrors((prev) => ({
                ...prev,
                lname: validateName(e.target.value, 'Last name'),
              }));
            }
          }}
          onBlur={(e) => {
            setTouched((t) => ({ ...t, lname: true }));
            setFieldErrors((prev) => ({
              ...prev,
              lname: validateName(e.target.value, 'Last name'),
            }));
          }}
          error={fieldErrors.lname}
          autoComplete="family-name"
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
          disabled={!isFormComplete || !company?.id}
        >
          Verify email
        </Button>
      </form>
    </Layout>
  );
}

