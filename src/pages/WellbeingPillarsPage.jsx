import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWellbeingPillars } from '../api/registrationApi';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import StepActions from '../components/StepActions';
import Skeleton from '../components/Skeleton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { togglePillar, setLoading, setError, clearError } from '../redux/registrationSlice';
import { ROUTES } from '../utils/constants';

const FALLBACK_PILLARS = [
  {
    id: 1,
    pillar_title: 'Physical Wellbeing',
    description: 'Energy, movement, sleep, and routine care',
  },
  {
    id: 2,
    pillar_title: 'Mental Wellbeing',
    description: 'Clarity, focus, and mindfulness',
  },
  {
    id: 3,
    pillar_title: 'Emotional Wellbeing',
    description: 'Resilience, self-awareness, and stress regulation',
  },
  {
    id: 4,
    pillar_title: 'Social Wellbeing',
    description: 'Connection, belonging, and contribution',
  },
  {
    id: 5,
    pillar_title: 'Intellectual Wellbeing',
    description: 'Growth, creativity, and learning',
  },
  {
    id: 6,
    pillar_title: 'Occupational Wellbeing',
    description: 'Purpose, fulfillment, and work-life balance',
  },
  {
    id: 7,
    pillar_title: 'Spiritual Wellbeing',
    description: 'Values, meaning, and inner alignment',
  },
  {
    id: 8,
    pillar_title: 'Environmental Wellbeing',
    description: 'Healthy, safe, and productive surroundings',
  },
  {
    id: 9,
    pillar_title: 'Purpose & Contribution',
    description: 'Giving back and living with meaning',
  },
  {
    id: 10,
    pillar_title: 'Longevity',
    description: 'A sustainable, healthy lifestyle for the long term',
  },
  {
    id: 11,
    pillar_title: 'Nutritional Wellbeing',
    description: 'Fuelling your body and brain with intention',
  },
  {
    id: 12,
    pillar_title: 'Financial Wellbeing',
    description: 'Security, budgeting, and long-term stability',
  },
];

export default function WellbeingPillarsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedPillars, loading, error } = useAppSelector((state) => state.registration);
  const [pillars, setPillars] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetchWellbeingPillars(1);
        if (mounted && response?.data?.length) {
          setPillars(response.data.filter((p) => p.is_active !== 0));
        } else if (mounted) {
          setPillars(FALLBACK_PILLARS);
        }
      } catch {
        if (mounted) setPillars(FALLBACK_PILLARS);
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const maxSelected = (selectedPillars || []).length >= 3;

  const handleDone = () => {
    if ((selectedPillars || []).length !== 3) {
      dispatch(setError('Please select exactly 3 well-being pillars.'));
      return;
    }
    dispatch(clearError());
    navigate(ROUTES.PROCESSING);
  };

  return (
    <Layout wide showLogo={false}>
      <h2 className="pillars-page__title">
        Select any 3 well-being pillars goal you want to achieve
      </h2>
      <ErrorAlert message={error} />
      <div
        className="pillars-grid"
        role="group"
        aria-label="Well-being pillars"
        aria-busy={loading}
      >
        {loading && pillars.length === 0 ? (
          <>
            {Array.from({ length: 9 }).map((_, idx) => (
              <div key={`pillar-skel-${idx}`} className="pillar-item" aria-hidden="true">
                <span className="pillar-item__checkbox" />
                <span className="pillar-item__body" style={{ width: '100%' }}>
                  <Skeleton style={{ height: 14, width: '70%', marginBottom: 8 }} />
                  <Skeleton style={{ height: 12, width: '95%' }} />
                </span>
              </div>
            ))}
          </>
        ) : (
          pillars.map((pillar) => {
            const selectionOrder = (selectedPillars || []).indexOf(pillar.id);
            const isSelected = selectionOrder >= 0;
            const isDisabled = !isSelected && maxSelected;

            return (
              <button
                key={pillar.id}
                type="button"
                className={`pillar-item ${isSelected ? 'pillar-item--selected' : ''} ${
                  isDisabled ? 'pillar-item--disabled' : ''
                }`}
                onClick={() => !isDisabled && dispatch(togglePillar(pillar.id))}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-label={
                  isSelected
                    ? `${pillar.pillar_title}, selected ${selectionOrder + 1} of 3`
                    : pillar.pillar_title
                }
              >
                <span className="pillar-item__checkbox" aria-hidden="true">
                  {isSelected && (
                    <span className="pillar-item__order">{selectionOrder + 1}</span>
                  )}
                </span>
                <span className="pillar-item__body">
                  <span className="pillar-item__title">{pillar.pillar_title}</span>
                  <span className="pillar-item__desc">{pillar.description}</span>
                </span>
              </button>
            );
          })
        )}
      </div>
      <StepActions
        backTo={ROUTES.INTERESTS}
        onPrimary={handleDone}
        primaryLabel="Done"
        loading={loading}
        primaryDisabled={(selectedPillars || []).length !== 3}
        showBackIcon={false}
      />
    </Layout>
  );
}

