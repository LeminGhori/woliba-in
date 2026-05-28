import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWellnessInterests } from '../api/registrationApi';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import StepActions from '../components/StepActions';
import Skeleton from '../components/Skeleton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleInterest, setLoading, setError, clearError } from '../redux/registrationSlice';
import { normalizeInterests } from '../utils/apiHelpers';
import { getInterestIconUrl } from '../utils/interestIcons';
import { ROUTES } from '../utils/constants';

const FALLBACK_INTERESTS = [
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

  const [interests, setInterests] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const response = await fetchWellnessInterests();
        const list = normalizeInterests(response?.data);
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
    return interests.reduce((acc, item) => {
      const type = item.interest_type || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  }, [interests]);

  const toggleCategory = (type) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleNext = () => {
    if ((selectedInterests || []).length === 0) {
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
      <div className="interest-list" aria-busy={loading}>
        {loading && interests.length === 0 ? (
          <>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div className="interest-section" key={`cat-skel-${idx}`}>
                <div style={{ padding: '14px 4px' }}>
                  <Skeleton style={{ height: 16, width: '45%' }} />
                </div>
                <div className="interest-grid" aria-hidden="true">
                  {Array.from({ length: 8 }).map((__, i) => (
                    <div key={`chip-skel-${idx}-${i}`} style={{ width: 140 }}>
                      <Skeleton style={{ height: 34, borderRadius: 999 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          Object.entries(grouped).map(([type, items]) => (
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
                <div className="interest-grid" role="group" aria-label={`${type} interests`}>
                  {items.map((item) => {
                    const selected = (selectedInterests || []).includes(item.id);
                    const icon = getInterestIconUrl(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`interest-chip ${
                          selected ? 'interest-chip--selected' : ''
                        }`}
                        onClick={() => dispatch(toggleInterest(item.id))}
                        aria-pressed={selected}
                        aria-label={`${item.name}${selected ? ', selected' : ''}`}
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
          ))
        )}
      </div>
      <StepActions
        backTo={ROUTES.PROFILE}
        onPrimary={handleNext}
        primaryLabel="Next"
        loading={loading}
        primaryDisabled={(selectedInterests || []).length === 0}
      />
    </Layout>
  );
}

