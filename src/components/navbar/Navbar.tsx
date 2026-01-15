import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { IoMdStopwatch } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import Options from '../options/Options';
import RunnerButton from './elements/RunnerButton';
import './navbar.css';


const navbarItems = [
    { nombre: 'Participantes', enlace: '/', icon: IoMdPerson },
    { nombre: 'Cronometraje', enlace: '/timing', icon: IoMdStopwatch },
    { nombre: 'Configuraciones', enlace: '/settings',  icon: IoMdSettings },
];

const Navbar = () => {
  const location = useLocation();
  const [optionsMenu, setOptionsMenu] = useState(false);
  return (
    <div className='navbar'>
      <section>
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

        <section>
          <RunnerButton />
        </section>
        
        <section>
            <button className='navbar-button'><IoIosSearch /></button>
            
            <button onClick={()=>setOptionsMenu(!optionsMenu)} className='navbar-button'><IoIosMore /></button>
            {optionsMenu && (
                  <Options />
            )}
        </section>

    </div>
  )
}

export default Navbar