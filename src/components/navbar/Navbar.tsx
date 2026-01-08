import { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import Options from '../options/Options';
import './navbar.css';

const navbarItems = [
    { nombre: 'Home', enlace: '#' },
    { nombre: 'Fotos', enlace: '#' },
    { nombre: 'Facebook', enlace: '#' },
    { nombre: 'Configuraciones', enlace: '#' },
];

interface NavbarProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [optionsMenu, setOptionsMenu] = useState(false);
  return (
    <div className='navbar'>
        <section>
            <div className='navbar-items'>
                {navbarItems.map((item, index) => (
                    <div key={index} className='navbar-item'>
                        <a href={item.enlace}>{item.nombre}</a>
                    </div>
                ))}
            </div>
        </section>
        <section>
            <button className='navbar-button'>
                <PiPersonSimpleRun className='running-icon'/>
                <GoPlus className='plus-icon'/>
            </button>
        </section>
        <section>
            <button className='navbar-button'><IoIosSearch /></button>
            
            <button className='navbar-button' onClick={toggleTheme}>
                {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </button>
            
            <button onClick={()=>setOptionsMenu(!optionsMenu)} className='navbar-button'><IoIosMore /></button>
            {optionsMenu && (
                  <Options />
            )}
        </section>

    </div>
  )
}

export default Navbar