import { useMemo } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../types/MaintenanceType';
import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import { Header } from '../components/Header';
import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../types/KilometersType';
import { calculateDaysSinceLastMaintenance, getDateToString, getStringToDate } from '../utils/dateUtils';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import { getMaintenanceWithHigherKm, getGroupByMaintenanceByKm, getMaxKmBetween } from '../utils/pouchDBUtils';
import { useFetchManualKm } from '../hooks/useFetchManualKm';
import PageHeader from '../ui/PageHeader';
import WaveBackround from '../ui/WaveBackground';

const HomePage = () => {
  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateToString(),
    km: 0,
  });

  const fetchMaintenances = useFetchMaintenances();
  const fetchManualKm = useFetchManualKm();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const maxMaintenanceKm = useMemo(() => {
    return getMaintenanceWithHigherKm(maintenances);
  }, [maintenances]);

  const groupedMaintenance = useMemo(() => {
    return getGroupByMaintenanceByKm(maintenances);
  }, [maintenances]) as Stats;

  const isWrongKilometers = useMemo(() => lastManualKm.km < maxMaintenanceKm, [maxMaintenanceKm, lastManualKm.km]);

  useIonViewWillEnter(() => {
    const loadData = async () => {
      try {
        const [maintenancesData, manualKmData] = await Promise.all([fetchMaintenances(), fetchManualKm()]);

        setMaintenances(maintenancesData);
        setLastManualKm({
          _id: manualKmData._id || '',
          _rev: manualKmData._rev || '',
          km: manualKmData.km || 0,
          data: getDateToString(getStringToDate(manualKmData.data)),
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  });

  return (
    <IonPage>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <PageHeader
          totalMaintenances={maintenances.length}
          lastManualKm={lastManualKm.km}
          maxMaintenanceKm={maxMaintenanceKm}
          daysSinceLastMaintenance={maintenances.length > 0 ? calculateDaysSinceLastMaintenance(maintenances[0]?.data) : 0}
          hasMaintenances={maintenances.length > 0}
          isWrongKilometers={isWrongKilometers}
        />

        {maintenances.length > 0 &&
          Object.entries(groupedMaintenance ?? {}).map(([category, maintenance]) => (
            <CardMaintenance key={category} category={category} maintenance={maintenance} maxKm={getMaxKmBetween(lastManualKm.km, maxMaintenanceKm)} />
          ))}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
