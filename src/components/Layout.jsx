import backgroundImage from '../assets/Background.png';
import logoImage from '../assets/woliba Logo.png';
import LanguageSelector from './LanguageSelector';
import SiteFooter from './SiteFooter';

export default function Layout({
  children,
  wide = false,
  welcome = false,
  showLogo = true,
  pageTitle,
}) {
  return (
    <div
      className="page-shell"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <header className="page-shell__header" aria-label="Woliba header">
        <div className="page-shell__brand" aria-label="Woliba">
          <img src={logoImage} alt="Woliba" className="page-shell__logo" />
        </div>
        <LanguageSelector />
      </header>
      <div
        className={`page-shell__inner ${wide ? 'page-shell__inner--wide' : ''}`}
      >
        <div className={`card ${welcome ? 'card--welcome' : ''}`}>
          {showLogo && <img src={logoImage} alt="Woliba" className="card__logo" />}
          {pageTitle && <h1 className="card__page-title">{pageTitle}</h1>}
          {children}
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}

