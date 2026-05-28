import type { ClipboardEvent, KeyboardEvent } from 'react';
import { useEffect, useRef } from 'react';

type OtpInputProps = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
};

export default function OtpInput({ value, onChange, disabled = false }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const updateValue = (nextDigits: string[]) => {
    onChange(nextDigits.join('').replace(/\s/g, '').slice(0, 6));
  };

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    const next = [...digits.map((d) => (d === ' ' ? '' : d))];
    next[index] = digit;
    updateValue(next);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const current = digits[index] === ' ' ? '' : digits[index];
      if (!current && index > 0) {
        const next = [...digits.map((d) => (d === ' ' ? '' : d))];
        next[index - 1] = '';
        updateValue(next);
        inputsRef.current[index - 1]?.focus();
        event.preventDefault();
      }
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="otp-wrapper" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className="otp-input"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit === ' ' ? '' : digit}
          disabled={disabled}
          aria-label={`OTP digit ${index + 1}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}

