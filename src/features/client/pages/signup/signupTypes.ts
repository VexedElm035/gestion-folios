export type Step = 'welcome' | 'method' | 'form' | 'thankyou';

export type SignupData = {
  nombre: string;
  apellido: string;
  edad: string;
  sexo: '' | 'M' | 'F';
  distancia: '' | '5' | '10';
  categoria: '' | 'Juvenil' | 'Libre' | 'Master';
  telefono: string;
};

export type SignupLocks = {
  telefono: boolean;
};

export type SignupMethod = 'curp' | 'telefono' | null;

export type PhoneAuthStep = 'phone' | 'code' | 'verified';

export type PhoneAuthState = {
  step: PhoneAuthStep;
  telefono: string;
  code: string;
  verifiedTelefono: string | null;
};

export type CurpState = {
  curp: string;
};
