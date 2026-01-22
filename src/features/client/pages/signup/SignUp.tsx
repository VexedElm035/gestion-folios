import { useState, useEffect } from 'react';
import { WelcomeMessage, SignUpMethod, FormData, ThankYouPage } from './steps';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './signup.css'
import Options from '@/components/options/Options';
import type { SignupData, SignupLocks, Step } from './signupTypes';

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

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [history, setHistory] = useState<Step[]>(['welcome']);

  const [data, setData] = useState<SignupData>(INITIAL_DATA);
  const [locks, setLocks] = useState<SignupLocks>(INITIAL_LOCKS);

  useEffect(() => {
    const handdlePopState = (event: PopStateEvent) => {
      if (event.state?.step){
        const step = event.state.step as Step;
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
  }, []);

  const navigateToStep = (step: Step, pushToHistory = true) => {
    setCurrentStep(step);
    if (pushToHistory) {
      window.history.pushState({step}, '');
      setHistory((prev) => [...prev, step]);
    }
  };

  const goBack = () => {
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
        {currentStep === 'welcome' && <WelcomeMessage />}
        {currentStep === 'method' && (
          <SignUpMethod
          onNext={() => navigateToStep('form', true)}
          onPrefill={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          onLock={(patch) => setLocks((prev) => ({ ...prev, ...patch }))}
          />
        )}
        {currentStep === 'form' && (
          <FormData
          data={data}
          locks={locks}
          onChange={(patch) => setData((prev) => ({ ...prev, ...patch }))}
          onSubmitSuccess={() => navigateToStep('thankyou', true)}
          />
        )}
        {currentStep === 'thankyou' && <ThankYouPage />}
      </section>

      <section className='signup-bottom-container'>
        <button onClick={goBack} disabled={!canGoBack} aria-label="Regresar">
          <IoIosArrowBack size={30} />
        </button>
        <button onClick={goNext} disabled={!canGoNext} aria-label="Siguiente">
          <IoIosArrowForward size={30} />
        </button>
      </section>
    </div>
  )
}

export default SignUp