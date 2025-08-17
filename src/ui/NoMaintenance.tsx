import { colors } from '../types/Color';
import { Emojis, emojisIcon } from '../types/Icon';

const NoMainteinance: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', margin: '0 auto 32px auto', maxWidth: '600px' }}>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px 24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emojisIcon.settings}</div>
        <h3 style={{ color: colors.white, fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0' }}>Non ci sono Manutenzioni</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          Inizia a tracciare le manutenzioni del tuo veicolo per tenere tutto sotto controllo
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '25px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            color: colors.white,
          }}>
          {emojisIcon.lightbulb} Aggiungine una per iniziare {emojisIcon.smile}!
        </div>
      </div>
    </div>
  );
};

export default NoMainteinance;
