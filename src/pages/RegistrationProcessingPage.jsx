import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeRegistration } from '../api/registrationApi';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import Button from '../components/Button';
import loaderVideo from '../assets/Loader scrren GIF.mp4';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setRegisteredUser, setLoading, setError, clearError } from '../redux/registrationSlice';
import {
  buildUserRegistrationPayload,
  isEmailAlreadyRegisteredError,
  isSessionExpiredError,
  parseRegistrationAuthToken,
  parseRegistrationUser,
} from '../utils/apiHelpers';
import { ROUTES } from '../utils/constants';

export default function RegistrationProcessingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const state = useAppSelector((s) => s.registration);
  const { loading, error } = state;
  const hasStarted = useRef(false);

  const handleGoBack = () => {
    dispatch(clearError());

    if (isSessionExpiredError(error)) {
      navigate(ROUTES.OTP, { state: { autoResendOtp: true } });
      return;
    }

    if (isEmailAlreadyRegisteredError(error)) {
      navigate(ROUTES.USER_DETAILS);
      return;
    }

    navigate(ROUTES.PILLARS);
  };

  useEffect(() => {
    if (hasStarted.current) return undefined;
    hasStarted.current = true;

    const register = async () => {
      dispatch(clearError());
      dispatch(setLoading(true));
      try {
        const payload = buildUserRegistrationPayload(state);
        const response = await completeRegistration(payload);
        const fallbackUser = {
          fname: state.userDetails.fname,
          lname: state.userDetails.lname,
          email: state.userDetails.email,
        };
        const user = parseRegistrationUser(response, fallbackUser);
        const token = parseRegistrationAuthToken(response);

        dispatch(setRegisteredUser({ user, token }));
        navigate(ROUTES.WELCOME);
      } catch (err) {
        dispatch(setError(err?.message || 'Something went wrong. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    void register();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout showLogo={false}>
      <div className="processing-screen" aria-busy={loading}>
        <video
          src={loaderVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <h2>Getting your wellness journey ready...</h2>
        {loading && (
          <p className="card__subtitle" role="status" aria-live="polite">
            Please wait while we complete your registration.
          </p>
        )}
        <ErrorAlert message={error} />
        {error && (
          <Button onClick={handleGoBack} className="btn--block">
            Go Back
          </Button>
        )}
      </div>
    </Layout>
  );
}

