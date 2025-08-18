import { getDateToString } from '../utils/dateUtils';
import StatCard from './StatCard';
import { colors } from '../types/Color';
import { emojisIcon, icons } from '../types/Icon';
import StatusIndicator from './StatusIndicator';
import NoMainteinance from './NoMaintenance';
import WaveBackround from './WaveBackground';
import { WelcomeSection } from './WelcomeSection';

type PageHeaderProp = {
  userName?: string;
  totalMaintenances: number;
  lastManualKm: number;
  maxMaintenanceKm: number;
  daysSinceLastMaintenance: number;
  hasMaintenances: boolean;
  isWrongKilometers: boolean;
};
const PageHeader: React.FC<PageHeaderProp> = ({
  userName,
  totalMaintenances,
  lastManualKm: lastKm,
  maxMaintenanceKm,
  daysSinceLastMaintenance,
  hasMaintenances,
  isWrongKilometers,
}) => {
  const getStatusMessage = () => {
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
        // background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
        background: `linear-gradient(to bottom, #051937, #004d7a, #008793, #00bf72, #a8eb12)`,
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
        <WelcomeSection userName={userName} hasMaintenances={hasMaintenances} />

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
            <StatCard icon={icons.speedometer} label="Ultimo Km manuale" value={lastKm} iconColor={colors.success} color={colors} index={1} />
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
        {hasMaintenances && <StatusIndicator status={status} textColor={colors.white} />}

        {/* status isWrongMaintenance */}
        {isWrongKilometers && (
          <StatusIndicator
            status={{
              text: `Il kilometraggio manuale (${lastKm} km) è inferiore al massimo registrato (${maxMaintenanceKm} km). Verrà usato il valore più alto.`,
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
