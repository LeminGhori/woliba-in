import { describe, expect, it } from 'vitest';
import reducer, {
  toggleInterest,
  togglePillar,
  setCompany,
  resetRegistration,
} from './registrationSlice';

describe('registrationSlice', () => {
  it('toggleInterest adds/removes', () => {
    const s1 = reducer(undefined, toggleInterest(1));
    expect(s1.selectedInterests).toEqual([1]);

    const s2 = reducer(s1, toggleInterest(1));
    expect(s2.selectedInterests).toEqual([]);
  });

  it('togglePillar caps at 3 selections', () => {
    const s1 = reducer(undefined, togglePillar(1));
    const s2 = reducer(s1, togglePillar(2));
    const s3 = reducer(s2, togglePillar(3));
    const s4 = reducer(s3, togglePillar(4));

    expect(s3.selectedPillars).toEqual([1, 2, 3]);
    expect(s4.selectedPillars).toEqual([1, 2, 3]); // ignored when at max
  });

  it('setCompany clears error', () => {
    const withError = { ...reducer(undefined, { type: 'x' }), error: 'boom' };
    const next = reducer(withError, setCompany({ id: 1 }));
    expect(next.company).toEqual({ id: 1 });
    expect(next.error).toBeNull();
  });

  it('resetRegistration returns initial state', () => {
    const mutated = reducer(undefined, setCompany({ id: 1 }));
    const reset = reducer(mutated, resetRegistration());
    expect(reset.company).toBeNull();
    expect(reset.selectedInterests).toEqual([]);
  });
});

