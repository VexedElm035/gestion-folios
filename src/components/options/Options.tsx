import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLocation } from 'react-router-dom'
import { IoIosMore } from "react-icons/io";
import ThemeSwitch from '../navbar/elements/ThemeSwitch';
import TableOptions from '../navbar/elements/TableOptions';
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
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');
  const location = useLocation();
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
      gsap.set(optionsMenu, { 
        display: 'none', 
        autoAlpha: 0,
        scale: 0.55,
        x: -10,
        y: -8,
        rotate: -7,
        skewX: 10,
        transformOrigin: 'top right'
      });
      gsap.set(button, { backgroundColor: 'var(--primary-color)', color: 'var(--regular-text-color)' });
    }
  }, [isExpanded]);

  const isAnimating = useRef(false);

  const openMenu = () => {
    const optionsMenu = optionsMenuRef.current;
    const button = buttonRef.current;
    if (!optionsMenu || !button) return;

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsExpanded(true);
      }
    });

    tl.to(button, { backgroundColor: 'var(--secondary-text-color)', color: 'var(--primary-color)', duration: 0.3 });
    tl.set(optionsMenu, { display: 'flex' }, 0);
    tl.to(
      optionsMenu,
      {
        autoAlpha: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        skewX: 0,
        duration: 0.2,
        ease: 'power3.out',
      },
      '-=0.2'
    );
  };

  const closeMenu = () => {
    const optionsMenu = optionsMenuRef.current;
    const button = buttonRef.current;
    if (!optionsMenu || !button) return;

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsExpanded(false);
      }
    });

    tl.to(optionsMenu, { autoAlpha: 0, duration: 0.1, ease: 'power2.out' });
    tl.set(optionsMenu, { display: 'none' });
    tl.to(button, { backgroundColor: 'var(--primary-color)', color: 'var(--regular-text-color)', duration: 0.3 }, '-=0.2');
  };

  const handleToggle = () => {
    if (isAnimating.current) return;

    const optionsMenu = optionsMenuRef.current;
    const button = buttonRef.current;
    if (!optionsMenu || !button) return;

    if (!isExpanded) openMenu();
    else closeMenu();
  };

  useEffect(() => {
    if (!isExpanded) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!isExpanded || isAnimating.current) return;
      const target = e.target as Node | null;
      if (!target) return;

      const menuEl = optionsMenuRef.current;
      const buttonEl = buttonRef.current;
      if (menuEl?.contains(target) || buttonEl?.contains(target)) return;

      closeMenu();
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [isExpanded]);
  
  
  return (
    <div>
      <button ref={buttonRef} onClick={handleToggle} className='navbar-button'><IoIosMore /></button>
        
          <div ref={optionsMenuRef} className='options-menu'>
            <div className='options-menu-theme'>
              <p>Tema:</p>
              <ThemeSwitch />
            </div>

            {isAdminSubdomain && location.pathname === '/' && <TableOptions />}
          </div>
        
    </div>
  )
}

export default Options