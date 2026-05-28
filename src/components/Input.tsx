import type { InputHTMLAttributes } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label?: string;
  id: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

export default function Input({
  label,
  id,
  error,
  className = '',
  inputClassName = '',
  ...props
}: InputProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-input ${error ? 'form-input--error' : ''} ${className} ${inputClassName}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="form-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

