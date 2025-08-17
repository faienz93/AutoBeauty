import { getDateString } from '../utils/dateUtils';
import StatCard from './StatCard';
import { colors } from '../types/Color';
import { emojisIcon, icons } from '../types/Icon';
import StatusIndicator from './StatusIndicator';
import NoMainteinance from './NoMaintenance';
import WaveBackround from './WaveBackground';

const PageHeader = ({
  userName = 'Utente',
  totalMaintenances = 12,
  lastKm = 45780,
  daysSinceLastMaintenance = 15,
  hasMaintenances = true,
  isWrongKilometers = true,
}) => {
  const getStatusMessage = () => {
    if (!hasMaintenances) {
      return { text: 'Inizia aggiungendo una manutenzione', color: colors.secondary };
    }

    if (daysSinceLastMaintenance > 30) {
      return { text: 'Manutenzione raccomandata', color: colors.warning };
    } else if (daysSinceLastMaintenance > 60) {
      return { text: 'Manutenzione urgente', color: colors.danger };
    } else {
      return { text: 'Stato veicolo ottimale', color: colors.success };
    }
  };

  const status = getStatusMessage();

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
        minHeight: '420px',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '40px',
      }}>
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '-30px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '32px 16px 0',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: window.innerWidth <= 768 ? '32px' : '42px',
              fontWeight: '700',
              color: colors.white,
              margin: '0 0 16px 0',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
            Ciao, {userName}! {emojisIcon.hand}
          </h1>

          {/* Date Indicator */}
          <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', fontWeight: '500' }}>
            {emojisIcon.calendar} {getDateString()}
          </div>

          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.5',
            }}>
            {hasMaintenances ? 'Benvenuto nel tuo centro di controllo per la manutenzione del veicolo' : 'Inizia a tracciare le manutenzioni del tuo veicolo'}
          </p>
        </div>

        {hasMaintenances ? (
          /* Stats Cards Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
              maxWidth: '900px',
              margin: '0 auto 32px auto',
            }}>
            <StatCard icon={icons.car} label="Totale Manutenzioni" value={totalMaintenances} iconColor={colors.primary} color={colors} index={0} />
            <StatCard icon={icons.speedometer} label="Ultimi km Registrati" value={lastKm} iconColor={colors.success} color={colors} index={1} />
            <StatCard
              icon={icons.calendar}
              label="Giorni dall'ultima manutenzione"
              value={daysSinceLastMaintenance}
              color={colors}
              iconColor={colors.warning}
              index={2}
            />
          </div>
        ) : (
          <NoMainteinance />
        )}

        {/* Status Indicator */}
        <StatusIndicator status={status} textColor={colors.white} />

        {/* status isWrongMaintenance */}
        {isWrongKilometers && (
          <StatusIndicator
            status={{
              text: 'Attenzione: il kilometraggio manuale (${lastManualKm.km} km) è inferiore al massimo registrato (${maintenanceWithHigherKm.km} km). Verrà usato il valore più alto.',
              color: colors.danger,
            }}
            textColor={colors.white}
          />
        )}
      </div>

      {/* Bottom wave decoration */}
      <WaveBackround />
    </div>
  );
};

export default PageHeader;
