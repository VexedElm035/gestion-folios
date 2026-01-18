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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    // No persistimos el estado en móvil para no sobreescribir la preferencia desktop.
    if (isMobile) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [isExpanded, isMobile]);

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
      container.classList.add('is-expanded');
      container.classList.remove('is-collapsed');
      container.classList.toggle('is-mobile', isMobile);
      gsap.set(container, { clearProps: 'width,height' });
    } else {
      gsap.set(expandedIcon, { opacity: 0, display: 'none' });
      gsap.set(content, { opacity: 0, display: 'none' });
      container.classList.add('is-collapsed');
      container.classList.remove('is-expanded');
      container.classList.toggle('is-mobile', isMobile);
      gsap.set(container, { clearProps: 'width,height' });
      gsap.set(text, { display: 'flex', opacity: 1 });
      gsap.set(collapsedIcons, { display: 'block', opacity: 1 });
    }
  }, [isExpanded, isMobile]);

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
      const start = container.getBoundingClientRect();

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(true);
          gsap.set(container, { clearProps: 'width,height' });
        }
      });
      tl.to([text, collapsedIcons], { opacity: 0, duration: 0.2 })
        .set([text, collapsedIcons], { display: 'none' })
        .set(expandedIcon, { display: 'flex', opacity: 0 })
        .set(content, { display: 'flex', opacity: 0 })

        // Aplica layout expandido (CSS) y anima a su tamaño final medido.
        .add(() => {
          container.classList.add('is-expanded');
          container.classList.remove('is-collapsed');
          gsap.set(container, { width: start.width, height: start.height });
          gsap.set(container, { clearProps: 'width,height' });
          const end = container.getBoundingClientRect();
          gsap.set(container, { width: start.width, height: start.height });
          gsap.to(container, { width: end.width, height: end.height, duration: 0.3, ease: 'power3.out' });
        })
        .to(expandedIcon, { opacity: 1, duration: 0.2 }, "-=0.05")
        .to(content, { opacity: 1, duration: 0.2 }, "-=0.3");
    }
    else {
      const start = container.getBoundingClientRect();

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsExpanded(false);
          gsap.set(container, { clearProps: 'width,height' });
        }
      });
      tl.to([content, expandedIcon], { opacity: 0, duration: 0.2 })

        // Aplica layout colapsado (CSS) y anima a su tamaño final medido.
        .add(() => {
          container.classList.add('is-collapsed');
          container.classList.remove('is-expanded');
          gsap.set(container, { width: start.width, height: start.height });
          gsap.set(container, { clearProps: 'width,height' });
          const end = container.getBoundingClientRect();
          gsap.set(container, { width: start.width, height: start.height });
          gsap.to(container, { width: end.width, height: end.height, duration: 0.12, ease: 'power3.out' });
        }, "-=0.05")
        .set(content, { display: 'none' })
        .set(expandedIcon, { display: 'none' })
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

    <div ref={containerRef} className={`running-container ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${isMobile ? 'is-mobile' : ''}`.trim()}>
      <div ref={contentRef} id="add-runner-panel" className="window-content">
        <Form />
      </div>
    </div>
      </div>
    </div>
  )
}

export default RunnerButton