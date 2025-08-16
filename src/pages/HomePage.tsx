import { useCallback, useMemo } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonPage, useIonViewWillEnter } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';
import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../utils/dateUtils';
import { LastKmFinded } from '../components/LastKmFinded';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import { getMaintenanceWithHigherKm, getGroupByMaintenanceByKm, getMaxKmBetween } from '../utils/pouchDBUtils';
import { useFetchManualKm } from '../hooks/useFetchManualKm';

const HomePage = () => {
  const today = getDateString();
  const fetchMaintenances = useFetchMaintenances();
  const fetchManualKm = useFetchManualKm();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const maintenanceWithHigherKm = useMemo(() => {
    return getMaintenanceWithHigherKm(maintenances);
  }, [maintenances]) as Maintenance;

  const groupedMaintenance = useMemo(() => {
    return getGroupByMaintenanceByKm(maintenances);
  }, [maintenances]) as Stats;

  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0,
  });

  const fetchMaintenancesCallback = useCallback(async () => {
    try {
      const data = await fetchMaintenances();
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  }, [fetchMaintenances]);

  const getLatestManualKilometers = useCallback(async () => {
    const lastKm = await fetchManualKm();
    setLastManualKm({
      _id: lastKm._id || '',
      _rev: lastKm._rev || '',
      km: lastKm.km || 0,
      data: getDateString(parseStringToDate(lastKm.data)),
    });
  }, [fetchManualKm]);

  useMemo(() => {
    getLatestManualKilometers();
  }, [getLatestManualKilometers]);

  const loadData = useCallback(async () => {
    await fetchMaintenancesCallback();
    await getLatestManualKilometers();
  }, [fetchMaintenancesCallback, getLatestManualKilometers]);

  useIonViewWillEnter(() => {
    loadData();
  });

  return (
    <IonPage>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <IonCard style={{ flexGlow: 1, borderRadius: '0.5em', boxShadow: '0 4px 12px' }}>
          <IonCardHeader>
            <IonCardTitle>Data odierna</IonCardTitle>
            <IonCardSubtitle>{today}</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
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
