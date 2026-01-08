import './App.css'
import Button from './components/button/Button'
import Table from './components/table/Table'
import Form from './components/form/Form'
import Navbar from './components/navbar/Navbar'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Table />
      <br />
      <Form />
      <br />
      <Button />
      <br />
    </>
  )
}

export default App
