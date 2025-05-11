import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { Maintenance } from "../models/Maintenance";
import { LimitGomme, LimitTagliando } from "../constant";


export const CardMaintenance = ({ tipo, maintenance }: { tipo: string, maintenance: Maintenance }) => {
    console.log('Rendering CardMaintenance component');

    const kmUltimoIntervento = maintenance?.km;

    const kmAttuali = 114362


    const diffKm = kmAttuali - kmUltimoIntervento;

    let daFare = false;
    if (tipo === 'Gomme') daFare = diffKm >= LimitGomme;
    if (tipo === 'Tagliando') daFare = diffKm >= LimitTagliando;
    if (tipo === 'Revisione') {
      const dataUltimaRevisione = new Date(maintenance?.data);
      console.log(maintenance)
      console.log(dataUltimaRevisione)
      const anniPassati = new Date().getFullYear() - dataUltimaRevisione.getFullYear();
      console.log(new Date().getFullYear())
      console.log(dataUltimaRevisione)
      console.log(anniPassati)
      daFare = anniPassati >= 2;

      console.log(daFare)
    }


    return (
        <div key={tipo}>
            <IonCard color={daFare ? "warning" : "success"} style={{ flexGrow: 1 }}>
                <IonCardHeader>
                    <IonCardTitle>{tipo}</IonCardTitle>
                    <IonCardSubtitle>{maintenance?.data}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent> {daFare ? "Da fare" : "Da non fare"}</IonCardContent>
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