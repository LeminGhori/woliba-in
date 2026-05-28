import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWellnessInterests } from '../api/registrationApi';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import StepActions from '../components/StepActions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  toggleInterest,
  setLoading,
  setError,
  clearError,
} from '../redux/registrationSlice';
import { normalizeInterests } from '../utils/apiHelpers';
import { getInterestIconUrl } from '../utils/interestIcons';
import { ROUTES } from '../utils/constants';

type Interest = {
  id: number;
  name: string;
  interest_type?: string;
};

const FALLBACK_INTERESTS: Interest[] = [
  { id: 1, name: 'Running', interest_type: 'Individual Sports' },
  { id: 2, name: 'Yoga', interest_type: 'Individual Sports' },
  { id: 3, name: 'Basketball', interest_type: 'Ball Sports' },
  { id: 4, name: 'Swimming', interest_type: 'Water Sports' },
  { id: 5, name: 'Cycling', interest_type: 'Wheel Sports' },
  { id: 6, name: 'Weight Training', interest_type: 'Resistance Training' },
];

export default function InterestSelectionPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedInterests, loading, error } = useAppSelector((state) => state.registration);

  const [interests, setInterests] = useState<Interest[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const response: any = await fetchWellnessInterests();
        const list = normalizeInterests(response?.data) as Interest[];
        if (mounted && list.length) {
          setInterests(list);
        } else if (mounted) {
          setInterests(FALLBACK_INTERESTS);
        }
      } catch {
        if (mounted) setInterests(FALLBACK_INTERESTS);
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const grouped = useMemo(() => {
    return interests.reduce<Record<string, Interest[]>>((acc, item) => {
      const type = item.interest_type || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  }, [interests]);

  const toggleCategory = (type: string) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleNext = () => {
    if ((selectedInterests as number[]).length === 0) {
      dispatch(setError('Select at least one wellness interest to continue.'));
      return;
    }
    dispatch(clearError());
    navigate(ROUTES.PILLARS);
  };

  return (
    <Layout wide>
      <p className="card__subtitle card__subtitle--flush">
        Select all wellness interests that apply — at least one is required.
      </p>
      <ErrorAlert message={error} />
      <div className="interest-list">
        {Object.entries(grouped).map(([type, items]) => (
          <div className="interest-section" key={type}>
            <button
              type="button"
              className={`interest-section__title ${
                expanded[type] ? 'interest-section__title--open' : ''
              }`}
              onClick={() => toggleCategory(type)}
              aria-expanded={Boolean(expanded[type])}
            >
              <span>{type}</span>
              <span className="interest-section__chevron" aria-hidden="true">
                {expanded[type] ? '▾' : '▸'}
              </span>
            </button>
            {expanded[type] && (
              <div className="interest-grid">
                {items.map((item) => {
                  const selected = (selectedInterests as number[]).includes(item.id);
                  const icon = getInterestIconUrl(item as any) as string | null;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`interest-chip ${
                        selected ? 'interest-chip--selected' : ''
                      }`}
                      onClick={() => dispatch(toggleInterest(item.id))}
                      aria-pressed={selected}
                    >
                      {icon && (
                        <img
                          src={icon}
                          alt=""
                          className="interest-chip__icon"
                          loading="lazy"
                        />
                      )}
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <StepActions
        backTo={ROUTES.PROFILE}
        onPrimary={handleNext}
        primaryLabel="Next"
        loading={loading}
        primaryDisabled={(selectedInterests as number[]).length === 0}
      />
    </Layout>
  );
}

