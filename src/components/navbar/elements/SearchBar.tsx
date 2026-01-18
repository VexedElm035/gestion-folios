import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IoIosSearch } from "react-icons/io";
import './searchbar.css';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'searchBarExpanded';

const readStoredExpanded = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) === true : false;
  } catch {
    return false;
  }
};

type Props = {
  onSearch?: (query: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => readStoredExpanded());
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const effectiveExpanded = isMobile || isExpanded;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    // En móvil, la barra siempre debe estar expandida.
    // No persistimos el estado para no sobreescribir la preferencia desktop.
    if (isMobile) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [isExpanded, isMobile]);

  useGSAP(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    container.classList.toggle('is-expanded', effectiveExpanded);
    container.classList.toggle('is-collapsed', !effectiveExpanded);
    container.classList.toggle('is-mobile', isMobile);
    gsap.set(container, { clearProps: 'width,height' });

    if (effectiveExpanded) {
      gsap.set(input, { display: 'flex', opacity: 1 });
    } else {
      gsap.set(input, { opacity: 0, display: 'none' });
    }
  }, [effectiveExpanded, isMobile]);

  // const isAnimating = useRef(false);

  const focusInput = () => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector('input') as HTMLInputElement | null;
    el?.focus();
  };

  const expand = () => {
    // if (isAnimating.current) return;

    if (isMobile) {
      focusInput();
      return;
    }

    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    // isAnimating.current = true;

    const start = container.getBoundingClientRect();

    // Aplica el layout expandido (CSS) pero bloquea el tamaño al inicial.
    container.classList.add('is-expanded');
    container.classList.remove('is-collapsed');
    gsap.set(input, { display: 'flex', opacity: 0 });
    gsap.set(container, { width: start.width, height: start.height });

    // Mide el tamaño final con layout expandido.
    gsap.set(container, { clearProps: 'width,height' });
    const end = container.getBoundingClientRect();
    gsap.set(container, { width: start.width, height: start.height });

    const tl = gsap.timeline({
      onComplete: () => {
        // isAnimating.current = false;
        setIsExpanded(true);
        gsap.set(container, { clearProps: 'width,height' });
        requestAnimationFrame(focusInput);
      }
    });

    tl.to(container, { width: end.width, height: end.height, duration: 0.15, ease: 'power3.out' })
      .to(input, { opacity: 1, duration: 0.2 }, '-=0.05');
  };

  const collapse = () => {
    //if (isAnimating.current) return;

    if (isMobile) return;

    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    // isAnimating.current = true;

    const start = container.getBoundingClientRect();

    const tl = gsap.timeline({
      onComplete: () => {
        // isAnimating.current = false;
        setIsExpanded(false);
        gsap.set(container, { clearProps: 'width,height' });
      }
    });

    tl.to(input, { opacity: 0, duration: 0.22 })
      .set(input, { display: 'none' })
      .add(() => {
        // Aplica layout colapsado (CSS) y mide el tamaño final.
        container.classList.add('is-collapsed');
        container.classList.remove('is-expanded');

        gsap.set(container, { width: start.width, height: start.height });
        gsap.set(container, { clearProps: 'width,height' });
        const end = container.getBoundingClientRect();
        gsap.set(container, { width: start.width, height: start.height });

        gsap.to(container, { width: end.width, height: end.height, duration: 0.18, ease: 'power3.out' });
      }, '-=0.08');
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!isExpanded) {
      expand();
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    onSearch?.(trimmed);
  };

  const handleBlurCapture: React.FocusEventHandler<HTMLDivElement> = () => {
    if (isMobile) return;
    if (!isExpanded) return;
    if (query.trim().length !== 0) return;

    // Espera un frame para que el foco se asiente (clicks dentro/fuera)
    requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const stillInside = container.contains(document.activeElement);
      if (!stillInside) collapse();
    });
  };

  const handleKeyDownCapture: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== 'Escape') return;
    if (isMobile) return;
    if (!isExpanded) return;
    if (query.trim().length !== 0) return;

    e.preventDefault();
    collapse();
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`search-bar-container ${effectiveExpanded ? 'is-expanded' : 'is-collapsed'} ${isMobile ? 'is-mobile' : ''}`.trim()}
      onBlurCapture={handleBlurCapture}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <form onSubmit={handleSubmit} className='search-bar-form'>
        <button
          ref={buttonRef}
          type='submit'
          className='search-bar-button'
          aria-label={isExpanded ? 'Buscar' : 'Abrir búsqueda'}
          onClick={(e) => {
            // if (isAnimating.current) {
            //   e.preventDefault();
            //   return;
            // }
            if (!isExpanded) {
              e.preventDefault();
              expand();
            }
          }}
        >
          <IoIosSearch />
        </button>

        <div ref={inputRef} className='search-bar-input'>
          <div className='input-container search-bar-input-container'>
            <label htmlFor='search-input' className='input-label'>Buscar</label>
            <input
              id='search-input'
              className='input-element'
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete='off'
              placeholder='Buscar'
            />
            {query.trim().length > 0 && (
              <button
                type='button'
                className='search-bar-clear'
                aria-label='Borrar búsqueda'
                onMouseDown={(e) => {
                  // Mantiene el foco en el input (para que no colapse por blur)
                  e.preventDefault();
                }}
                onClick={() => {
                  setQuery('');
                  const el = containerRef.current?.querySelector('input') as HTMLInputElement | null;
                  el?.focus();
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar