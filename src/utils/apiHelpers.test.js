import { describe, expect, it } from 'vitest';
import { buildUserRegistrationPayload } from './apiHelpers';

describe('apiHelpers.buildUserRegistrationPayload', () => {
  it('throws when email is missing', () => {
    expect(() =>
      buildUserRegistrationPayload({
        userDetails: { email: '' },
        profile: { password: 'X', birthday: '01/01/2000', phone: '', acceptedTerms: true },
        otpToken: 'token',
        selectedInterests: [1],
        selectedPillars: [1, 2, 3],
      })
    ).toThrow(/email/i);
  });

  it('throws when otp token is missing', () => {
    expect(() =>
      buildUserRegistrationPayload({
        userDetails: { email: 'a@b.com', fname: 'A', lname: 'B' },
        profile: { password: 'X', birthday: '01/01/2000', phone: '', acceptedTerms: true },
        otpToken: '',
        selectedInterests: [1],
        selectedPillars: [1, 2, 3],
      })
    ).toThrow(/otp/i);
  });

  it('builds expected payload shape', () => {
    const payload = buildUserRegistrationPayload({
      userDetails: { email: 'a@b.com', fname: 'A', lname: 'B' },
      profile: { password: 'X', birthday: '01/31/2000', phone: ' 123-4567 ', acceptedTerms: true },
      otpToken: 'token',
      selectedInterests: [1, 2],
      selectedPillars: [3, 4, 5],
    });

    expect(payload).toMatchObject({
      fname: 'A',
      lname: 'B',
      email: 'a@b.com',
      password: 'X',
      token: 'token',
      areas_of_interest: [1, 2],
      wellbeing_pillars: [3, 4, 5],
      accepted_privacy_policy: true,
      birthday: '2000-01-31',
      phone_number: '123-4567',
    });
  });
});

