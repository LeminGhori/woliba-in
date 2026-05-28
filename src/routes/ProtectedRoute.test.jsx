import { describe, expect, it } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { renderWithProviders } from '../test/renderWithProviders';

function AppUnderTest({ guardProps }) {
  return (
    <Routes>
      <Route path="/" element={<div>Company</div>} />
      <Route path="/user-details" element={<div>UserDetails</div>} />
      <Route path="/verify-otp" element={<div>Otp</div>} />
      <Route path="/complete-profile" element={<div>Profile</div>} />
      <Route path="/interests" element={<div>Interests</div>} />
      <Route path="/wellbeing-pillars" element={<div>Pillars</div>} />
      <Route
        path="/secret"
        element={
          <ProtectedRoute {...guardProps}>
            <div>Secret</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

describe('ProtectedRoute', () => {
  it('redirects to company verify when requireCompany and company missing', () => {
    const { queryByText } = renderWithProviders(<AppUnderTest guardProps={{ requireCompany: true }} />, {
      route: '/secret',
      preloadedRegistrationState: { company: null, userDetails: { email: '' }, selectedInterests: [], selectedPillars: [], profile: { password: '' } },
    });

    expect(queryByText('Company')).toBeInTheDocument();
    expect(queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders children when requirements are satisfied', () => {
    const { getByText } = renderWithProviders(
      <AppUnderTest
        guardProps={{
          requireCompany: true,
          requireUserDetails: true,
          requireOtpVerified: true,
          requireProfile: true,
          requireInterests: true,
          requirePillars: true,
        }}
      />,
      {
        route: '/secret',
        preloadedRegistrationState: {
          company: { id: 1 },
          userDetails: { email: 'a@b.com', fname: 'A', lname: 'B' },
          otpToken: 't',
          emailVerified: true,
          otpVerified: true,
          profile: { password: 'X', confirmPassword: 'X', birthday: '01/01/2000', phone: '123', workAnniversary: '', acceptedTerms: true },
          selectedInterests: [1],
          selectedPillars: [1, 2, 3],
          registeredUser: null,
          authToken: null,
          loading: false,
          error: null,
        },
      }
    );

    expect(getByText('Secret')).toBeInTheDocument();
  });
});

