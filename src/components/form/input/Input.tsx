import './input.css'

const Input = ({ id, label, type }: { id: string; label: string; type: string }) => {
  return (
    <div className='input-container'>
    <label htmlFor={id} className='input-label'>{label}:</label>
    <input id={id} className="input-element" type={type} />
    </div>
  )
}

export default Input