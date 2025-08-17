import { useMemo } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonText, IonPage, useIonViewWillEnter } from '@ionic/react';
import { Header } from '../components/Header';
import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../utils/dateUtils';
import { LastKmFinded } from '../components/LastKmFinded';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import { getMaintenanceWithHigherKm, getGroupByMaintenanceByKm, getMaxKmBetween } from '../utils/pouchDBUtils';
import { useFetchManualKm } from '../hooks/useFetchManualKm';
import { Card } from '../ui/Card';
import { calendar } from 'ionicons/icons';
import PageHeader from '../ui/PageHeader';

const HomePage = () => {
  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0,
  });
  const fetchMaintenances = useFetchMaintenances();
  const fetchManualKm = useFetchManualKm();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const maintenanceWithHigherKm = useMemo(() => {
    return getMaintenanceWithHigherKm(maintenances);
  }, [maintenances]) as Maintenance;

  const groupedMaintenance = useMemo(() => {
    return getGroupByMaintenanceByKm(maintenances);
  }, [maintenances]) as Stats;

  useIonViewWillEnter(() => {
    const loadData = async () => {
      try {
        // Carica in parallelo per essere più veloce
        const [maintenancesData, manualKmData] = await Promise.all([fetchMaintenances(), fetchManualKm()]);

        setMaintenances(maintenancesData);
        setLastManualKm({
          _id: manualKmData._id || '',
          _rev: manualKmData._rev || '',
          km: manualKmData.km || 0,
          data: getDateString(parseStringToDate(manualKmData.data)),
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
        <PageHeader userName="Antonio" totalMaintenances={maintenances.length} lastKm={lastManualKm.km} daysSinceLastMaintenance={15} />
        <Card title="Data Odierna" subtitle={getDateString()} layout={{ icon: { ionIcon: calendar } }} />
        <LastKmFinded lastManualKm={lastManualKm} maintenanceWithHigherKm={maintenanceWithHigherKm} />
        {groupedMaintenance && Object.keys(groupedMaintenance).length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          Object.entries(groupedMaintenance ?? {}).map(([category, maintenance]) => (
            <CardMaintenance
              key={category}
              category={category}
              maintenance={maintenance}
              maxKm={getMaxKmBetween(lastManualKm, maintenanceWithHigherKm as Maintenance).km}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
