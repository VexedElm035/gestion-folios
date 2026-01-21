import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import './adminlayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout