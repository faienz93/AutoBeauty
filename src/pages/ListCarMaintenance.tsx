import React, { useContext, useEffect, useState } from 'react';
import { IonContent, IonThumbnail, IonItem, IonLabel, IonList, IonIcon, IonText, IonButton, IonBadge} from '@ionic/react';

// import './homepage.css';
import tagliandoImg from '../assets/maintenance.svg';
import tireImg from '../assets/tire.svg';
import repairImg from '../assets/car-repair.svg';
import carImg from '../assets/car.svg';
import { Maintenance, MaintenanceType } from '../models/Maintenance';
import { calendarOutline, pencil, trashOutline } from 'ionicons/icons';
import { AlertConfirmation } from './AlertConfirmation';
import { Header } from './Header';
import { DatabaseContext } from '../App';


function ListCarMaintenance() {
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const db = useContext(DatabaseContext);

  useEffect(() => { 
      fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      console.log('Fetched docs:', result);
      const data = result.rows.map((row: any) => ({
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

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    try {
      const doc = await db.get(maintenanceId.toString());
      const response = await db.remove(doc);
      console.log('Maintenance deleted successfully:');
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getMaintenanceIcon = (type: MaintenanceType): string => {
    switch (type) {
      case 'Tagliando':
        return tagliandoImg;
      case 'Gomme':
        return tireImg;
      case 'Revisione':
        return repairImg;
      default:
        return carImg;
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

                <IonButton fill="clear" slot="end" onClick={() => alert('Edit')}>
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
