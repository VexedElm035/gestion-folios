/**
 * Determina la categoría del corredor según su edad y sexo.
 * @param edad - La edad del corredor
 * @param sexo - El sexo del corredor ('M' o 'F')
 * @returns La categoría correspondiente: 'Varonil', 'Femenil' o 'Infantil'
 */
export const getCategoria = (edad: string | number, sexo: string): string => {
  const edadNum = typeof edad === 'string' ? parseInt(edad, 10) : edad;
  
  if (isNaN(edadNum)) {
    return '';
  }
  
  if (edadNum < 12) {
    return 'Infantil';
  }
  
  if (sexo === 'M') {
    return 'Varonil';
  }
  
  if (sexo === 'F') {
    return 'Femenil';
  }
  
  return '';
};
