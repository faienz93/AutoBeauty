import StatCard from './StatCard';
import { colors } from '../types/Color';
import StatusIndicator from './StatusIndicator';
import NoMainteinance from './NoMaintenance';
import WaveBackround from './WaveBackground';
import { WelcomeSection } from './WelcomeSection';
import { icons } from '../types/Icon';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

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
        background: `linear-gradient(to bottom, ${colors.gradient1}, ${colors.gradient2}, ${colors.gradient3}, ${colors.gradient4}, ${colors.gradient5})`,
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
          <IonGrid fixed={true}>
            <IonRow>
              <IonCol>
                <StatCard icon={icons.car} label="Totale Manutenzioni" value={totalMaintenances} iconColor={colors.primary} color={colors} index={0} />
              </IonCol>
              <IonCol>
                <StatCard icon={icons.speedometer} label="Ultimo Km manuale" value={lastKm} iconColor={colors.success} color={colors} index={1} />
              </IonCol>
              <IonCol>
                <StatCard
                  icon={icons.calendar}
                  label="Giorni dall'ultima manutenzione"
                  value={daysSinceLastMaintenance}
                  color={colors}
                  iconColor={colors.warning}
                  index={2}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
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
