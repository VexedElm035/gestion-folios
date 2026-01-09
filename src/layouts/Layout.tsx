import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import './layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout