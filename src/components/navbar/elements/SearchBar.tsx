import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IoIosSearch } from "react-icons/io";
import './searchbar.css';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'searchBarExpanded';
const COLLAPSED_SIZE = 'calc(var(--regular-text) + 15px)';

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [isExpanded]);

  useGSAP(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    if (isExpanded) {
      gsap.set(input, { display: 'flex', opacity: 1 });
      gsap.set(container, { width: 'auto', height: 'auto' });
    } else {
      gsap.set(input, { opacity: 0, display: 'none' });
      gsap.set(container, { width: COLLAPSED_SIZE, height: COLLAPSED_SIZE, padding: '0' });
    }
  }, [isExpanded]);

  const isAnimating = useRef(false);

  const expand = () => {
    if (isAnimating.current) return;

    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsExpanded(true);
        requestAnimationFrame(() => {
          const el = container.querySelector('input') as HTMLInputElement | null;
          el?.focus();
        });
      }
    });

    tl.set(input, { display: 'flex', opacity: 0 })
      .to(container, { width: 'auto', height: 'auto', paddingRight: '8px', duration: 0.15 })
      .to(input, { opacity: 1, duration: 0.2 }, '-=0.05');
  };

  const collapse = () => {
    if (isAnimating.current) return;

    const container = containerRef.current;
    const input = inputRef.current;
    if (!container || !input) return;

    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsExpanded(false);
      }
    });

    tl.to(input, { opacity: 0, duration: 0.22 })
    .set(input, { display: 'none' })
    .to(container, { width: COLLAPSED_SIZE, duration: 0.18 }, '-=0.08');
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
    if (!isExpanded) return;
    if (query.trim().length !== 0) return;

    e.preventDefault();
    collapse();
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className='search-bar-container'
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
            if (isAnimating.current) {
              e.preventDefault();
              return;
            }
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