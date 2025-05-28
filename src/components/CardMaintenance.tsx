import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from "@ionic/react";
import { Maintenance } from "../models/MaintenanceType";
import { LimitGomme, LimitTagliando } from "../constant";
import { parseStringToDate } from "../services/utils";
import { cloudOutline } from "ionicons/icons";
import { useMaintenanceIcon } from "../hooks/useMaitenanceIcon";


export const CardMaintenance = ({ tipo, maintenance, currentKm }: { tipo: string, maintenance: Maintenance, currentKm: number }) => {
  console.log('Rendering CardMaintenance component');

  const kmUltimoIntervento = maintenance?.km;
  const diffKm = currentKm - kmUltimoIntervento;

  let daFare = false;
  if (tipo === 'Gomme') daFare = diffKm >= LimitGomme;
  if (tipo === 'Tagliando') daFare = diffKm >= LimitTagliando;
  if (tipo === 'Revisione') {
    const dataUltimaRevisione = parseStringToDate(maintenance?.data);
    const dataAttuale = new Date();
    const mesiPassati =
      (dataAttuale.getFullYear() - dataUltimaRevisione.getFullYear()) * 12 +
      (dataAttuale.getMonth() - dataUltimaRevisione.getMonth());

    daFare = mesiPassati >= 24; // 24 mesi = 2 anni
  }

  const city = "Roma"
  const subtitle = "Lazio, Italia"
  const temperature = 27
  const humidity = 41
  const time = "15:12"
  const color = 'light'; // "success" | "warning" | "danger" | "light"


  return (
    // <div key={tipo}>
    //     <IonCard color={daFare ? "warning" : "success"} style={{ flexGrow: 1 }}>
    //         <IonCardHeader>
    //             <IonCardTitle>{tipo}</IonCardTitle>
    //             <IonCardSubtitle>{maintenance?.data}</IonCardSubtitle>
    //         </IonCardHeader>
    //         <IonCardContent> {daFare ? "Da fare" : "Da non fare"}</IonCardContent>
    //     </IonCard>
    // </div>
    <div style={{ margin: '16px 0' }}>
      <IonCard color={color} style={{ borderRadius: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <IonCardHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <IonCardTitle style={{ fontSize: 22 }}>{city}</IonCardTitle>
              <IonCardSubtitle>{subtitle}</IonCardSubtitle>
            </div>
            {/* <IonIcon icon={cloudOutline} style={{ fontSize: 38, color: "var(--ion-color-medium)" }} /> */}
            <IonThumbnail slot="start" style={{ fontSize: 38, color: "var(--ion-color-medium)" }}>
              {/* <img src={`/assets/${item.image}`} alt={item.name} /> */}
              <img src={useMaintenanceIcon(maintenance.tipo)} alt={maintenance.tipo} />
            </IonThumbnail>
          </div>
        </IonCardHeader>
        <IonCardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: 600 }}>{temperature}°</div>
            <div style={{ fontSize: 15, color: "#5c5c5c" }}>Umidità: {humidity}%</div>
          </div>
          <div style={{ fontSize: 16, color: "#777", minWidth: 54, textAlign: "right" }}>{time}</div>
        </IonCardContent>
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