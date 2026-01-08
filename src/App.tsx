import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/button/Button'
import Table from './components/table/Table'
import Form from './components/form/Form'
import Navbar from './components/navbar/Navbar'
import { useTheme } from './hooks/useTheme'

function App() {
  const [count, setCount] = useState(0)
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Table />
      <br />
      <Form />
      <br />
      <Button contenido="Prueba"/>
      <br />
    </>
  )
}

export default App
