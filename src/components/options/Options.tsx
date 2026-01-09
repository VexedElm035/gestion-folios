import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import './options.css';

const Options = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className='options-menu'>
      <button className='navbar-button' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                      {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}  
                  </button>
          <a href='#'>Perfil</a>
          <a href='#'>Configuraciones</a>
          <a href='#'>Cerrar Sesion</a>
    </div>
  )
}

export default Options