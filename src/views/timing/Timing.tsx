import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IoClose, IoFlash, IoPlay, IoRefresh } from 'react-icons/io5';

import './timing.css';

gsap.registerPlugin(useGSAP);

const Timing = () => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsWrapRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const isAnimatingRef = useRef(false);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

  const menuItems = useMemo(
    () => [
      { id: 'start', label: 'Iniciar', Icon: IoPlay },
      { id: 'lap', label: 'Vuelta', Icon: IoFlash },
      { id: 'reset', label: 'Reiniciar', Icon: IoRefresh },
    ],
    []
  );

  useGSAP(
    () => {
      const button = buttonRef.current;
      const menu = menuRef.current;
      const itemsWrap = itemsWrapRef.current;
      if (!button || !menu || !itemsWrap) return;

      gsap.set(menu, {
        autoAlpha: 0,
        scale: 0.55,
        x: -10,
        y: -8,
        rotate: -7,
        skewX: 10,
        transformOrigin: 'top right',
        display: 'none',
      });

      gsap.set(button, {
        backgroundColor: '#ffffff',
        color: '#0158d1',
      });

      const tl = gsap.timeline({ paused: true });
      tl.set(menu, { display: 'block' }, 0)
        .to(
          button,
          {
            backgroundColor: '#0158d1',
            color: '#ffffff',
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        )
        .to(
          menu,
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0,
            skewX: 0,
            duration: 0.55,
            ease: 'power3.out',
          },
          0
        );

      tl.eventCallback('onComplete', () => {
        isAnimatingRef.current = false;
      });

      tl.eventCallback('onReverseComplete', () => {
        isAnimatingRef.current = false;
        setIsOpen(false);
        gsap.set(menu, { display: 'none' });
      });

      menuTlRef.current = tl;
    },
    { scope: scopeRef }
  );

  const openMenu = () => {
    const tl = menuTlRef.current;
    if (!tl || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsOpen(true);
    tl.play(0);
  };

  const closeMenu = () => {
    const tl = menuTlRef.current;
    if (!tl || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    tl.reverse();
  };

  const handleToggle = () => {
    if (isOpen) closeMenu();
    else openMenu();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const onPointerDown = (e: PointerEvent) => {
      const scope = scopeRef.current;
      if (!scope) return;
      if (!scope.contains(e.target as Node)) closeMenu();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <div ref={scopeRef} className="timing-page">
      <header className="timing-header">
        <h1 className="timing-title">Timing</h1>
        <p className="timing-subtitle">Acciones rápidas con GSAP</p>
      </header>

      <div className="timing-fab">
        <button
          ref={buttonRef}
          className="timing-fab__button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="timing-action-menu"
          onClick={handleToggle}
        >
          <span className="timing-fab__icon" aria-hidden>
            {isOpen ? <IoClose size={22} /> : <IoFlash size={22} />}
          </span>
          <span className="timing-fab__sr">Abrir acciones</span>
        </button>

        <div
          ref={menuRef}
          id="timing-action-menu"
          role="menu"
          aria-label="Acciones de timing"
          className="timing-fab__menu"
        >
          <div ref={itemsWrapRef} className="timing-fab__menuItems">
            {menuItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                className="timing-fab__menuItem"
                data-timing-menu-item
                onClick={() => {
                  // placeholder actions
                  closeMenu();
                }}
              >
                <span className="timing-fab__menuIcon" aria-hidden>
                  <Icon size={18} />
                </span>
                <span className="timing-fab__menuLabel">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timing