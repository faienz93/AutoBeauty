import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonButton } from '@ionic/react';
import { informationCircle, cloudUpload, create, list, speedometer, calculator, cafe, build, time, car } from 'ionicons/icons';

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
            <IonCardTitle>Calcolo Manutenzioni</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={car} slot="start" />
              <IonLabel className="ion-text-wrap">
                <h2>Gomme</h2>
                <p>Viene segnalato quando la differenza tra i km attuali e quelli dell'ultimo cambio supera 40.000 km</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={build} slot="start" />
              <IonLabel className="ion-text-wrap">
                <h2>Tagliando</h2>
                <p>Viene segnalato quando la differenza tra i km attuali e quelli dell'ultimo tagliando supera 15.000 km</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={time} slot="start" />
              <IonLabel className="ion-text-wrap">
                <h2>Revisione</h2>
                <p>Viene segnalato quando sono trascorsi 24 mesi (2 anni) dall'ultima revisione</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="none">
              <IonLabel className="ion-text-wrap">
                <p className="ion-padding-top">
                  Il sistema mostra "Da fare" in rosso quando è necessario effettuare la manutenzione,
                  altrimenti viene mostrato "Tutto sotto controllo" in verde.
                </p>
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