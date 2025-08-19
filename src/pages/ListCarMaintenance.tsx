import { useState } from 'react';
import { IonContent, IonList, IonPage, useIonViewWillEnter } from '@ionic/react';
import { Maintenance } from '../types/MaintenanceType';
import { Header } from '../components/Header';
import { ListItem } from '../components/ListItem';
import { useFetchMaintenances } from '../hooks/useFetchMaintenance';
import NoMainteinance from '../ui/NoMaintenance';
import { colors } from '../types/Color';
import Jumbotron from '../ui/Jumbotron';

function ListCarMaintenance() {
  const fetchMaintenancesData = useFetchMaintenances();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const fetchMaintenances = async () => {
    try {
      const data = await fetchMaintenancesData();
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  };

  useIonViewWillEnter(() => {
    fetchMaintenances();
  });

  return (
    <IonPage>
      <Header title="Lista Manutenzioni" />
      <IonContent fullscreen className="maintenance-content">
        {maintenances.length === 0 ? (
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
              minHeight: '420px',
              position: 'relative',
              overflow: 'hidden',
              paddingBottom: '40px',
              paddingTop: '40px',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}>
            <NoMainteinance />
          </div>
        ) : (
          <Jumbotron>
            <IonList inset={true} style={{ backgroundColor: 'transparent' }}>
              {maintenances.map((item) => (
                <ListItem key={item._id} maintenance={item} onDelete={fetchMaintenances} />
              ))}
            </IonList>
          </Jumbotron>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ListCarMaintenance;
