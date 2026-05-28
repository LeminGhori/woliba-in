import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    setCompany(state, action) {
      state.company = action.payload;
      state.error = null;
    },
    setUserDetails(state, action) {
      state.userDetails = { ...state.userDetails, ...action.payload };
      state.error = null;
    },
    setOtpToken(state, action) {
      state.otpToken = action.payload;
      state.error = null;
    },
    setEmailVerified(state, action) {
      state.emailVerified = action.payload;
      state.error = null;
    },
    setOtpVerified(state, action) {
      state.otpVerified = action.payload;
      state.error = null;
    },
    setProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
      state.error = null;
    },
    setSelectedInterests(state, action) {
      state.selectedInterests = action.payload;
      state.error = null;
    },
    toggleInterest(state, action) {
      const id = action.payload;
      const exists = state.selectedInterests.includes(id);
      state.selectedInterests = exists
        ? state.selectedInterests.filter((item) => item !== id)
        : [...state.selectedInterests, id];
    },
    setSelectedPillars(state, action) {
      state.selectedPillars = action.payload;
      state.error = null;
    },
    togglePillar(state, action) {
      const id = action.payload;
      const index = state.selectedPillars.indexOf(id);
      if (index >= 0) {
        state.selectedPillars = state.selectedPillars.filter((item) => item !== id);
      } else if (state.selectedPillars.length < 3) {
        state.selectedPillars = [...state.selectedPillars, id];
      }
    },
    setRegisteredUser(state, action) {
      state.registeredUser = action.payload.user;
      state.authToken = action.payload.token;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
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

