import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IoClose, IoSettingsSharp } from "react-icons/io5";
import './settings.css';

gsap.registerPlugin(useGSAP);

const Settings = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('settingsOpen');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('settingsOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
        const container = containerRef.current;
        const button = buttonRef.current;
        const text = textRef.current;
        const content = contentRef.current;

        if (container && button && text && content) {
            gsap.set(text, { opacity: 0, display: 'none' });
            gsap.set(container, {
                width: 300,
                height: 350,
                borderRadius: 20,
                backgroundColor: '#0158d1'
            });
            gsap.set(button, {
                x: 115,
                y: -140,
                rotation: 90,
                backgroundColor: '#ff4d4d',
                borderRadius: '50%',
                width: 40,
                height: 40
            });
            gsap.set(content, {
                display: 'block',
                opacity: 1
            });
        }
    }
  }, [isOpen]);

  
  // We use a ref to store the animation status to prevent double clicks during animation
  const isAnimating = useRef(false);

  const handleToggle = () => {
    if (isAnimating.current) return;
    
    const container = containerRef.current;
    const button = buttonRef.current;
    const text = textRef.current;
    const content = contentRef.current;

    if (!container || !button || !text || !content) return;

    isAnimating.current = true;

    if (!isOpen) {
      // OPEN ANIMATION
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsOpen(true);
        }
      });

      // 1. Hide text
      tl.to(text, { opacity: 0, duration: 0.2, display: 'none' })
        // 2. Expand container and Move button simultaneously
        .to(container, {
          width: 300,
          height: 350,
          borderRadius: 20,
          backgroundColor: '#0158d1', // Keep blue or change slightly
          duration: 0.6,
          ease: "power3.inOut"
        }, "expand")
        .to(button, {
          x: 115, // Move to right corner (half of 300 - padding)
          y: -140, // Move to top corner (half of 350 - padding)
          rotation: 90,
          backgroundColor: '#ff4d4d', // Change to red for close
          borderRadius: '50%',
          width: 40,
          height: 40,
          duration: 0.6,
          ease: "power3.inOut"
        }, "expand")
        // 3. Show content
        .to(content, {
          display: 'block',
          opacity: 1,
          duration: 0.4
        }, "-=0.2");

    } else {
      // CLOSE ANIMATION
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          setIsOpen(false);
        }
      });

      // 1. Hide Content
      tl.to(content, { opacity: 0, duration: 0.2, display: 'none' })
        // 2. Return button FIRST
        .to(button, {
          x: 0,
          y: 0,
          rotation: 0,
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          duration: 0.5,
          ease: "power2.inOut"
        })
        // 3. THEN Shrink container
        .to(container, {
          width: 160,
          height: 50,
          borderRadius: 25,
          duration: 0.5,
          ease: "power2.inOut"
        })
        // 4. Show text
        .to(text, { display: 'block', opacity: 1, duration: 0.2 }, "-=0.2");
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container-center">
        <div ref={containerRef} className="blue-window">
          
          {/* Initial Button Content */}
          <div ref={buttonRef} className="action-button-trigger" onClick={handleToggle}>
             <span className="icon-container">
                {isOpen ? <IoClose color="white" size={24}/> : <IoSettingsSharp color="white" size={20} />}
             </span>
             <span ref={textRef} className="button-text">Configuración</span>
          </div>

          {/* Window Content (Hidden initially) */}
          <div ref={contentRef} className="window-content" style={{display: 'none', opacity: 0}}>
             <h3>Ajustes</h3>
             <div className="setting-item">
               <label>Opción 1</label>
               <input type="checkbox" />
             </div>
             <div className="setting-item">
               <label>Volumen</label>
               <input type="range" />
             </div>
             <p className="description">Más configuraciones aquí...</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Settings;