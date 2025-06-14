import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonButton } from '@ionic/react';
import { informationCircle, cloudUpload, create, list, speedometer, calculator, cafe } from 'ionicons/icons';

const InfoPage: React.FC = () => {
  const openDonationLink = (platform: 'buymeacoffee' | 'paypal') => {
    const links = {
      buymeacoffee: 'https://www.buymeacoffee.com/faienz93',
      paypal: 'https://www.paypal.com/paypalme/afaienza93'
    };
    window.open(links[platform], '_blank');
  };

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
            <IonCardTitle>Funzionalità Principali</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={create} slot="start" />
              <IonLabel>
                <h2>Registra Manutenzione</h2>
                <p>Inserisci data, chilometri, tipo di intervento e costo</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={list} slot="start" />
              <IonLabel>
                <h2>Storico Completo</h2>
                <p>Visualizza tutti gli interventi effettuati</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={cloudUpload} slot="start" />
              <IonLabel>
                <h2>Importazione/Esportazione</h2>
                <p>Gestisci i dati tramite file CSV</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Come Vengono Calcolati i Costi</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={calculator} slot="start" />
              <IonLabel className="ion-text-wrap">
                <h2>Calcolo dei Costi</h2>
                <p>• Costo totale: somma di tutti gli interventi</p>
                <p>• Costo mensile: media delle spese negli ultimi 30 giorni</p>
                <p>• Costo annuale: totale spese degli ultimi 12 mesi</p>
                <p>• Costo per km: totale spese diviso km percorsi</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Supporta l'App</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p className="ion-padding-bottom">
              Car Maintenance App è completamente gratuita e open source. Se trovi l'app utile, puoi supportare lo sviluppo con una donazione:
            </p>
            
            <IonButton 
              expand="block"
              onClick={() => openDonationLink('buymeacoffee')}
              className="ion-margin-bottom">
              <IonIcon icon={cafe} slot="start" />
              Offrimi un caffè
            </IonButton>

            <IonButton 
              expand="block"
              color="secondary"
              onClick={() => openDonationLink('paypal')}>
              Dona con PayPal
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default InfoPage;