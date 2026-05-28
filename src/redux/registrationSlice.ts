import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Company = Record<string, any> | null;

type UserDetails = {
  email: string;
  fname: string;
  lname: string;
};

type Profile = {
  password: string;
  confirmPassword: string;
  birthday: string;
  phone: string;
  workAnniversary: string;
  acceptedTerms: boolean;
};

export type RegistrationState = {
  company: Company;
  userDetails: UserDetails;
  otpToken: string;
  emailVerified: boolean;
  otpVerified: boolean;
  profile: Profile;
  selectedInterests: number[];
  selectedPillars: number[];
  registeredUser: any;
  authToken: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: RegistrationState = {
  company: null,
  userDetails: {
    email: '',
    fname: '',
    lname: '',
  },
  otpToken: '',
  emailVerified: false,
  otpVerified: false,
  profile: {
    password: '',
    confirmPassword: '',
    birthday: '',
    phone: '',
    workAnniversary: '',
    acceptedTerms: false,
  },
  selectedInterests: [],
  selectedPillars: [],
  registeredUser: null,
  authToken: null,
  loading: false,
  error: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setCompany(state, action: PayloadAction<any>) {
      state.company = action.payload;
      state.error = null;
    },
    setUserDetails(state, action: PayloadAction<Partial<UserDetails>>) {
      state.userDetails = { ...state.userDetails, ...action.payload };
      state.error = null;
    },
    setOtpToken(state, action: PayloadAction<string>) {
      state.otpToken = action.payload;
      state.error = null;
    },
    setEmailVerified(state, action: PayloadAction<boolean>) {
      state.emailVerified = action.payload;
      state.error = null;
    },
    setOtpVerified(state, action: PayloadAction<boolean>) {
      state.otpVerified = action.payload;
      state.error = null;
    },
    setProfile(state, action: PayloadAction<Partial<Profile>>) {
      state.profile = { ...state.profile, ...action.payload };
      state.error = null;
    },
    setSelectedInterests(state, action: PayloadAction<number[]>) {
      state.selectedInterests = action.payload;
      state.error = null;
    },
    toggleInterest(state, action: PayloadAction<number>) {
      const id = action.payload;
      const exists = state.selectedInterests.includes(id);
      state.selectedInterests = exists
        ? state.selectedInterests.filter((item) => item !== id)
        : [...state.selectedInterests, id];
    },
    setSelectedPillars(state, action: PayloadAction<number[]>) {
      state.selectedPillars = action.payload;
      state.error = null;
    },
    togglePillar(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.selectedPillars.indexOf(id);
      if (index >= 0) {
        state.selectedPillars = state.selectedPillars.filter((item) => item !== id);
      } else if (state.selectedPillars.length < 3) {
        state.selectedPillars = [...state.selectedPillars, id];
      }
    },
    setRegisteredUser(state, action: PayloadAction<{ user: any; token: string | null }>) {
      state.registeredUser = action.payload.user;
      state.authToken = action.payload.token;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    resetRegistration() {
      return initialState;
    },
  },
});

export const {
  setCompany,
  setUserDetails,
  setOtpToken,
  setEmailVerified,
  setOtpVerified,
  setProfile,
  setSelectedInterests,
  toggleInterest,
  setSelectedPillars,
  togglePillar,
  setRegisteredUser,
  setLoading,
  setError,
  clearError,
  resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;

