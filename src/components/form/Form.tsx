import { Dropdown, Input } from '../';
import './form.css';

const Form = () => {
  return (
    <form action="" className='runner-fields'>
      <Input id="nombre" label="Nombre" type="text" />
      <Input id="apellido" label="Apellido" type="text" />
      <Dropdown id="sexo" label="Sexo" options={[{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}]}/>
      <Dropdown id="distancia" label="Distancia" options={[{value: '5', label: '5 KM'}, {value: '10', label: '10 KM'}]}/>
      <Dropdown id="categoria" label="Categoría" options={[{value: 'Juvenil', label: 'Juvenil'}, {value: 'Libre', label: 'Libre'}, {value: 'Master', label: 'Master'}]}/>
      <Input id="telefono" label="Telefono" type="tel" />
      <button className='running-button add-runner-button' type='submit'>Agregar</button>
    </form>
  )
}

export default Form