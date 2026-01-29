
const WelcomeMessage = ({ goNext } : { goNext: () => void }) => {
  return (
    <div className='signup-steps-container welcomeMessage-container'>
      <h1 className="signup-header-text">Hola!</h1>
      <h2 className="signup-header-steps-text">¡Bienvenido al proceso de registro de la 2da. Carrera a la Frontera!</h2>
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