import './button.css'

const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
  return (
    <button className='button' onClick={onClick}>{children}</button>
  )
}

export default Button