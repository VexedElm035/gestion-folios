import { useLocation } from 'react-router-dom'
import { IoMdPerson } from "react-icons/io";
import { IoMdStopwatch } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import Options from '../options/Options';
import RunnerButton from './elements/RunnerButton';
import SearchBar from './elements/SearchBar';
import './navbar.css';


const navbarItems = [
    { nombre: 'Participantes', enlace: '/', icon: IoMdPerson },
    { nombre: 'Cronometraje', enlace: '/timing', icon: IoMdStopwatch },
    { nombre: 'Configuraciones', enlace: '/settings',  icon: IoMdSettings },
];

const Navbar = () => {
  const location = useLocation();
 
  return (
    <div className='navbar'>
      <section className='navigation-section'>
        <div className='navbar-items'>
          {navbarItems.map((item, index) => (
            <div key={index} 
            className={`navbar-item ${location.pathname === item.enlace ? 'active' : ''}`}>
              <a href={item.enlace}>
                <item.icon className='navbar-item-icon'/>
                <span>
                  {item.nombre}
                </span> 
              </a>
            </div>
          ))}
        </div>
      </section>
      <div className='secondary-section'>


        <section className='runner-section'>
          <RunnerButton />
        </section>
        
        <section className='options-section'>
            <SearchBar />
            <Options />
        </section>

      </div>
    </div>
  )
}

export default Navbar