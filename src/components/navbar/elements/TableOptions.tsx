import { useState } from 'react'
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoLogoBuffer } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import './tableoptions.css'

const TableOptions = () => {
    const [openSubmenu, setOpenSubmenu] = useState<null | 'group' | 'sort' | 'view'>(null);

  return (
    <div className='options-menu-view'>
              <div
                className={`options-menu-item ${openSubmenu === 'group' ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenSubmenu('group')}
                onMouseLeave={() => setOpenSubmenu(null)}
                onClick={() => setOpenSubmenu(openSubmenu === 'group' ? null : 'group')}
              >
                <div className='options-menu-element'>
                  <IoLogoBuffer />
                  <p>Agrupar por</p>
                </div>
                <div className='options-submenu'>
                  <div className='options-submenu-item'>elemento1</div>
                  <div className='options-submenu-item'>elemento2</div>
                  <div className='options-submenu-item'>elemento3</div>
                </div>
              </div>

              <div
                className={`options-menu-item ${openSubmenu === 'sort' ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenSubmenu('sort')}
                onMouseLeave={() => setOpenSubmenu(null)}
                onClick={() => setOpenSubmenu(openSubmenu === 'sort' ? null : 'sort')}
              >
                <div className='options-menu-element'>
                  <div className='sort-icons'>
                    <IoIosArrowRoundUp className='sort-icons-icon-up'/>
                    <IoIosArrowRoundDown className='sort-icons-icon-down'/>
                  </div>
                  <p>Ordenar por</p>
                </div>
                <div className='options-submenu'>
                  <div className='options-submenu-item'>elemento1</div>
                  <div className='options-submenu-item'>elemento2</div>
                  <div className='options-submenu-item'>elemento3</div>
                </div>
              </div>

              <div
                className={`options-menu-item ${openSubmenu === 'view' ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenSubmenu('view')}
                onMouseLeave={() => setOpenSubmenu(null)}
                onClick={() => setOpenSubmenu(openSubmenu === 'view' ? null : 'view')}
              >
                <div className='options-menu-element'>
                  <IoIosSettings />
                  <p>Ver</p>
                </div>
                <div className='options-submenu'>
                  <div className='options-submenu-item'>elemento1</div>
                  <div className='options-submenu-item'>elemento2</div>
                  <div className='options-submenu-item'>elemento3</div>
                </div>
              </div>
            </div>
  )
}

export default TableOptions