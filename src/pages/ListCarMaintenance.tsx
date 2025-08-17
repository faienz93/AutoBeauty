import { useCallback, useState } from 'react';
import { IonContent, IonList, IonPage, IonText, useIonViewWillEnter } from '@ionic/react';
import { Maintenance } from '../types/MaintenanceType';
import { Header } from '../components/Header';
import { ListItem } from '../components/ListItem';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';

function ListCarMaintenance() {
  const fetchMaintenancesData = useFetchMaintenances();
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const db = useMaintenanceDb();

  const fetchMaintenances = useCallback(async () => {
    try {
      const data = await fetchMaintenancesData();
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  }, [db]);

  useIonViewWillEnter(() => {
    fetchMaintenances();
  });

  return (
    <IonPage>
      <Header title="Lista Manutenzioni" />
      <IonContent color="light" fullscreen={true}>
        {maintenances.length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          <IonList inset={true}>
            {maintenances.map((item, index) => (
              <ListItem key={index} maintenance={item} onDelete={fetchMaintenances} />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ListCarMaintenance;
