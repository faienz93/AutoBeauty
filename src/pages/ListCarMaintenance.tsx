import { useContext, useEffect, useState } from 'react';
import { IonContent, IonThumbnail, IonItem, IonLabel, IonList, IonIcon, IonText, IonButton, IonBadge} from '@ionic/react';
import { Maintenance } from '../models/MaintenanceType';
import { calendarOutline, pencil, trashOutline } from 'ionicons/icons';
import { AlertConfirmation } from './AlertConfirmation';
import { Header } from './Header';
import { MaintenanceDbCtx } from '../App';
import { useHistory } from 'react-router-dom';
import { getMaintenanceIcon, getMaintenanceKey } from '../services/utils';


function ListCarMaintenance() {
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const db = useContext(MaintenanceDbCtx);
  const history = useHistory();

  // // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: any) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
      // search: '?update=true',  // query string
      state: {  // location state
        item, 
      },
    })
    
  };

  const fetchMaintenances = async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      console.log('Fetched docs:', result);
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
        // return new Date(b.data).getTime() - new Date(a.data).getTime();
        
        // Oppure per km decrescente
        return b.km - a.km;
      });
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  };

  useEffect(() => { 
      fetchMaintenances();
  }, []);

  

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    try {
      const doc = await db.get(maintenanceId.toString());
      const response = await db.remove(doc);
      console.log('Maintenance deleted successfully:');
      console.log(response);
      fetchMaintenances();
    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <>
      <Header title="List Maintenance" />
      <IonContent color="light" fullscreen={true}>
        {maintenances.length == 0 ? (
          <IonText color="secondary">
            <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Non ci sono Manutenzioni. Aggiungine una 😉</p>
          </IonText>
        ) : (
          <IonList inset={true}>
            {maintenances.map((item, index) => (
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  {/* <img src={`/assets/${item.image}`} alt={item.name} /> */}
                  <img src={getMaintenanceIcon(item.tipo)} alt={item.tipo} />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.tipo}</h2>
                  <IonText>
                    <p>
                      <IonIcon icon={calendarOutline} />
                      {item.data}
                    </p>
                  </IonText>

                  {/* Rating (★ Star icons) */}
                  {/* <p>
                  {Array.from({ length: 5 }, (_, i) => (
                    <IonIcon key={i} icon={i < 3 ? star : starOutline} color="warning" />
                  ))}
                </p> */}

                  {/* KM */}
                  <IonBadge color={'primary'}>KM {item.km}</IonBadge>
                  <p>{item.note}</p>
                </IonLabel>

                {/* Price & Cart Button */}
                <IonText slot="end">
                  <h2>€ {item.costo}</h2>
                </IonText>

                <IonButton fill="clear" slot="end" onClick={() => handleEdit(item)}>
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton fill="clear" id="delete-alert" slot="end" onClick={() => setConfirmDelete(true)}>
                  <IonIcon icon={trashOutline} color="danger" />
                </IonButton>
                <AlertConfirmation
                  key={index}
                  trigger="delete-alert"
                  msg='Sei sicuro di voler eliminare questa manutenzione?'
                  isOpen={confirmDelete}
                  onClose={() => setConfirmDelete(false)}
                  onConfirm={() => item._id && handleDeleteMaintenance(item._id)}
                />
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </>
  );
}

export default ListCarMaintenance;
