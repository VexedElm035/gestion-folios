import { useState } from 'react';
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { Dropdown, Input } from '../../';
import './runnerbutton.css';

const RunnerButton = () => {
  const [AddRunner, setAddRunner] = useState(false);
  return (
    <div className={`navbar-button running-container ${AddRunner ? 'expanded' : 'collapsed'}`}>
      {AddRunner && (
        <div className='runner-fields'>  
          <Input id="nombre" label="Nombre" type="text" />
          {/* <Input id="apellido" label="Apellido" type="text" /> */}
          <Dropdown id="distancia" label="Distancia" options={[{value: '5', label: '5 KM'}, {value: '10', label: '10 KM'}]}/>
        </div>
      )}
      <button onClick={() => setAddRunner(!AddRunner)} className={`running-button ${AddRunner ? 'add-postbutton' : 'add-prebutton'}`}>
        {!AddRunner && (
          <div className={`running-icons-container ${AddRunner ? 'fadeit' : 'prefade'}`}>
            <PiPersonSimpleRun className='running-icon'/>
            <GoPlus className='plus-icon'/>
          </div>
        )}
        <p className='running-text-button'>Agregar
          <span className={`${AddRunner ? 'fadeit' : 'prefade'}`}>
             {" Corredor"}
          </span>
        </p>
      </button>
    </div>
  )
}

export default RunnerButton