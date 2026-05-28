import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAppSelector } from '../redux/hooks';

export default function ProtectedRoute({
  children,
  requireCompany,
  requireUserDetails,
  requireOtp,
  requireEmailVerified,
  requireOtpVerified,
  requireProfile,
  requireInterests,
  requirePillars,
}) {
  const state = useAppSelector((s) => s.registration);

  if (requireCompany && !state.company) {
    return <Navigate to={ROUTES.COMPANY_VERIFY} replace />;
  }
  if (requireUserDetails && !state.userDetails?.email) {
    return <Navigate to={ROUTES.USER_DETAILS} replace />;
  }
  if (requireOtp && !state.otpToken) {
    return <Navigate to={ROUTES.USER_DETAILS} replace />;
  }
  if (requireEmailVerified && !state.emailVerified && !state.otpToken) {
    return <Navigate to={ROUTES.USER_DETAILS} replace />;
  }
  if (requireOtpVerified && !state.otpVerified) {
    return <Navigate to={ROUTES.OTP} replace />;
  }
  if (requireProfile && !state.profile?.password) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }
  if (requireInterests && (state.selectedInterests || []).length === 0) {
    return <Navigate to={ROUTES.INTERESTS} replace />;
  }
  if (requirePillars && (state.selectedPillars || []).length !== 3) {
    return <Navigate to={ROUTES.PILLARS} replace />;
  }

  return children;
}

