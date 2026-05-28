function UsFlagIcon() {
  return (
    <svg
      className="language-selector__flag"
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="20" height="14" rx="1" fill="#B22234" />
      <path
        d="M0 1.08h20M0 2.8h20M0 4.52h20M0 6.24h20M0 7.96h20M0 9.68h20M0 11.4h20"
        stroke="#fff"
        strokeWidth="1.08"
      />
      <rect width="8.6" height="7.7" fill="#3C3B6E" />
      <circle cx="1.4" cy="1.3" r="0.35" fill="#fff" />
      <circle cx="2.8" cy="1.3" r="0.35" fill="#fff" />
      <circle cx="4.2" cy="1.3" r="0.35" fill="#fff" />
      <circle cx="5.6" cy="1.3" r="0.35" fill="#fff" />
      <circle cx="7" cy="1.3" r="0.35" fill="#fff" />
      <circle cx="2.1" cy="2.5" r="0.35" fill="#fff" />
      <circle cx="3.5" cy="2.5" r="0.35" fill="#fff" />
      <circle cx="4.9" cy="2.5" r="0.35" fill="#fff" />
      <circle cx="6.3" cy="2.5" r="0.35" fill="#fff" />
      <circle cx="1.4" cy="3.7" r="0.35" fill="#fff" />
      <circle cx="2.8" cy="3.7" r="0.35" fill="#fff" />
      <circle cx="4.2" cy="3.7" r="0.35" fill="#fff" />
      <circle cx="5.6" cy="3.7" r="0.35" fill="#fff" />
      <circle cx="7" cy="3.7" r="0.35" fill="#fff" />
      <circle cx="2.1" cy="4.9" r="0.35" fill="#fff" />
      <circle cx="3.5" cy="4.9" r="0.35" fill="#fff" />
      <circle cx="4.9" cy="4.9" r="0.35" fill="#fff" />
      <circle cx="6.3" cy="4.9" r="0.35" fill="#fff" />
      <circle cx="1.4" cy="6.1" r="0.35" fill="#fff" />
      <circle cx="2.8" cy="6.1" r="0.35" fill="#fff" />
      <circle cx="4.2" cy="6.1" r="0.35" fill="#fff" />
      <circle cx="5.6" cy="6.1" r="0.35" fill="#fff" />
      <circle cx="7" cy="6.1" r="0.35" fill="#fff" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="language-selector__chevron"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LanguageSelector() {
  return (
    <button
      type="button"
      className="language-selector"
      aria-label="Language: English"
    >
      <span className="language-selector__label">Language</span>
      <UsFlagIcon />
      <span className="language-selector__code">En</span>
      <ChevronDownIcon />
    </button>
  );
}

