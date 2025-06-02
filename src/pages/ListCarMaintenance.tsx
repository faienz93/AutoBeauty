import { useCallback, useEffect, useState } from 'react';
import { IonContent, IonList, IonPage, IonText} from '@ionic/react';
import { Maintenance } from '../models/MaintenanceType';
import { Header } from '../components/Header';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { getMaintenanceKey, parseStringToDate } from '../services/utils';
import { ListItem } from '../components/ListItem';


function ListCarMaintenance() {
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  
  const db = useMaintenanceDb();

  const fetchMaintenances = useCallback(async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      console.log('Fetched docs ----->:', result);
      const data = result.rows.
      filter((value) => {
        // filtra solo i documenti che hanno une specifica chiave
        let key = getMaintenanceKey()
        return value.doc?._id.startsWith(key);
      })
      .map((row: any) => ({
        id: row.doc._id,
        ...row.doc
      }))
      .sort((a: Maintenance, b: Maintenance) => {
        // Ordina per data decrescente
        return new Date(parseStringToDate(b.data)).getTime() - new Date(parseStringToDate(a.data)).getTime();
        
        // Oppure per km decrescente
        // return b.km - a.km;
      });
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  }, [db]);

  useEffect(() => { 
      fetchMaintenances();
  }, []);
  
  return (
    <IonPage>
      <Header title="List Maintenance" />
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
