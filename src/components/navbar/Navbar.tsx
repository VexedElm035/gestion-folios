import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import Options from '../options/Options';
import './navbar.css';
import { Dropdown, Input } from '../';

const navbarItems = [
    { nombre: 'Participantes', enlace: '/' },
    { nombre: 'Cronometraje', enlace: '/timing' },
    { nombre: 'Configuraciones', enlace: '/settings' },
];

const Navbar = () => {
  const [AddRunner, setAddRunner] = useState(false);
  const location = useLocation();
  const [optionsMenu, setOptionsMenu] = useState(false);
  return (
    <div className='navbar'>
        <section>
            <div className='navbar-items'>
                {navbarItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={`navbar-item ${location.pathname === item.enlace ? 'active' : ''}`}
                    >
                        <a href={item.enlace}>{item.nombre}</a>
                    </div>
                ))}
            </div>
        </section>
        <section>
          <div className={`navbar-button add-button running-section ${AddRunner ? 'expanded' : ''}`}>
            {AddRunner && (
              <div className='runner-inputs'>  
                <Input id="nombre" label="Nombre" type="text" />
                <Input id="apellido" label="Apellido" type="text" />
                <Dropdown id="distancia" label="Distancia" options={[{value: '5', label: '5 KM'}, {value: '10', label: '10 KM'}]}/>
              </div>
            )}
            <button onClick={() => setAddRunner(!AddRunner)} className={`navbar-button add-button running-button ${AddRunner ? 'add-prebutton' : ''}`}>
              {!AddRunner && (
                <div className='running-icons-container'>
                  <PiPersonSimpleRun className='running-icon'/>
                  <GoPlus className='plus-icon'/>
                </div>
              )}
              <span>{AddRunner ? 'Agregar' : 'Agregar Corredor'}</span>
            </button>
          </div>
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