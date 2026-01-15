import { useState, useEffect } from 'react';
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { Dropdown, Input } from '../../';
import './runnerbutton.css';

const RunnerButton = () => {
  const [AddRunner, setAddRunner] = useState(() => {
    const saved = localStorage.getItem('addRunnerExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('addRunnerExpanded', JSON.stringify(AddRunner));
  }, [AddRunner]);
  return (
    <div className={`navbar-button running-container ${AddRunner ? 'expanded' : 'collapsed'}`}>
      <button onClick={() => setAddRunner(!AddRunner)} className={`running-button ${AddRunner ? 'add-postbutton' : 'add-prebutton'}`}>
        {!AddRunner && (
          <div className={`running-icons-container`}>
            <PiPersonSimpleRun className='running-icon'/>
            <GoPlus className='plus-icon'/>
          </div>
        )}
        {AddRunner ? (
          <IoIosArrowDown /> 
        ) : 
          <p className='running-text-button'>Agregar Corredor</p>
        }
      </button>
      {AddRunner && (
        <form action="" className='runner-fields'>
          <Input id="nombre" label="Nombre" type="text" />
          <Input id="apellido" label="Apellido" type="text" />
          <Dropdown id="sexo" label="Sexo" options={[{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}]}/>
          <Dropdown id="distancia" label="Distancia" options={[{value: '5', label: '5 KM'}, {value: '10', label: '10 KM'}]}/>
          <Input id="telefono" label="Telefono" type="tel" />
          <button className='running-button add-runner-button' type='submit'>Agregar</button>
        </form>
      )}
    </div>
  )
}

export default RunnerButton