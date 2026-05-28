import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import registrationReducer from '../redux/registrationSlice';

export function makeStore(preloadedRegistrationState) {
  return configureStore({
    reducer: { registration: registrationReducer },
    preloadedState: preloadedRegistrationState
      ? { registration: preloadedRegistrationState }
      : undefined,
  });
}

export function renderWithProviders(
  ui,
  { route = '/', preloadedRegistrationState, store = makeStore(preloadedRegistrationState) } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}

