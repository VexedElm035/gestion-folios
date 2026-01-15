import './dropdown.css';

const Dropdown = ({id, label, options}: {id: string, label: string, options: {value: string, label: string}[]}) => {
  return (
    <div className='dropdown-container'>
        <label htmlFor={id} className="dropdown-label">{label}</label>
        <select id={id} className="dropdown-element">
            <option value="">--</option>
            {options && options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
  )
}

export default Dropdown