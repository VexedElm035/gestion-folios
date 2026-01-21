import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '@/context/ThemeContext';
import { IoMdDesktop } from "react-icons/io";
import './themeswitch.css';

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme();
  return (
    <div className='theme-switch' data-value={theme} role='group' aria-label='Tema'>
      <span className='theme-switch-indicator' aria-hidden='true' />
        <button
          type='button'
          className={`theme-switch-option ${theme === 'light' ? 'is-active' : ''}`}
          onClick={() => setTheme('light')}
        >
          < MdLightMode />
        </button>
        <button
          type='button'
          className={`theme-switch-option ${theme === 'dark' ? 'is-active' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <MdDarkMode />
        </button>
        <button
          type='button'
          className={`theme-switch-option ${theme === 'system' ? 'is-active' : ''}`}
          onClick={() => setTheme('system')}
        >
          <IoMdDesktop />
        </button>
    </div>
  )
}

export default ThemeSwitch