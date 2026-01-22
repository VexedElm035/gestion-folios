import { useMemo, useState } from 'react'
import Button from '@/components/button/Button'
import type { SignupData, SignupLocks } from '../signupTypes'
import Input from '@/components/form/input/Input';

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

type SignUpMethodProps = {
  onNext: () => void;
  onPrefill: (patch: Partial<SignupData>) => void;
  onLock: (patch: Partial<SignupLocks>) => void;
};

const SignUpMethod = ({ onNext, onPrefill, onLock }: SignUpMethodProps) => {
  const [method, setMethod] = useState<'curp' | 'telefono' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Telefono substeps
  const [telStep, setTelStep] = useState<'phone' | 'code'>('phone');
  const [telefono, setTelefono] = useState('');
  const [code, setCode] = useState('');

  // CURP input
  const [curp, setCurp] = useState('');

  const curpDb = useMemo(() => CURP_MOCK, []);

  const reset = () => {
    setError(null);
    setMethod(null);
    setTelStep('phone');
    setTelefono('');
    setCode('');
    setCurp('');
  };

  const continueWithCurp = () => {
    setError(null);
    const key = curp.trim().toUpperCase();
    if (!key) {
      setError('Ingresa tu CURP.');
      return;
    }

    const record = curpDb[key];
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

    // CURP: no bloquea campos
    onLock({ telefono: false });

    onNext();
  };

  const send2faCode = () => {
    setError(null);
    const digits = telefono.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('El teléfono debe tener 10 dígitos.');
      return;
    }
    setTelefono(digits);
    setTelStep('code');
  };

  const verify2faCode = () => {
    setError(null);
    if (!code.trim()) {
      setError('Ingresa el código.');
      return;
    }

    // Demo: cualquier código es válido (puedes cambiarlo a == '1234')
    onPrefill({ telefono });
    onLock({ telefono: true });
    onNext();
  };

  return (
    <div>
      {!method && (
        <>
          <h2>Selecciona tu método de registro</h2>
          <Button onClick={() => setMethod('curp')}>curp</Button>
          <Button onClick={() => setMethod('telefono')}>telefono</Button>
        </>
      )}

      {method === 'curp' && (
        <div>
          <h3>CURP</h3>
          <Input id="curp" label="Ingresa tu curp" type="text" value={curp} onChange={(e) => setCurp(e.target.value)} maxLength={18} />
          {error && <p>{error}</p>}
          <Button onClick={reset}>Cancelar</Button>
          <Button onClick={continueWithCurp}>Continuar</Button>
        </div>
      )}

      {method === 'telefono' && (
        <div>
          <h3>Teléfono</h3>
          {telStep === 'phone' && (
            <>
              <Input id="telefono" label="Ingresa tu número de teléfono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={10} />
              {error && <p>{error}</p>}
              <Button onClick={reset}>Cancelar</Button>
              <Button onClick={send2faCode}>Enviar código</Button>
            </>
          )}

          {telStep === 'code' && (
            <>
              <p>Te enviamos un código al {telefono}</p>
              <Input id="2faCode" label="Código" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
              {error && <p>{error}</p>}
              <Button onClick={() => setTelStep('phone')}>Cambiar teléfono</Button>
              <Button onClick={reset}>Cancelar</Button>
              <Button onClick={verify2faCode}>Verificar y continuar</Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SignUpMethod