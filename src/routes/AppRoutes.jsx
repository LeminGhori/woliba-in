import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import ProtectedRoute from './ProtectedRoute';
import CompanyVerifyPage from '../pages/CompanyVerifyPage';
import UserDetailsPage from '../pages/UserDetailsPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import InterestSelectionPage from '../pages/InterestSelectionPage';
import WellbeingPillarsPage from '../pages/WellbeingPillarsPage';
import RegistrationProcessingPage from '../pages/RegistrationProcessingPage';
import WelcomePage from '../pages/WelcomePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.COMPANY_VERIFY} element={<CompanyVerifyPage />} />
      <Route
        path={ROUTES.USER_DETAILS}
        element={
          <ProtectedRoute requireCompany>
            <UserDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.OTP}
        element={
          <ProtectedRoute requireCompany requireUserDetails requireOtp>
            <OtpVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute
            requireCompany
            requireUserDetails
            requireOtp
            requireOtpVerified
          >
            <CompleteProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.INTERESTS}
        element={
          <ProtectedRoute
            requireCompany
            requireUserDetails
            requireOtpVerified
            requireProfile
          >
            <InterestSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PILLARS}
        element={
          <ProtectedRoute
            requireCompany
            requireUserDetails
            requireOtpVerified
            requireProfile
            requireInterests
          >
            <WellbeingPillarsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROCESSING}
        element={
          <ProtectedRoute
            requireCompany
            requireUserDetails
            requireOtpVerified
            requireProfile
            requireInterests
            requirePillars
          >
            <RegistrationProcessingPage />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.WELCOME} element={<WelcomePage />} />
      <Route path="*" element={<Navigate to={ROUTES.COMPANY_VERIFY} replace />} />
    </Routes>
  );
}

