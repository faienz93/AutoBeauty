import { useCallback, useMemo } from 'react';
import { useState } from 'react';
import { Maintenance, Stats } from '../models/MaintenanceType';
import { IonContent, IonCard, IonText, IonPage, useIonViewWillEnter } from '@ionic/react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { Header } from '../components/Header';
import { CardMaintenance } from '../components/CardMaintenance';
import { Kilometers } from '../models/KilometersType';
import { getDateString, parseStringToDate } from '../services/utils';
import { LastKmFinded } from '../components/LastKmFinded';
import { useKilometersDb, useMaintenanceDb } from '../hooks/useDbContext';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import { getMaintenanceWithHigherKm, getGroupByMaintenanceByKm, getMaxKmBetween } from '../utils/utils';
import { useFetchManualKm } from '../hooks/useFetchManualKm';




const HomePage = () => {

  const today = getDateString();
  const maintenancesData = useFetchMaintenances();
  const manualKm = useFetchManualKm();
  const db = useMaintenanceDb();
  const dbKm = useKilometersDb();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const maintenanceWithHigherKm = useMemo(() => {
    return getMaintenanceWithHigherKm(maintenances);
  }, [maintenances]) as Maintenance;

  const groupedMaintenance = useMemo(() => {
    return getGroupByMaintenanceByKm(maintenances);
  }, [maintenances]) as Stats;

  const [lastManualKm, setLastManualKm] = useState<Kilometers>({
    data: getDateString(),
    km: 0
  });

  const fetchMaintenances = useCallback(async () => {
    try {
      const data = await maintenancesData()
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  }, [db]);





  const getLatestManualKilometers = useCallback(async () => {

    const lastKm = await manualKm();


    // 4. Imposto lo stato con il valore e la data massima
    setLastManualKm({
      _id: lastKm._id || '',
      _rev: lastKm._rev || '',
      km: lastKm.km || 0,
      data: getDateString(parseStringToDate(lastKm.data)),
    });


  }, [dbKm]);

  useIonViewWillEnter(() => {
    fetchMaintenances();
    getLatestManualKilometers();
    
  });


  return (
    <IonPage>
      <Header title="Home" showBackButton={false} />
      <IonContent>
        <IonCard style={{ flexGlow: 1, borderRadius: 18, boxShadow: `0 4px 12px` }}>
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
          Object.entries(groupedMaintenance).map(([tipo, maintenance]) => (
            <CardMaintenance key={tipo} tipo={tipo} maintenance={maintenance} maxKm={getMaxKmBetween(lastManualKm, maintenanceWithHigherKm as Maintenance).km} />
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
