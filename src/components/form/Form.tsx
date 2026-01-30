import { Dropdown, Input } from '../';
import './form.css';

const Form = () => {
  return (
    <form action="" className='runner-fields'>
      <Input id="nombre" label="Nombre" type="text" />
      <Input id="apellido" label="Apellido" type="text" />
      <Input id="edad" label="Edad" type="number" />
      <Dropdown id="sexo" label="Sexo" options={[{value: 'M', label: 'Masculino'}, {value: 'F', label: 'Femenino'}]}/>
      <Dropdown id="distancia" label="Distancia" options={[{value: '4', label: '4 KM'}, {value: '8', label: '8 KM'}]}/>
      {/* <Dropdown id="categoria" label="Categoría" options={[{value: 'Infantil', label: 'Infantil'}, {value: 'Femenil', label: 'Femenil'}, {value: 'Varonil', label: 'Varonil'}]}/> */}
      <Input id="telefono" label="Telefono" type="tel" />
      <button className='running-button add-runner-button' type='submit'>Agregar</button>
    </form>
  )
}

export default Form