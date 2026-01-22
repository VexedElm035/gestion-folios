import type { SelectHTMLAttributes } from 'react';
import './dropdown.css';

type Props = {
  id: string;
  label: string;
  options: {value: string, label: string}[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'>;

const Dropdown = ({id, label, options, onChange, ...rest}: Props) => {
  return (
    <div className='dropdown-container'>
        <label htmlFor={id} className="dropdown-label">{label}</label>
        <select id={id} className="dropdown-element" onChange={onChange} {...rest}>
            <option value="">--</option>
            {options && options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
  )
}

export default Dropdown