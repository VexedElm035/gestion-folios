import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { Dropdown, Input } from '../../';
import './runnerbutton.css';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'addRunnerExpanded';
const COLLAPSED_WIDTH = 'calc(var(--regular-text) + 180px)';
const COLLAPSED_HEIGHT = 'calc(var(--regular-text) + 15px)';

const readStoredExpanded = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) === true : false;
  } catch {
    return false;
  }
};

const RunnerButton = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const collapsedIconsRef = useRef<HTMLDivElement>(null);
  const expandedIconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => readStoredExpanded());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [isExpanded]);

  useGSAP(() => {
    const text = textRef.current;
    const collapsedIcons = collapsedIconsRef.current;
    const expandedIcon = expandedIconRef.current;
    const content = contentRef.current;
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!text || !collapsedIcons || !expandedIcon || !content || !container || !button) return;

    if (isExpanded) {
      gsap.set(text, { opacity: 0, display: 'none' });
      gsap.set(collapsedIcons, { opacity: 0, display: 'none' });
      gsap.set(expandedIcon, { display: 'flex', opacity: 1 });
      gsap.set(content, { display: 'flex', opacity: 1 });
      gsap.set(container, { width: 'auto', height: 'auto' });
      gsap.set(button, { height: 'auto' });
    } else {
      gsap.set(expandedIcon, { opacity: 0, display: 'none' });
      gsap.set(content, { opacity: 0, display: 'none' });
      gsap.set(container, { width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT });
      gsap.set(text, { display: 'flex', opacity: 1 });
      gsap.set(collapsedIcons, { display: 'block', opacity: 1 });
      gsap.set(button, { height: COLLAPSED_HEIGHT });
    }
  }, [isExpanded]);

  const isAnimating = useRef(false);

  const handleToggle = () => {
    if (isAnimating.current) return;

    const text = textRef.current;
    const collapsedIcons = collapsedIconsRef.current;
    const expandedIcon = expandedIconRef.current;
    const content = contentRef.current;
    const container = containerRef.current;
    const button = buttonRef.current;
    
    if (!text || !collapsedIcons || !expandedIcon || !content || !container || !button) return;
    isAnimating.current = true;
    
    if (!isExpanded) {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(true);
        }
      });
      tl.to([text, collapsedIcons], { opacity: 0, duration: 0.2 })
        .set([text, collapsedIcons], { display: 'none' })
        .set(expandedIcon, { display: 'flex', opacity: 0 })
        .set(button, { height: 'auto'})
        .set(content, { display: 'flex', opacity: 0 })
        .to(container, { width: 'auto', height: 'auto', duration: 0.3 })
        .to(expandedIcon, { opacity: 1, duration: 0.2 }, "-=0.05")
        .to(content, { opacity: 1, duration: 0.2 }, "-=0.3");
    }
    else {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(false);
        }
      });
      tl.to([content, expandedIcon], { opacity: 0, duration: 0.2 })
        .to(container, { width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT, duration: 0.12 }, "-=0.05")
        .set(content, { display: 'none' })
        .set(expandedIcon, { display: 'none' })
        .set(button, { height: COLLAPSED_HEIGHT })
        .set([text, collapsedIcons], { display: 'flex', opacity: 0 })
        .set(collapsedIcons, { display: 'block' })
        .to([text, collapsedIcons], { opacity: 1, duration: 0.2 });
    }
  };

  return (
    <div className='runner-wrapper'>
      <div className='runner-container-center'>
      <button
      ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`running-button ${isExpanded ? 'is-expanded' : ''}`}
        aria-expanded={isExpanded}
        aria-controls="add-runner-panel"
      >
        <div className='running-icons-container'>
          <div ref={collapsedIconsRef} className='running-icons running-icons-collapsed'>
            <PiPersonSimpleRun className='running-icon' />
            <GoPlus className='plus-icon' />
          </div>
          <div ref={expandedIconRef} className='running-icons running-icons-expanded'>
            <IoIosArrowDown className='arrow-icon' />
          </div>
        </div>
        <div ref={textRef} className="running-label">
          <span className='running-text-button'>Agregar Corredor</span>
        </div>
      </button>

    <div ref={containerRef} className={`running-container`}>
      <div ref={contentRef} id="add-runner-panel" className="window-content">

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