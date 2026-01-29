import { useEffect, useMemo, useState } from 'react'

const ThankYouPage = () => {
  const eventName = 'Carrera';
  // Ojo: tu fecha anterior (2024) ya pasó, por eso el contador quedaba en 0.
  const eventDate = useMemo(() => new Date('2026-02-22T08:00:00'), []);
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    const remaining = eventDate.getTime() - Date.now();
    return Math.max(0, remaining);
  });

  useEffect(() => {
    const tick = () => {
      const remaining = eventDate.getTime() - Date.now();
      setTimeRemaining(Math.max(0, remaining));
    };

    // Actualiza inmediatamente y luego cada segundo.
    tick();
    const countdownInterval = window.setInterval(tick, 1000);
    return () => window.clearInterval(countdownInterval);
  }, [eventDate]);

  return (
    <div className='signup-steps-container'>
      <h1 className='signup-header-text'>Gracias por registrarte!</h1>
      <h2 className='signup-header-steps-text'>Tu registro ha sido exitoso.</h2>
      <p>tu numero de folio es: nnnnnn</p>
      <p>Tu kit estara disponible en el parque central el dia 21 de febrero</p>
      <p>Nos vemos en la carrera en:</p>
      <div>
        {/* <h3>{eventDate.toLocaleDateString()}</h3> */}
        {timeRemaining === 0 ? (
          <p>¡El evento {eventName} ya comenzó!</p>
        ) : (
          <p>
            {Math.floor(timeRemaining / (1000 * 60 * 60 * 24))} días, {Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)} horas, {Math.floor((timeRemaining / (1000 * 60)) % 60)} minutos, {Math.floor((timeRemaining / 1000) % 60)} segundos
          </p>
        )}
        <p>
          {eventDate.toLocaleDateString()}
        </p>
      </div>

    </div>
  )
}

export default ThankYouPage