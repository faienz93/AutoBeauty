import { IonLoading } from '@ionic/react';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}>
      <IonLoading trigger="open-loading" message="Caricamento…" spinner="circles" />
    </div>
  );
};

export default Loader;
