import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Participants, Settings, Timing } from './views';
import Layout from './layouts/Layout';
import { ThemeProvider } from './context/ThemeContext';
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Participants />} />
            <Route path='settings' element={<Settings />} />
            <Route path='timing' element={<Timing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
