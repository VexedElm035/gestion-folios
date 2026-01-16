import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { IoIosMore } from "react-icons/io";
import './options.css';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'optionsMenuExpanded';

const readStoredExpanded = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) === true : false;
  } catch {
    return false;
  }
};

const Options = () => {
  const optionsMenuRef = useRef<HTMLDivElement>(null);
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
    const optionsMenu = optionsMenuRef.current;
    const button = buttonRef.current;
    if (!optionsMenu || !button) return;

    if (isExpanded) {
      gsap.set(optionsMenu, { display: 'flex', opacity: 1 });
      gsap.set(button, { backgroundColor: 'var(--secondary-text-color)', color: 'var(--primary-color)' });
    }
    else {
      gsap.set(optionsMenu, { display: 'none', opacity: 0 });
      gsap.set(button, { backgroundColor: 'var(--primary-color)', color: 'var(--regular-text-color)' });
    }
  }, [isExpanded]);

  const isAnimating = useRef(false);

  const handleToggle = () => {
    if (isAnimating.current) return;

    const optionsMenu = optionsMenuRef.current;
    const button = buttonRef.current;
    if (!optionsMenu || !button) return;

    isAnimating.current = true;

    if (!isExpanded) {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(true);
        }
      });

      tl.to(button, { backgroundColor: 'var(--secondary-text-color)', color: 'var(--primary-color)', duration: 0.3 });
      tl.to(optionsMenu, { display: 'flex', opacity: 1, duration: 0.3 }, '-=0.2');
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(false);
        }
      });

      tl.to(optionsMenu, { opacity: 0, duration: 0.3 });
      tl.set(optionsMenu, { display: 'none' });
      tl.to(button, { backgroundColor: 'var(--primary-color)', color: 'var(--regular-text-color)', duration: 0.3 }, '-=0.2');
    }
  };
  
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <button ref={buttonRef} onClick={handleToggle} className='navbar-button'><IoIosMore /></button>
        
          <div ref={optionsMenuRef} className='options-menu'>        
            <button className='navbar-button' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}  
            </button>
            <a href='#'>Perfil</a>
            <a href='#'>Configuraciones</a>
            <a href='#'>Cerrar Sesion</a>
          </div>
        
    </div>
  )
}

export default Options