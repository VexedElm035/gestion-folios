import { Outlet } from 'react-router-dom';
import './clientlayout.css';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default ClientLayout