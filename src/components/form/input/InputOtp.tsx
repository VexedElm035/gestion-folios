import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import './input.css'

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  className?: string;
};

const InputOtp = ({ id, label, value, onChange, length = 6, autoFocus = false, className }: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, '').split('').slice(0, length);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digitValue: string) => {
    // Solo permitir dígitos
    const sanitized = digitValue.replace(/\D/g, '');
    if (sanitized.length === 0) return;

    const newDigits = [...digits];
    newDigits[index] = sanitized[0];
    const newValue = newDigits.join('').replace(/\s/g, '');
    onChange(newValue);

    // Auto-focus al siguiente input
    if (index < length - 1 && sanitized.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Retroceder al input anterior con Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      
      if (newDigits[index] && newDigits[index].trim()) {
        // Borrar el dígito actual
        newDigits[index] = '';
        onChange(newDigits.join('').replace(/\s/g, ''));
      } else if (index > 0) {
        // Si está vacío, ir al anterior y borrarlo
        newDigits[index - 1] = '';
        onChange(newDigits.join('').replace(/\s/g, ''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus al último dígito pegado o al último input
    const lastIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className='input-otp-wrapper'>
      <label htmlFor={`${id}-0`} className='input-otp-label'>{label}</label>
      <div className='input-otp-container'>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            id={`${id}-${index}`}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d{1}"
            maxLength={1}
            value={digits[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            className={['input-otp-digit', className].filter(Boolean).join(' ')}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  );
};

export default InputOtp;