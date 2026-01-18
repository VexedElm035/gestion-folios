import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Form from '../../form/Form';
import './runnerbutton.css';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'addRunnerExpanded';

const readStoredExpanded = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    return parsed === true;
  } catch {
    return false;
  }
};

const RunnerButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const runnerIconsRef = useRef<HTMLDivElement>(null);
  const runnerCollapseRef = useRef<HTMLDivElement>(null);
  const expandedXRef = useRef(0);
  const collapsedXRef = useRef(0);
  const anchorCenterXRef = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => readStoredExpanded());
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [isExpanded]);

  useGSAP(() => {
    const container = containerRef.current;
    const formContainer = formContainerRef.current;
    const text = textRef.current;
    const runnerIcons = runnerIconsRef.current;
    const runnerCollapse = runnerCollapseRef.current;

    if (!container || !formContainer || !text || !runnerIcons || !runnerCollapse) return;

    const measureLayout = (expanded: boolean) => {
      container.classList.toggle('is-expanded', expanded);
      container.classList.toggle('is-collapsed', !expanded);
      container.classList.toggle('is-mobile', isMobileMode);

      gsap.set(container, { x: 0, y: 0, clearProps: 'width,height' });
      gsap.set(formContainer, { display: expanded ? 'flex' : 'none', opacity: expanded ? 1 : 0 });

      const rect = container.getBoundingClientRect();
      return { rect, centerX: rect.left + rect.width / 2 };
    };

    // Fijamos un “centro ancla” (el centro del layout colapsado) para que
    // tanto expandido como colapsado puedan mantenerse centrados aunque el
    // layout del navbar los empuje hacia un lado.
    if (anchorCenterXRef.current === null) {
      anchorCenterXRef.current = measureLayout(false).centerX;
    }

    const anchor = anchorCenterXRef.current;
    const collapsed = measureLayout(false);
    collapsedXRef.current = anchor - collapsed.centerX;
    const expanded = measureLayout(true);
    expandedXRef.current = anchor - expanded.centerX;

    // Aplica el estado actual sin animación.
    if (isExpanded) {
      container.classList.add('is-expanded');
      container.classList.remove('is-collapsed');
      gsap.set(container, { x: expandedXRef.current, y: 0, clearProps: 'width,height' });
      gsap.set(formContainer, { opacity: 1, display: 'flex' });
      gsap.set(runnerIcons, { display: 'none', opacity: 0 });
      gsap.set(runnerCollapse, { display: 'flex', opacity: 1 });
    } else {
      container.classList.add('is-collapsed');
      container.classList.remove('is-expanded');
      gsap.set(container, { x: collapsedXRef.current, y: 0, clearProps: 'width,height' });
      gsap.set(formContainer, { opacity: 0, display: 'none' });
      gsap.set(runnerIcons, { display: 'flex', opacity: 1 });
      gsap.set(runnerCollapse, { display: 'none', opacity: 0 });
    }
  }, [isExpanded, isMobileMode]);

  const handleToggle = () => {
    if (isAnimating.current) return;

    const container = containerRef.current;
    const formContainer = formContainerRef.current;
    const text = textRef.current;
    const runnerIcons = runnerIconsRef.current;
    const runnerCollapse = runnerCollapseRef.current;

    if (!container || !formContainer || !text || !runnerIcons || !runnerCollapse) return;

    isAnimating.current = true;

    if (!isExpanded) {
      // Estado inicial (colapsado)
      gsap.set(container, { x: collapsedXRef.current, y: 0, clearProps: 'width,height' });
      container.classList.add('is-collapsed');
      container.classList.remove('is-expanded');
      gsap.set(formContainer, { display: 'none', opacity: 0 });
      gsap.set(runnerIcons, { display: 'flex', opacity: 1 });
      gsap.set(runnerCollapse, { display: 'none', opacity: 0 });

      const start = container.getBoundingClientRect();

      // Aplica layout expandido (CSS) y mide el tamaño final (sin locks)
      container.classList.add('is-expanded');
      container.classList.remove('is-collapsed');
      gsap.set(formContainer, { display: 'flex', opacity: 0 });

      // Medimos el final con x=0 para evitar que el transform afecte el cálculo.
      gsap.set(container, { x: 0, clearProps: 'width,height' });
      const end = container.getBoundingClientRect();
      const endX = expandedXRef.current;

      // Volvemos al inicio para animar.
      gsap.set(container, { width: start.width, height: start.height, x: collapsedXRef.current });

      const tl = gsap.timeline({
        onComplete: () => {
          setIsExpanded(true);
          isAnimating.current = false;
          gsap.set(container, { clearProps: 'width,height', x: endX });
        }
      });

      tl.to(text, { opacity: 0, duration: 0.12 })
        .to(text, { flexDirection: 'column', duration: 0 })
        .to(runnerIcons, { opacity: 0, duration: 0.12 }, '<')
        .set(runnerIcons, { display: 'none' })
        .set(runnerCollapse, { display: 'flex', opacity: 0 })
        .to(container, { width: end.width, height: end.height, x: endX, duration: 0.25, ease: 'power3.out' })
        .to(formContainer, { opacity: 1, duration: 0.2 }, '-=0.12')
        .to(runnerCollapse, { opacity: 1, duration: 0.15 }, '-=0.18')
        .to(text, { opacity: 1, duration: 0.15 }, '-=0.18');
    } else {
      // Estado inicial (expandido)
      gsap.set(container, { x: expandedXRef.current, y: 0, clearProps: 'width,height' });
      container.classList.add('is-expanded');
      container.classList.remove('is-collapsed');
      gsap.set(formContainer, { display: 'flex', opacity: 1 });
      gsap.set(runnerIcons, { display: 'none', opacity: 0 });
      gsap.set(runnerCollapse, { display: 'flex', opacity: 1 });

      const start = container.getBoundingClientRect();

      // Aplica layout colapsado (CSS) y mide el tamaño final.
      container.classList.add('is-collapsed');
      container.classList.remove('is-expanded');
      gsap.set(formContainer, { display: 'none', opacity: 0 });

      gsap.set(container, { x: 0, clearProps: 'width,height' });
      const end = container.getBoundingClientRect();
      const endX = collapsedXRef.current;

      // Volvemos al inicio para animar.
      gsap.set(container, { width: start.width, height: start.height, x: expandedXRef.current });
      gsap.set(formContainer, { display: 'flex', opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          setIsExpanded(false);
          isAnimating.current = false;
          gsap.set(container, { clearProps: 'width,height', x: endX });
          gsap.set(formContainer, { display: 'none', opacity: 0 });
        }
      });

      tl.to(formContainer, { opacity: 0, duration: 0.18 })
        .to(runnerCollapse, { opacity: 0, duration: 0.12 }, '<')
        .to(text, { opacity: 0, duration: 0.12 }, '<')
        .to(text, { flexDirection: 'row', duration: 0 })
        .to(container, { width: end.width, height: end.height, x: endX, duration: 0.2, ease: 'power3.out' })
        .set(runnerCollapse, { display: 'none' })
        .set(runnerIcons, { display: 'flex', opacity: 0 })
        .to(runnerIcons, { opacity: 1, duration: 0.15 })
        .to(text, { opacity: 1, duration: 0.15 }, '<');
    }
  };

  return (
    <div ref={containerRef} className='runner-button-container'>
      <div onClick={handleToggle} className='runner-button-content-container'>
        <div ref={textRef} className={`runner-button-content ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
          <div ref={runnerIconsRef} className='running-icons'>
            <PiPersonSimpleRun className='running-icon' />
            <GoPlus className='plus-icon' />
          </div>
          <div ref={runnerCollapseRef} className='running-icons'>
            <IoIosArrowDown className='arrow-icon'/>
          </div>
          <span className='runner-button-text'>
            Agregar Corredor
          </span>
        </div>
      </div>
      <div ref={formContainerRef} className="runner-form-container">
        <Form />
      </div>

    </div>
  )
}

export default RunnerButton