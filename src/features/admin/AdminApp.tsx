import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Participants, Settings, Timing } from '@/features/admin/pages';
import AdminLayout from '@/layouts/AdminLayout';
import { TableViewProvider } from '@/context/TableViewContext';

const AdminApp = () => {
  return (
    <TableViewProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminLayout />}>
            <Route index element={<Participants />} />
            <Route path='settings' element={<Settings />} />
            <Route path='timing' element={<Timing />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TableViewProvider>
  )
}

export default AdminApp
