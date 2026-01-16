import type { InputHTMLAttributes } from 'react';
import './input.css'

type Props = {
  id: string;
  label: string;
  type: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'>;

const Input = ({ id, label, type, className, placeholder, ...rest }: Props) => {
  return (
    <div className='input-container'>
    <label htmlFor={id} className='input-label'>{label}</label>
    <input
      id={id}
      className={['input-element', className].filter(Boolean).join(' ')}
      type={type}
      placeholder={placeholder ?? label}
      {...rest}
    />
    </div>
  )
}

export default Input