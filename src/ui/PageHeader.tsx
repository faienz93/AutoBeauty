import StatCard from './StatCard';
import { colors } from '../types/Color';
import StatusIndicator from './StatusIndicator';
import NoMainteinance from './NoMaintenance';
import WaveBackround from './WaveBackground';
import { WelcomeSection } from './WelcomeSection';
import { icons } from '../types/Icon';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Jumbotron from './Jumbotron';

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
    <Jumbotron>
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
              text: `Il Km manuale (${lastKm} km) < del max (${maxMaintenanceKm} km).\nSi userà il maggiore.`,
              color: colors.danger,
            }}
            textColor={colors.white}
          />
        )}
      </div>

      {/* Bottom wave decoration */}
      <WaveBackround />
    </Jumbotron>
  );
};

export default PageHeader;
