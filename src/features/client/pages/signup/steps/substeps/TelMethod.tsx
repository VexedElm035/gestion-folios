import { useState } from 'react'
import Button from '@/components/button/Button'
import Input from '@/components/form/input/Input'

import type { PhoneAuthState, SignupData, SignupLocks } from '../../signupTypes'

type TelMethodProps = {
  onNext: () => void;
  onCancel: () => void;
  onPrefill: (patch: Partial<SignupData>) => void;
  onLock: (patch: Partial<SignupLocks>) => void;

  state: PhoneAuthState;
  onStateChange: (patch: Partial<PhoneAuthState>) => void;

  onTelefonoInvalidated: () => void;
};

const TelMethod = ({ onNext, onPrefill, onLock, state, onStateChange, onTelefonoInvalidated }: TelMethodProps) => {
  const { step, telefono, code, verifiedTelefono } = state;
  const [error, setError] = useState<string | null>(null);

  const goToPhone = () => {
    setError(null);
    onStateChange({ step: 'phone', code: '' });
  };

  const handleTelefonoChange = (next: string) => {
    const nextDigits = next.replace(/\D/g, '');
    if (verifiedTelefono && nextDigits !== verifiedTelefono) {
      setError(null);
      onStateChange({ step: 'phone', telefono: next, code: '', verifiedTelefono: null });
      onTelefonoInvalidated();
      return;
    }
    onStateChange({ telefono: next });
  };

  const send2faCode = () => {
    setError(null);
    const digits = telefono.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('El teléfono debe tener 10 dígitos.');
      return;
    }

    onStateChange({ telefono: digits, step: 'code' });
  };

  const verify2faCode = () => {
    setError(null);
    if (!code.trim()) {
      setError('Ingresa el código.');
      return;
    }

    const digits = telefono.replace(/\D/g, '');
    onPrefill({ telefono: digits });
    onLock({ telefono: true });
    onStateChange({ step: 'verified', verifiedTelefono: digits, code: '' });
    onNext();
  };

  const continueIfVerified = () => {
    if (!verifiedTelefono) return;
    onPrefill({ telefono: verifiedTelefono });
    onLock({ telefono: true });
    onNext();
  };

  return (
    <div className='signup-steps-container signup-any-method-container'>
      <h3 className='signup-header-substeps-text'>Registro con Teléfono</h3>
      <div className="signup-method-options-container">
        {step === 'verified' && verifiedTelefono && (
          <>
            <p className='signup-info-caption'>Teléfono verificado: {verifiedTelefono}</p>
            {error && <p className='signup-info-caption signup-info-caption-error'>{error}</p>}
            <Button onClick={goToPhone}>Cambiar teléfono</Button>
            <Button onClick={continueIfVerified}>Continuar</Button>
            {/* <Button onClick={resetToSelector}>Cancelar</Button> */}
          </>
        )}

        {step === 'phone' && (
          <>
            <Input
              id="telefono"
              label="Ingresa tu número de teléfono"
              type="tel"
              value={telefono}
              onChange={(e) => handleTelefonoChange(e.target.value)}
              maxLength={10}
            />
            {error && <p className='signup-info-caption signup-info-caption-error'>{error}</p>}
            <div className='signup-any-method-button-container'>

            {/* <button className='signup-button-back' onClick={resetToSelector}>Cancelar</button> */}
            <button className='signup-button-next' onClick={send2faCode}>Siguiente</button >
            </div>
          </>
        )}

        {step === 'code' && (
          <>
            <p className='signup-info-caption'>Te enviamos un código al {telefono}</p>
            <Input
              id="2faCode"
              label="Código"
              type="text"
              value={code}
              onChange={(e) => onStateChange({ code: e.target.value })}
            />
            {error && <p className='signup-info-caption signup-info-caption-error'>{error}</p>}
            <div className='signup-any-method-button-container'>

            <button className='signup-button-back' onClick={goToPhone}>Cambiar teléfono</button>
            {/* <button className='signup-button-back' onClick={resetToSelector}>Cancelar</button> */}
            <button className='signup-button-next' onClick={verify2faCode}>Verificar y continuar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TelMethod