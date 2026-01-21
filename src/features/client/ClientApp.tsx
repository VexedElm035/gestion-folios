import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SignUp } from '@/features/client/pages';
import ClientLayout from '@/layouts/ClientLayout';

const ClientApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ClientLayout />}>
          <Route index element={<SignUp />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default ClientApp
