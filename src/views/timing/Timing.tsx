import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Form from '../../components/form/Form';
import './timing.css';

gsap.registerPlugin();

const Timing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const expandedDeltaRef = useRef(0);
  const expandedHeightRef = useRef(0);
  const expandedXRef = useRef(0);

  const COLLAPSED_HEIGHT = 40;
  const COLLAPSED_WIDTH = 150;
  const EXPANDED_WIDTH = 250;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 480px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    const handleChange = (e: MediaQueryListEvent) => setIsMobileMode(e.matches);

    const mqAny = mq as unknown as {
      addEventListener?: (type: string, listener: (e: MediaQueryListEvent) => void) => void;
      removeEventListener?: (type: string, listener: (e: MediaQueryListEvent) => void) => void;
      addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    };

    if (typeof mqAny.addEventListener === 'function') {
      mqAny.addEventListener('change', handleChange);
      return () => mqAny.removeEventListener?.('change', handleChange);
    }

    // Fallback para navegadores viejos
    mqAny.addListener?.(handleChange);
    return () => mqAny.removeListener?.(handleChange);
  }, []);

  useGSAP(() => {
    const container = containerRef.current;
    const formContainer = formContainerRef.current;
    const text = textRef.current;

    if (!container || !formContainer || !text) return;

    if (isExpanded) {
      // Recalcula medidas por si cambió el viewport mientras está expandido.
      gsap.set(formContainer, { opacity: 1, display: 'flex' });
      gsap.set(container, { width: `${EXPANDED_WIDTH}px`, borderRadius: '20px' });
      gsap.set(container, { height: expandedHeightRef.current, y: 0 });
      const expandedHeight = container.offsetHeight;
      const delta = Math.max(0, expandedHeight - COLLAPSED_HEIGHT);
      expandedHeightRef.current = expandedHeight;
      expandedDeltaRef.current = delta;

      gsap.set(container, {
        height: `${expandedHeight}px`,
        width: `${EXPANDED_WIDTH}px`,
        borderRadius: '20px',
        x: expandedXRef.current,
        y: isMobileMode ? 0 : 0,
      });
    } else {
      gsap.set(container, {
        height: `${COLLAPSED_HEIGHT}px`,
        width: `${COLLAPSED_WIDTH}px`,
        borderRadius: '30px',
        x: 0,
        y: 0,
      });
      gsap.set(formContainer, { opacity: 0, display: 'none' });
    }
  }, [isExpanded, isMobileMode]);

  const toggleExpand = () => {
    const container = containerRef.current;
    const formContainer = formContainerRef.current;
    const text = textRef.current;

    if (!container || !formContainer || !text) return;

    if (!isExpanded) {
      // Medimos la altura expandida con el formulario visible y el ancho final,
      // para animar la altura sin usar 'auto'.
      const fromHeight = container.offsetHeight || COLLAPSED_HEIGHT;

      // Guardamos el centro actual (sin transforms) para poder expandir el width “centrado”.
      gsap.set(container, { x: 0 });
      const startRect = container.getBoundingClientRect();
      const startCenterX = startRect.left + startRect.width / 2;

      gsap.set(formContainer, { display: 'flex', opacity: 0 });
      gsap.set(container, { x: 0, width: `${EXPANDED_WIDTH}px`, height: 'auto', borderRadius: '20px' });
      const expandedHeight = container.offsetHeight;

      const expandedRect = container.getBoundingClientRect();
      const expandedCenterX = expandedRect.left + expandedRect.width / 2;
      const expandedX = startCenterX - expandedCenterX;

      const delta = Math.max(0, expandedHeight - COLLAPSED_HEIGHT);
      expandedDeltaRef.current = delta;
      expandedHeightRef.current = expandedHeight;
      expandedXRef.current = expandedX;

      gsap.set(container, {
        width: `${COLLAPSED_WIDTH}px`,
        height: `${fromHeight}px`,
        x: 0,
        y: 0,
        borderRadius: '30px',
      });
      gsap.set(formContainer, { display: 'none', opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => setIsExpanded(true)
      });
      tl.to(text, { opacity: 0, duration: 0.05 });
      tl.to(text, { flexDirection: 'column', duration: 0 });
      tl.to(formContainer, { opacity: 0, display: 'flex', duration: 0 });
      tl.to(container, { width: `${EXPANDED_WIDTH}px`, x: expandedX, duration: 0.2 });
      tl.to(container, {
        height: expandedHeight,
        y: isMobileMode ? 0 : 0,
        borderRadius: '20px',
        duration: 0.2,
      });
      tl.to(formContainer, { opacity: 1, duration: 0.2 });
      tl.to(text, { opacity: 1, duration: 0.1 }, '-=0.2');
    } else {
      const tl = gsap.timeline({
        onComplete: () => setIsExpanded(false)
      });
      tl.to(text, { opacity: 0, duration: 0.05 });
      tl.to(formContainer, { opacity: 0, duration: 0.2 });
      tl.to(container, { height: `${COLLAPSED_HEIGHT}px`, y: 0, borderRadius: '30px', duration: 0.2 });
      tl.to(container, { width: `${COLLAPSED_WIDTH}px`, x: 0, duration: 0.2 });
      
      tl.to(text, { flexDirection: 'row', duration: 0 });
      tl.to(formContainer, { display: 'none', duration: 0 });
      tl.to(text, { opacity: 1, duration: 0.1 }, '-=0.2');
    }
  };
  return (
    <div ref={containerRef} className='temp-container'>
      <div onClick={toggleExpand}>
        <div ref={textRef} className={`button-text ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
          <div>

          {isExpanded ? ' ▲' : ' ▼'}
          </div>
          
          <div>
          Agregar Corredor
          
          </div>
            
        </div>
      </div>
      <div ref={formContainerRef} className="form-temp-container">
      <Form />
      </div>
    </div>
  )
}

export default Timing