import { useEffect, useRef, useState } from 'react'
import { IoLogoBuffer, IoIosSettings, IoIosCheckmark } from "react-icons/io";
import { IoEllipse } from "react-icons/io5";
import { useTableView } from '../../../context/TableViewContext';
import './tableoptions.css'

const TableOptions = () => {
  const viewRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const pinTimerRef = useRef<number | null>(null);
  const hoverKeyRef = useRef<null | 'group' | 'view'>(null);

  const { visibleColumns, toggleColumn, groupBy, toggleGroupBy } = useTableView();

  const [openSubmenu, setOpenSubmenu] = useState<null | 'group' | 'view'>(null);
  const [pinnedSubmenu, setPinnedSubmenu] = useState<null | 'group' | 'view'>(null);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const clearPinTimer = () => {
    if (pinTimerRef.current) {
      window.clearTimeout(pinTimerRef.current);
      pinTimerRef.current = null;
    }
  };

  const closeAll = () => {
    clearHoverTimer();
    clearPinTimer();
    hoverKeyRef.current = null;
    setPinnedSubmenu(null);
    setOpenSubmenu(null);
  };

  const openNow = (key: 'group' | 'view') => {
    clearHoverTimer();
    clearPinTimer();
    hoverKeyRef.current = key;
    // Cambiar de item siempre “desancla” el submenu anterior
    if (pinnedSubmenu && pinnedSubmenu !== key) setPinnedSubmenu(null);
    setOpenSubmenu(key);
  };

  const scheduleOpen = (key: 'group' | 'view') => {
    hoverKeyRef.current = key;
    clearHoverTimer();

    // Si hay un submenu anclado y el usuario pasa a otro item, se cierra inmediatamente
    if (pinnedSubmenu && pinnedSubmenu !== key) {
      setPinnedSubmenu(null);
      setOpenSubmenu(null);
    }

    hoverTimerRef.current = window.setTimeout(() => {
      if (hoverKeyRef.current === key) {
        setOpenSubmenu(key);
      }
      hoverTimerRef.current = null;
    }, 200);
  };

  const schedulePin = (key: 'group' | 'view') => {
    clearPinTimer();
    pinTimerRef.current = window.setTimeout(() => {
      // Si el usuario sigue en este submenu, queda anclado
      setPinnedSubmenu(key);
      setOpenSubmenu(key);
      pinTimerRef.current = null;
    }, 300);
  };

  useEffect(() => {
    if (!openSubmenu && !pinnedSubmenu) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = viewRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) closeAll();
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSubmenu, pinnedSubmenu]);

  useEffect(() => {
    return () => {
      clearHoverTimer();
      clearPinTimer();
    };
  }, []);

  return (
    <div ref={viewRef} className='options-menu-view'>
      <div
        className={`options-menu-item ${openSubmenu === 'group' ? 'is-open' : ''}`}
        onMouseEnter={() => scheduleOpen('group')}
        onMouseLeave={() => {
          clearPinTimer();
          if (hoverKeyRef.current === 'group') hoverKeyRef.current = null;
          if (pinnedSubmenu !== 'group') setOpenSubmenu(null);
        }}
        onClick={() => openNow('group')}
      >
        <div className='options-menu-element'>
          <IoLogoBuffer />
          <p>Agrupar por</p>
        </div>
        <div
          className='options-submenu'
          onMouseEnter={() => schedulePin('group')}
          onMouseLeave={() => {
            clearPinTimer();
          }}
        >
          <div
            className={`options-submenu-item ${groupBy === 'distancia' ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleGroupBy('distancia');
            }}
          >
            <IoEllipse className={`options-submenu-item-circle ${groupBy === 'distancia' ? 'is-visible' : 'is-invisible'}`}/>
            <span>Distancia</span>
          </div>
          <div
            className={`options-submenu-item ${groupBy === 'categoria' ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleGroupBy('categoria');
            }}
          >
            <IoEllipse className={`options-submenu-item-circle ${groupBy === 'categoria' ? 'is-visible' : 'is-invisible'}`}/>
            <span>Categoría</span>
          </div>
        </div>
      </div>
      <div
        className={`options-menu-item ${openSubmenu === 'view' ? 'is-open' : ''}`}
        onMouseEnter={() => scheduleOpen('view')}
        onMouseLeave={() => {
          clearPinTimer();
          if (hoverKeyRef.current === 'view') hoverKeyRef.current = null;
          if (pinnedSubmenu !== 'view') setOpenSubmenu(null);
        }}
        onClick={() => openNow('view')}
      >
        <div className='options-menu-element'>
          <IoIosSettings />
          <p>Ver</p>
        </div>
        <div
          className='options-submenu'
          onMouseEnter={() => schedulePin('view')}
          onMouseLeave={() => {
            clearPinTimer();
          }}
        >
          <div
            className={`options-submenu-item ${visibleColumns.folio ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('folio');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.folio ? 'is-visible' : 'is-invisible'}`}/>
            <span>Folio</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.name ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('name');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.name ? 'is-visible' : 'is-invisible'}`}/>
            <span>Nombre</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.apellido ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('apellido');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.apellido ? 'is-visible' : 'is-invisible'}`}/>
            <span>Apellido</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.distancia ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('distancia');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.distancia ? 'is-visible' : 'is-invisible'}`}/>
            <span>Distancia</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.tel ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('tel');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.tel ? 'is-visible' : 'is-invisible'}`}/>
            <span>Teléfono</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.categoria ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('categoria');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.categoria ? 'is-visible' : 'is-invisible'}`}/>
            <span>Categoría</span>
          </div>
          <div
            className={`options-submenu-item ${visibleColumns.fecha_registro ? 'is-active' : 'is-inactive'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleColumn('fecha_registro');
            }}
          >
            <IoIosCheckmark className={`options-submenu-check ${visibleColumns.fecha_registro ? 'is-visible' : 'is-invisible'}`}/>
            <span>Fecha de registro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableOptions