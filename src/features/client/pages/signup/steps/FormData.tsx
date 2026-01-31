import type { SignupData, SignupLocks } from '../signupTypes';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Input from '@/components/form/input/Input';
import Dropdown from '@/components/form/dropdown/Dropdown';
import { api } from '@/utils/api';
import { getCategoria } from '@/utils/getCategoria';

type FormDataProps = {
  data: SignupData;
  locks: SignupLocks;
  verificationToken: string | null;
  onChange: (patch: Partial<SignupData>) => void;
  onSubmitSuccess: () => void;
};

const FormData = ({ data, verificationToken, onChange, onSubmitSuccess }: FormDataProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const categoria = getCategoria(data.edad, data.sexo);
      await api.register({
        ...data,
        telefono: data.telefono || '', // Ensure string
        categoria,
        source: 'client',
        verification_token: verificationToken
      });
      onSubmitSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-steps-container form-data-container'>
      <h3 className='signup-header-substeps-text'>Ingresa tus datos</h3>
      <form onSubmit={handleSubmit} className='runner-fields'>
        <Input id="nombre" label="Nombre" type="text" value={data.nombre} onChange={(e) => onChange({ nombre: e.target.value })} />
        <Input id="apellido" label="Apellido" type="text" value={data.apellido} onChange={(e) => onChange({ apellido: e.target.value })} />
        <Input id="edad" label="Edad" type="number" value={data.edad} onChange={(e) => onChange({ edad: e.target.value })} min={0} />
        <Dropdown id="sexo" label="Sexo" value={data.sexo} onChange={(e) => onChange({ sexo: e.target.value as SignupData['sexo'] })} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} />
        <Dropdown id="distancia" label="Distancia" value={data.distancia} onChange={(e) => onChange({ distancia: e.target.value as SignupData['distancia'] })} options={[{ value: '4', label: '4 KM' }, { value: '8', label: '8 KM' }]} />
        {/* <Dropdown id="categoria" label="Categoría" value={data.categoria} onChange={(e) => onChange({ categoria: e.target.value as SignupData['categoria'] })} options={[{value: 'Juvenil', label: 'Juvenil'}, {value: 'Libre', label: 'Libre'}, {value: 'Master', label: 'Master'}]}/> */}
        {/* <Input id="telefono" label="Telefono" type="tel" value={data.telefono} onChange={(e) => onChange({ telefono: e.target.value })} disabled={locks.telefono}/> */}
        <p>{error}</p>
        <button className='running-button add-runner-button signup-button-next' type='submit'>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}

export default FormData