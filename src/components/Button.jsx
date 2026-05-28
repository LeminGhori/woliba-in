export default function Button({
  children,
  loading = false,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

