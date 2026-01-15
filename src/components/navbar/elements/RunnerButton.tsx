import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { Dropdown, Input } from '../../';
import './runnerbutton.css';

gsap.registerPlugin(useGSAP);

const RunnerButton = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [AddRunner, setAddRunner] = useState(() => {
    const saved = localStorage.getItem('addRunnerExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('addRunnerExpanded', JSON.stringify(AddRunner));
  }, [AddRunner]);

  useGSAP(() => {
    if (AddRunner) {
        const text = textRef.current;
        const content = contentRef.current;
        const container = containerRef.current;
        if (text && content && container) {
            gsap.set(text, { opacity: 0, display: 'none' });
            gsap.set(content, {
                display: 'flex',
                opacity: 1
            });
            gsap.set(container, {
              width: "auto",
              height: "auto",
            });
        }
    }
  }, [AddRunner]);

  const isAnimating = useRef(false);

  const handleToggle = () => {
    if (isAnimating.current) return;

    const text = textRef.current;
    const content = contentRef.current;
    const container = containerRef.current;
    
    if (!text || !content || !container) return;
    isAnimating.current = true;
    
    if (!AddRunner) {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setAddRunner(true);
        }
      });
      tl.to(text, { opacity: 0, display: 'none', duration: 0.3 })
        .to(content, { display: 'flex', opacity: 0}, '-=0.2')
        .to(container, { width: 'auto', height: 'auto', duration: 0.1 }, "-=0.2")
        .to(content, { display: 'flex', opacity: 1, duration: 0.2 }, "-=0.1");
    }
    else {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setAddRunner(false);
        }
      });
      tl.to(content, { opacity: 0, duration: 0.2})
        .to(container, { width: "calc(var(--regular-text) + 180px)", height: "calc(var(--regular-text) + 15px)", duration: 0.1 }, "-=0.1")
        .to(content, { display: 'none'})
        .to(text, { display: 'flex', opacity: 1, duration: 0.2 });
    }
  };

  return (
    <div className='runner-wrapper'>
      <div className='runner-container-center'>
      <button onClick={handleToggle} className={`add-button-default running-button ${AddRunner ? 'add-postbutton' : ''}`}>
          {AddRunner ? (
            <div className={`running-icons-container`}>
              <IoIosArrowDown /> 

            </div>
          ) : (
            <div className={`running-icons-container`}>
            <PiPersonSimpleRun className='running-icon'/>
            <GoPlus className='plus-icon'/>
            </div>
          )}
              <div ref={textRef}>
          
          <span className='running-text-button'>Agregar Corredor</span>
        </div>
      </button>

    <div ref={containerRef} className={`running-container`}>
      <div ref={contentRef} className="window-content" style={{display: 'none', opacity: 0}}>

        <form action="" className='runner-fields'>
          <Input id="nombre" label="Nombre" type="text" />
          <Input id="apellido" label="Apellido" type="text" />
          <Dropdown id="sexo" label="Sexo" options={[{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}]}/>
          <Dropdown id="distancia" label="Distancia" options={[{value: '5', label: '5 KM'}, {value: '10', label: '10 KM'}]}/>
          <Input id="telefono" label="Telefono" type="tel" />
          <button className='running-button add-runner-button' type='submit'>Agregar</button>
        </form>
      
      </div>
    </div>


      </div>
    </div>
  )
}

export default RunnerButton