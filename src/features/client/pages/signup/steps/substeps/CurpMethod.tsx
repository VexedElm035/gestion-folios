import { useState } from 'react';
import Input from '@/components/form/input/Input';
import type { SignupData, SignupLocks } from '../../signupTypes';
import './curpmethod.css';


const CURP_MOCK: Record<string, {
  nombre: string;
  segundoNombre?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: 'H' | 'M';
  entidadNacimiento: string;
}> = {
  RAHL031224HCSZRSA7: {
    nombre: 'Luis',
    segundoNombre: 'Daniel',
    apellidoPaterno: 'Del Razo',
    apellidoMaterno: 'Hernandez',
    fechaNacimiento: '24/12/2003',
    sexo: 'H',
    entidadNacimiento: 'CS',
  },
  RAHL031224MCSZRSA8: {
    nombre: 'Maria',
    segundoNombre: 'Fernanda',
    apellidoPaterno: 'Lopez',
    apellidoMaterno: 'Gomez',
    fechaNacimiento: '24/12/2003',
    sexo: 'M',
    entidadNacimiento: 'CS',
  },
};


const calculateAgeFromDDMMYYYY = (dateStr: string): number | null => {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!day || !month || !year) return null;

  const birth = new Date(year, month - 1, day);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return Math.max(0, age);
};

const mapCurpSexoToFormSexo = (sexo: string): SignupData['sexo'] => {
  // CURP suele usar H (hombre) / M (mujer)
  if (sexo === 'H') return 'M';
  if (sexo === 'M') return 'F';
  return '';
};

type CurpMethodProps = {
  onNext: () => void;
  onCancel: () => void;
  onPrefill: (patch: Partial<SignupData>) => void;
  onLock: (patch: Partial<SignupLocks>) => void;
  curp: string;
  onCurpChange: (curp: string) => void;
};

const CurpMethod = ({ onNext, onCancel, onPrefill, onLock, curp, onCurpChange }: CurpMethodProps) => {
  const [error, setError] = useState<string | null>(null);

  const continueWithCurp = () => {
    setError(null);
    const key = curp.trim().toUpperCase();
    if (!key) {
      setError('Ingresa tu CURP.');
      return;
    }

    const record = CURP_MOCK[key];
    if (!record) {
      setError('CURP no encontrada (demo).');
      return;
    }

    const nombre = [record.nombre, record.segundoNombre].filter(Boolean).join(' ');
    const apellido = [record.apellidoPaterno, record.apellidoMaterno].filter(Boolean).join(' ');
    const edad = calculateAgeFromDDMMYYYY(record.fechaNacimiento);

    onPrefill({
      nombre,
      apellido,
      sexo: mapCurpSexoToFormSexo(record.sexo),
      edad: edad === null ? '' : String(edad),
    });

    // CURP: solo prellena; no bloquea campos
    onLock({ telefono: false });

    onNext();
  };

  return (
    <div className='signup-any-method-container'>
      <h3>Registro con CURP</h3>
      <div className="signup-method-options-container">
        <Input
          id="curp"
          label="Ingresa tu curp"
          type="text"
          value={curp}
          onChange={(e) => onCurpChange(e.target.value)}
          maxLength={18}
        />
        {error && <p className='signup-info-caption signup-info-caption-error'>{error}</p>}
        <div className='signup-any-method-button-container'>
          {/* <button className='signup-button-back' onClick={onCancel}>Cancelar</button> */}
          <button className='signup-button-next' onClick={continueWithCurp}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}

export default CurpMethod