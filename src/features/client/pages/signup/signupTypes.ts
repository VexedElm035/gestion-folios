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
