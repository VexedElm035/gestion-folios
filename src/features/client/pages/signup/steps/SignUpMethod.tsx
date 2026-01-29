import { forwardRef, useImperativeHandle } from 'react'
import type { CurpState, PhoneAuthState, SignupData, SignupLocks, SignupMethod } from '../signupTypes'
import CurpMethod from './substeps/CurpMethod';
import TelMethod from './substeps/TelMethod';

export type SignUpMethodHandle = {
  handleBack: () => boolean;
};


type SignUpMethodProps = {
  onNext: () => void;
  onPrefill: (patch: Partial<SignupData>) => void;
  onLock: (patch: Partial<SignupLocks>) => void;

  methodView: SignupMethod;
  onSelectMethod: (next: Exclude<SignupMethod, null>) => void;
  onBackToSelector: () => void;

  curpState: CurpState;
  onCurpStateChange: (patch: Partial<CurpState>) => void;

  phoneAuth: PhoneAuthState;
  onPhoneAuthChange: (patch: Partial<PhoneAuthState>) => void;
  onTelefonoInvalidated: () => void;
};

const SignUpMethod = forwardRef<SignUpMethodHandle, SignUpMethodProps>(({ onNext, onPrefill, onLock, methodView, onSelectMethod, onBackToSelector, curpState, onCurpStateChange, phoneAuth, onPhoneAuthChange, onTelefonoInvalidated }, ref) => {
  const reset = () => onBackToSelector();

  useImperativeHandle(ref, () => ({
    handleBack: () => {
      if (methodView === 'telefono') {
        // Si está en el substep del código, back regresa a phone.
        if (phoneAuth.step === 'code') {
          onPhoneAuthChange({ step: 'phone', code: '' });
          return true;
        }
        // Si está en teléfono (phone/verified), vuelve al selector
        onBackToSelector();
        return true;
      }

      if (methodView === 'curp') {
        onBackToSelector();
        return true;
      }

      return false;
    },
  }), [methodView, onBackToSelector, onPhoneAuthChange, phoneAuth.step]);

  return (
    <div className="signup-steps-container signup-method-container">
      {!methodView && (
        <>
          <h2 className='signup-header-steps-text'>Selecciona tu método de registro</h2>
          <div className="signup-method-options-container">
            <button className="signup-button-next" onClick={() => onSelectMethod('telefono')}>Teléfono</button>
            <button className="signup-button-next" onClick={() => onSelectMethod('curp')}>CURP</button>
          </div>
        </>
      )}

      {methodView === 'curp' && (
        <CurpMethod
          onNext={onNext}
          onCancel={reset}
          onPrefill={onPrefill}
          onLock={onLock}
          curp={curpState.curp}
          onCurpChange={(curp) => onCurpStateChange({ curp })}
        />
      )}

      {methodView === 'telefono' && (
        <TelMethod
          onNext={onNext}
          onCancel={reset}
          onPrefill={onPrefill}
          onLock={onLock}
          state={phoneAuth}
          onStateChange={onPhoneAuthChange}
          onTelefonoInvalidated={onTelefonoInvalidated}
        />
      )}
    </div>
  )
})

export default SignUpMethod