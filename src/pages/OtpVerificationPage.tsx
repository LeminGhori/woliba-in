import type { FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/registrationApi';
import Layout from '../components/Layout';
import OtpInput from '../components/OtpInput';
import StepActions from '../components/StepActions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setOtpToken,
  setOtpVerified,
  setEmailVerified,
  setLoading,
  setError,
  clearError,
} from '../redux/registrationSlice';
import { validateOtp } from '../utils/validations';
import { OTP_RESEND_SECONDS, ROUTES } from '../utils/constants';

type LocationState = {
  autoResendOtp?: boolean;
};

export default function OtpVerificationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails, otpToken, loading, error } = useAppSelector((state) => state.registration);

  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(OTP_RESEND_SECONDS);
  const [resendSuccess, setResendSuccess] = useState(false);
  const autoResendStarted = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins} : ${secs}`;
  };

  const handleBack = () => {
    dispatch(setOtpToken(''));
    dispatch(setEmailVerified(false));
    dispatch(clearError());
    navigate(ROUTES.USER_DETAILS);
  };

  const sendOtpResend = useCallback(
    async (force = false) => {
      if (!userDetails.email) return;
      if (!force && secondsLeft > 0) return;

      dispatch(clearError());
      setFieldError('');
      setResendSuccess(false);
      dispatch(setLoading(true));
      try {
        const response: any = await resendOtp(userDetails.email);
        const token = response?.data?.token;
        if (token) dispatch(setOtpToken(token));
        setSecondsLeft(OTP_RESEND_SECONDS);
        setOtp('');
        setResendSuccess(true);
      } catch (err) {
        dispatch(setError((err as Error).message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, secondsLeft, userDetails.email]
  );

  const handleResend = () => {
    void sendOtpResend(false);
  };

  useEffect(() => {
    const state = (location.state as LocationState | null) || null;
    if (!state?.autoResendOtp || autoResendStarted.current) return;
    if (!userDetails.email) return;

    autoResendStarted.current = true;
    dispatch(setOtpVerified(false));
    void sendOtpResend(true);
  }, [location.state, userDetails.email, dispatch, sendOtpResend]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    const otpError = validateOtp(otp);
    if (otpError) {
      setFieldError(otpError);
      return;
    }
    setFieldError('');
    dispatch(setLoading(true));

    try {
      await verifyOtp(otp, otpToken);
      dispatch(setOtpVerified(true));
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setFieldError('Incorrect OTP');
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const displayError = fieldError || error;

  return (
    <Layout>
      <h2 className="card__heading">Input verification code</h2>
      <p className="card__subtitle">
        We&apos;ve sent a 6-digit OTP to your work email Please enter it below to
        continue.
      </p>
      {resendSuccess && (
        <p className="form-success form-success--center" role="status">
          A new OTP has been sent to your email.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />
        {displayError && (
          <p className="form-error form-error--center" role="alert">
            {fieldError === 'Incorrect OTP' ? 'Incorrect OTP' : displayError}
          </p>
        )}
        <div className="resend-text">
          {secondsLeft > 0 ? (
            <span>Resend OTP in {formatTime(secondsLeft)}</span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={loading}
            >
              Resend
            </button>
          )}
        </div>
        <StepActions
          onBack={handleBack}
          primaryLabel="Submit"
          primaryType="submit"
          loading={loading}
          primaryDisabled={otp.length !== 6}
        />
      </form>
    </Layout>
  );
}

