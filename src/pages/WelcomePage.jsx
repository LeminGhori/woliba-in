import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resetRegistration } from '../redux/registrationSlice';
import { ROUTES } from '../utils/constants';
import welcomeIcon from '../assets/icons/welcome-icon.png';

export default function WelcomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { registeredUser, userDetails } = useAppSelector((state) => state.registration);

  const userNameFromApi =
    registeredUser?.user_name ||
    registeredUser?.userName ||
    (typeof registeredUser?.user === 'string' ? registeredUser.user : '');

  const normalizedUserName =
    typeof userNameFromApi === 'string' ? userNameFromApi.split(/[\s._-]+/)[0] : '';

  const displayName = registeredUser?.fname || normalizedUserName || userDetails.fname || '';

  const handleStart = () => {
    dispatch(resetRegistration());
    navigate(ROUTES.COMPANY_VERIFY);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-page__content">
        <img src={welcomeIcon} alt="" className="welcome-page__icon" aria-hidden="true" />

        <h1 className="welcome-page__title">
          Welcome{displayName ? ` ${displayName}` : ''}!
        </h1>

        <p className="welcome-page__text">
          Welcome to Woliba! You&apos;ll find wellness challenges, fitness and recipe videos,
          and daily tips to support your health goals. Download our iOS or Android app and
          start your wellbeing journey today.
        </p>

        <Button onClick={handleStart} className="welcome-page__cta">
          Let&apos;s get Started
        </Button>
      </div>
    </div>
  );
}

