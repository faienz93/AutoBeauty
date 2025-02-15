import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonThumbnail,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonIcon,
  IonText,
  IonButton,
  IonBadge,
  IonAlert,
} from '@ionic/react';

// import './homepage.css';
import tagliandoImg from '../assets/maintenance.svg';
import tireImg from '../assets/tire.svg';
import repairImg from '../assets/car-repair.svg';
import carImg from '../assets/car.svg';
import { Maintenance, MaintenanceType } from '../types/Maintenance';
import { calendarOutline, pencil, trashOutline } from 'ionicons/icons';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AlertConfirmation = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  console.log("Confirmation")
  return (
    <IonAlert
      isOpen={isOpen} 
      header="Alert!"
      trigger="present-alert"
      backdropDismiss={false}
      buttons={[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            onClose();
          },
        },
      ]}
      onDidDismiss={({ detail }) => console.log(`Dismissed with role: ${detail.role}`)}></IonAlert>
  );
};

function ListCarMaintenance() {
  // All'interno del tuo componente:
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [confirmDelete,setConfirmDelete] = useState(false);

  const fetchMaintenances = async () => {
    const querySnapshot = await getDocs(collection(db, 'maintenances'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Maintenance),
    }));
    setMaintenances(data);
  };

  useEffect(() => {
    fetchMaintenances();

    console.log(maintenances);
  }, []);

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
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>List Maintenance</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light" fullscreen={true}>
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

                {/* Stock Badge */}
                {/* <IonBadge color={item.stock === "INSTOCK" ? "success" : "warning"}>
                            {item.stock}
                          </IonBadge> */}
                <p>{item.note}</p>
              </IonLabel>

              {/* Price & Cart Button */}
              <IonText slot="end">
                <h2>€{item.costo}</h2>
              </IonText>

              <IonButton fill="clear" slot="end" onClick={() => alert('Edit')}>
                <IonIcon icon={pencil} />
              </IonButton>
              <IonButton fill="clear" id="present-alert" slot="end" onClick={() => setConfirmDelete(true)}>
                <IonIcon icon={trashOutline} color="danger" />
              </IonButton>              
            </IonItem>
          ))}
        </IonList>
        <AlertConfirmation isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} />
      </IonContent>
    </>
  );
}

export default ListCarMaintenance;
