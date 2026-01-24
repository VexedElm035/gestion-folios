import './welcomemessage.css';

const WelcomeMessage = ({ goNext } : { goNext: () => void }) => {
  return (
    <div className='welcomeMessage-container'>
      <h1>Hola!</h1>
      <h2>¡Bienvenido al proceso de registro de la 2da. Carrera a la Frontera!</h2>
      <p>mensaje</p>
      <p>mensaje</p>
      <p>aaaaaaaaaaaaaaaa</p>
      <button className='signup-navigation-button signup-navigation-button-next' onClick={goNext} aria-label="Siguiente">
          <p>Siguiente</p>
          {/* <IoIosArrowForward size={30} /> */}
        </button>
    </div>
  )
}

export default WelcomeMessage