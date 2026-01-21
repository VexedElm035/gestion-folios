import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import './App.css'

const AdminApp = lazy(() => import('@/features/admin/AdminApp'));
const ClientApp = lazy(() => import('@/features/client/ClientApp'));

function App() {
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');

  return (
    <ThemeProvider>
      <Suspense fallback={<div />}> 
        {isAdminSubdomain ? <AdminApp /> : <ClientApp />}
      </Suspense>
    </ThemeProvider>
  )
}

export default App
