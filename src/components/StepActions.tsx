import type { ButtonHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import arrowLeft from '../assets/icons/arrow-left-bold.svg';

type StepActionsProps = {
  backTo?: string;
  onBack?: () => void;
  onPrimary?: () => void;
  primaryLabel?: string;
  primaryType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  loading?: boolean;
  primaryDisabled?: boolean;
  showBack?: boolean;
  showBackIcon?: boolean;
};

export default function StepActions({
  backTo,
  onBack,
  onPrimary,
  primaryLabel = 'Next',
  primaryType = 'button',
  loading = false,
  primaryDisabled = false,
  showBack = true,
  showBackIcon = true,
}: StepActionsProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
  };

  return (
    <div className={`step-actions ${showBack ? '' : 'step-actions--single'}`}>
      {showBack && (
        <button type="button" className="btn btn--outline" onClick={handleBack}>
          {showBackIcon && (
            <img src={arrowLeft} alt="" className="btn__icon" aria-hidden="true" />
          )}
          Back
        </button>
      )}
      <Button
        type={primaryType}
        onClick={onPrimary}
        loading={loading}
        disabled={primaryDisabled}
        className="step-actions__primary"
      >
        {primaryLabel}
      </Button>
    </div>
  );
}

