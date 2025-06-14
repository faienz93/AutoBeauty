import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { informationCircle, cloudUpload, create, list, speedometer } from 'ionicons/icons';

const InfoPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Informazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Come utilizzare l'app</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={create} slot="start" />
              <IonLabel>
                <h2>Aggiungi Manutenzione</h2>
                <p>Inserisci nuovi interventi di manutenzione con data, km, tipo e costo</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={list} slot="start" />
              <IonLabel>
                <h2>Visualizza Storia</h2>
                <p>Consulta lo storico completo degli interventi</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={cloudUpload} slot="start" />
              <IonLabel>
                <h2>Importa/Esporta</h2>
                <p>Gestisci i tuoi dati tramite file CSV</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={speedometer} slot="start" />
              <IonLabel>
                <h2>Traccia Chilometri</h2>
                <p>Tieni sotto controllo il chilometraggio del veicolo</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default InfoPage;