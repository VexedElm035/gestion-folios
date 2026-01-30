import { Outlet } from 'react-router-dom';
import './clientlayout.css';
// import Background from '@/components/background/Background';

const ClientLayout = () => {
  return (
    <div className="client-layout">
      {/* <Background /> */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default ClientLayout