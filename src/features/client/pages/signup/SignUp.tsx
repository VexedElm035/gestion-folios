import { useRef, useState, useEffect, useCallback } from 'react';
import { WelcomeMessage, SignUpMethod, FormData, ThankYouPage } from './steps';
import { IoIosArrowBack } from "react-icons/io";
import './signup.css'
import Options from '@/components/options/Options';
import type { CurpState, PhoneAuthState, SignupData, SignupLocks, SignupMethod, Step } from './signupTypes';
import type { SignUpMethodHandle } from './steps/SignUpMethod';

const INITIAL_DATA: SignupData = {
  nombre: '',
  apellido: '',
  edad: '',
  sexo: '',
  distancia: '',
  categoria: '',
  telefono: '',
};

const INITIAL_LOCKS: SignupLocks = {
  telefono: false,
};

const INITIAL_METHOD: SignupMethod = null;

const INITIAL_CURP_STATE: CurpState = {
  curp: '',
};

const INITIAL_PHONE_AUTH: PhoneAuthState = {
  step: 'phone',
  telefono: '',
  code: '',
  verifiedTelefono: null,
};

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [history, setHistory] = useState<Step[]>(['welcome']);

  const currentStepRef = useRef<Step>('welcome');
  const methodViewRef = useRef<SignupMethod>(INITIAL_METHOD);
  const phoneAuthRef = useRef<PhoneAuthState>(INITIAL_PHONE_AUTH);
  const methodCompletedRef = useRef<boolean>(false);

  const signUpMethodRef = useRef<SignUpMethodHandle | null>(null);

  const [data, setData] = useState<SignupData>(INITIAL_DATA);
  const [locks, setLocks] = useState<SignupLocks>(INITIAL_LOCKS);

  // Método persistente seleccionado (se usa para restaurar al volver de FormData)
  const [selectedMethod, setSelectedMethod] = useState<SignupMethod>(INITIAL_METHOD);
  // Método actualmente visible (null = selector)
  const [methodView, setMethodView] = useState<SignupMethod>(INITIAL_METHOD);

  const selectedMethodRef = useRef<SignupMethod>(INITIAL_METHOD);
  const [curpState, setCurpState] = useState<CurpState>(INITIAL_CURP_STATE);
  const [phoneAuth, setPhoneAuth] = useState<PhoneAuthState>(INITIAL_PHONE_AUTH);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const phoneVerifyExpiryTimeoutRef = useRef<number | null>(null);
  const phoneVerifyExpiryAtRef = useRef<number | null>(null);

  const stopPhoneVerifyExpiry = useCallback(() => {
    if (phoneVerifyExpiryTimeoutRef.current !== null) {
      window.clearTimeout(phoneVerifyExpiryTimeoutRef.current);
      phoneVerifyExpiryTimeoutRef.current = null;
    }
    phoneVerifyExpiryAtRef.current = null;
  }, []);

  const startPhoneVerifyExpiry = useCallback(() => {
    // Solo aplica si actualmente está verificado.
    if (phoneAuthRef.current.step !== 'verified') return;

    // Ya hay una expiración corriendo.
    if (phoneVerifyExpiryTimeoutRef.current !== null) return;

    const expiryAt = Date.now() + 60_000;
    phoneVerifyExpiryAtRef.current = expiryAt;

    phoneVerifyExpiryTimeoutRef.current = window.setTimeout(() => {
      phoneVerifyExpiryTimeoutRef.current = null;
      phoneVerifyExpiryAtRef.current = null;

      // Reinicia el estado exitoso del código.
      setPhoneAuth((prev) => {
        if (prev.step !== 'verified') return prev;
        return {
          ...prev,
          step: 'phone',
          code: '',
          verifiedTelefono: null,
        };
      });

      // Limpia el teléfono del formulario y lo desbloquea.
      setData((prev) => ({ ...prev, telefono: '' }));
      setLocks((prev) => ({ ...prev, telefono: false }));
    }, 60_000);
  }, []);

  const isPhoneVerificationProtectedView = (step: Step, mv: SignupMethod, pa: PhoneAuthState) => {
    // No caduca dentro de FormData.
    if (step === 'form') return true;
    // No caduca en la vista “Teléfono verificado: ...”.
    if (step === 'method' && mv === 'telefono' && pa.step === 'verified') return true;
    return false;
  };

  const clearAllFormData = () => {
    setData(INITIAL_DATA);
    setLocks(INITIAL_LOCKS);
  };

  const handleTelefonoInvalidated = () => {
    // Requisito: si cambia el número, se limpia el estado de verificación y el form
    // (como si nunca hubiera hecho lo del teléfono).
    stopPhoneVerifyExpiry();
    methodCompletedRef.current = false;
    clearAllFormData();
    setPhoneAuth((prev) => ({
      ...prev,
      step: 'phone',
      code: '',
      verifiedTelefono: null,
    }));
  };

  const handleSelectMethod = (next: Exclude<SignupMethod, null>) => {
    // Toggle/switch aplica justo cuando presionas el botón del método.
    if (selectedMethod && selectedMethod !== next) {
      // Al cambiar de método, se limpia el form (como si nunca lo hubieras hecho).
      methodCompletedRef.current = false;
      clearAllFormData();

      // Además, se limpia el estado del método anterior.
      if (selectedMethod === 'curp') {
        setCurpState(INITIAL_CURP_STATE);
      }
      if (selectedMethod === 'telefono') {
        stopPhoneVerifyExpiry();
        setPhoneAuth(INITIAL_PHONE_AUTH);
      }
    }

    setSelectedMethod(next);
    setMethodView(next);

    // Si entras a una vista protegida (teléfono verificado), se detiene la expiración.
    if (next === 'telefono' && phoneAuthRef.current.step === 'verified') {
      stopPhoneVerifyExpiry();
    }
  };

  const handleBackToSelector = () => {
    // Al salir de “teléfono verificado” hacia vistas anteriores, inicia el countdown.
    if (currentStepRef.current === 'method' && methodViewRef.current === 'telefono') {
      if (phoneAuthRef.current.step === 'verified') {
        startPhoneVerifyExpiry();
      }
    }
    setMethodView(null);
  };

  useEffect(() => {
    return () => {
      stopPhoneVerifyExpiry();
    };
  }, [stopPhoneVerifyExpiry]);

  useEffect(() => {
    currentStepRef.current = currentStep;
    selectedMethodRef.current = selectedMethod;
    methodViewRef.current = methodView;
    phoneAuthRef.current = phoneAuth;
  }, [currentStep, selectedMethod, methodView, phoneAuth]);

  useEffect(() => {
    const handdlePopState = (event: PopStateEvent) => {
      if (event.state?.step) {
        const prevStep = currentStepRef.current;
        const prevMethodView = methodViewRef.current;
        const prevPhoneAuth = phoneAuthRef.current;
        const step = event.state.step as Step;

        // Guard: si intentas caer en 'form' vía historial sin haber completado 'method',
        // redirige (replace) a 'method' para evitar un form vacío/inconsistente.
        if (step === 'form' && !methodCompletedRef.current) {
          stopPhoneVerifyExpiry();
          window.history.replaceState({ step: 'method' }, '');
          setCurrentStep('method');
          setHistory((prev) => {
            const idx = prev.lastIndexOf('form');
            if (idx !== -1) {
              const next = prev.slice(0, idx + 1);
              next[next.length - 1] = 'method';
              return next;
            }
            if (prev.length === 0) return ['welcome', 'method'];
            return [...prev, 'method'];
          });
          return;
        }

        // Inicia/detiene expiración dependiendo si sales/entras de vistas protegidas.
        if (prevPhoneAuth.step === 'verified') {
          const nextMethodView = step === 'method'
            ? (prevStep === 'form' ? selectedMethodRef.current : prevMethodView)
            : prevMethodView;
          const prevProtected = isPhoneVerificationProtectedView(prevStep, prevMethodView, prevPhoneAuth);
          const nextProtected = isPhoneVerificationProtectedView(step, nextMethodView, prevPhoneAuth);

          if (prevProtected && !nextProtected) startPhoneVerifyExpiry();
          if (!prevProtected && nextProtected) stopPhoneVerifyExpiry();
        } else {
          stopPhoneVerifyExpiry();
        }

        // Si vuelves de FormData -> Method, restaura el método elegido.
        if (step === 'method' && prevStep === 'form') {
          const persisted = selectedMethodRef.current;
          if (persisted) setMethodView(persisted);
        }

        setCurrentStep(step);
        setHistory((prev) => {
          const idx = prev.lastIndexOf(step);
          if (idx !== -1) return prev.slice(0, idx + 1);
          return [...prev, step];
        });
      }
    };

    window.history.replaceState({ step: 'welcome' }, '');
    window.addEventListener('popstate', handdlePopState);
    return () => window.removeEventListener('popstate', handdlePopState);
  }, [startPhoneVerifyExpiry, stopPhoneVerifyExpiry]);

  const navigateToStep = (step: Step, pushToHistory = true) => {
    // Entrar a FormData es vista protegida (no debe expirar).
    if (step === 'form') stopPhoneVerifyExpiry();
    setCurrentStep(step);
    if (pushToHistory) {
      window.history.pushState({ step }, '');
      setHistory((prev) => [...prev, step]);
    }
  };

  const goBack = () => {
    if (currentStep === 'method') {
      const handled = signUpMethodRef.current?.handleBack() ?? false;
      if (handled) return;
    }
    if (history.length <= 1) return;
    window.history.back();
  };

  const canGoBack = history.length > 1;

  // Next global solo aplica cuando el step no tiene lógica propia.
  // - method: avanza desde SignUpMethod (substeps)
  // - form: avanza desde submit del formulario
  const canGoNext = currentStep === 'welcome';
  const goNext = () => {
    if (!canGoNext) return;
    navigateToStep('method', true);
  };

  return (
    <div className='signup-container'>
      <section className='signup-top-container'>
        <Options />
      </section>

      <section className='signup-main-container'>
        {currentStep === 'welcome' && <WelcomeMessage goNext={goNext} />}
        {currentStep === 'method' && (
          <SignUpMethod
            ref={signUpMethodRef}
            onNext={() => {
              methodCompletedRef.current = true;
              navigateToStep('form', true);
            }}
            onPrefill={(patch) => setData((prev) => ({ ...prev, ...patch }))}
            onLock={(patch) => setLocks((prev) => ({ ...prev, ...patch }))}
            methodView={methodView}
            onSelectMethod={handleSelectMethod}
            onBackToSelector={handleBackToSelector}
            curpState={curpState}
            onCurpStateChange={(patch) => setCurpState((prev) => ({ ...prev, ...patch }))}
            phoneAuth={phoneAuth}
            onPhoneAuthChange={(patch) => setPhoneAuth((prev) => ({ ...prev, ...patch }))}
            onTelefonoInvalidated={handleTelefonoInvalidated}
            onTokenReceived={(token) => setVerificationToken(token)}
          />
        )}
        {currentStep === 'form' && (
          <FormData
            data={data}
            locks={locks}
            verificationToken={verificationToken}
            onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
            onSubmitSuccess={() => {
              stopPhoneVerifyExpiry();
              clearAllFormData();
              methodCompletedRef.current = false;
              setSelectedMethod(INITIAL_METHOD);
              setMethodView(INITIAL_METHOD);
              setCurpState(INITIAL_CURP_STATE);
              setPhoneAuth(INITIAL_PHONE_AUTH);
              setVerificationToken(null);
              navigateToStep('thankyou', true);
            }}
          />
        )}
        {currentStep === 'thankyou' && <ThankYouPage />}
      </section>

      <section className={`signup-bottom-container ${!canGoBack ? 'signup-bottom-container-centered' : ''}`}>
        <button className='signup-navigation-button signup-navigation-button-back' style={!canGoBack ? { display: 'none' } : {}} onClick={goBack} disabled={!canGoBack} aria-label="Regresar">
          <IoIosArrowBack />
          <p>Regresar</p>
        </button>
      </section>
    </div>
  )
}

export default SignUp