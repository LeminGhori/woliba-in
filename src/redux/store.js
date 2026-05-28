import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './registrationSlice';

const STORAGE_KEY = 'woliba_registration_v1';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getPreloadedRegistrationState() {
  if (typeof window === 'undefined') return undefined;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return undefined;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== 'object') return undefined;

  return {
    ...parsed,
    loading: false,
    error: null,
  };
}

function persistRegistrationState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // If storage is full or blocked, skip persistence.
  }
}

const preloadedState = {
  registration: getPreloadedRegistrationState(),
};

const store = configureStore({
  reducer: {
    registration: registrationReducer,
  },
  preloadedState,
});

// Persist on every change so refresh keeps your step progress.
store.subscribe(() => {
  const state = store.getState();
  persistRegistrationState(state.registration);
});

export default store;

