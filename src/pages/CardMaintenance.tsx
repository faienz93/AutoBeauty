import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { Maintenance } from "../models/Maintenance";


export const CardMaintenance = ({ tipo, maintenance }: { tipo: string, maintenance: Maintenance }) => {
    console.log('Rendering CardMaintenance component');

    return (
        <div key={tipo}>
            <IonCard color="success" style={{ flexGrow: 1 }}>
                <IonCardHeader>
                    <IonCardTitle>{tipo}</IonCardTitle>
                    <IonCardSubtitle>{maintenance?.data}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>Da Fare</IonCardContent>
            </IonCard>
        </div>
    )
}



{/* <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}>
            <IonCard style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle>KM Attuali</IonCardTitle>
                <IonCardSubtitle>28/12/2024</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>

            <IonCard color="success" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle>Tagliando</IonCardTitle>
                <IonCardSubtitle>27/12/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>Da non fare</IonCardContent>
            </IonCard>
            <IonCard color="danger" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle> Gomme</IonCardTitle>
                <IonCardSubtitle>30/10/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>DA FARE</IonCardContent>
            </IonCard>
            <IonCard color="danger" style={{ flexGrow: 1 }}>
              <IonCardHeader>
                <IonCardTitle> Revisione</IonCardTitle>
                <IonCardSubtitle>30/10/2024</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>DA FARE</IonCardContent>
            </IonCard>
          </div> */}