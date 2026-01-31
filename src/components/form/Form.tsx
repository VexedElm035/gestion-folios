import { useState } from 'react';
import { Dropdown, Input } from '../';
import './form.css';
import { api } from '@/utils/api';
import { getCategoria } from '@/utils/getCategoria';

const Form = () => {
  const [data, setData] = useState({
    nombre: '', apellido: '', edad: '', sexo: '', distancia: '4', telefono: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoria = getCategoria(data.edad, data.sexo);
      await api.register({ ...data, categoria, source: 'admin' });
      alert('Registrado con éxito');
      // Reset form or redirect
      setData({ nombre: '', apellido: '', edad: '', sexo: '', distancia: '4', telefono: '' });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al registrar');
    }
  };

  const handleChange = (key: string, val: string) => setData(prev => ({ ...prev, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className='runner-fields'>
      <Input id="nombre" label="Nombre" type="text" value={data.nombre} onChange={e => handleChange('nombre', e.target.value)} />
      <Input id="apellido" label="Apellido" type="text" value={data.apellido} onChange={e => handleChange('apellido', e.target.value)} />
      <Input id="edad" label="Edad" type="number" value={data.edad} onChange={e => handleChange('edad', e.target.value)} />
      <Dropdown id="sexo" label="Sexo" options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} value={data.sexo} onChange={e => handleChange('sexo', e.target.value)} />
      <Dropdown id="distancia" label="Distancia" options={[{ value: '4', label: '4 KM' }, { value: '8', label: '8 KM' }]} value={data.distancia} onChange={e => handleChange('distancia', e.target.value)} />
      <Input id="telefono" label="Telefono" type="tel" value={data.telefono} onChange={e => handleChange('telefono', e.target.value)} maxLength={10} />
      <button className='running-button add-runner-button' type='submit'>Agregar</button>
    </form>
  )
}

export default Form