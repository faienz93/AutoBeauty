import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from "@ionic/react";
import { Maintenance } from "../models/MaintenanceType";
import { LimitGomme, LimitTagliando } from "../constant";
import { parseStringToDate } from "../services/utils";
import { useHistory } from 'react-router-dom';
import { useMaintenanceIcon } from "../hooks/useMaitenanceIcon";
import { pencil } from "ionicons/icons";


export const CardMaintenance = ({ tipo, maintenance, currentKm }: { tipo: string, maintenance: Maintenance, currentKm: number }) => {
  console.log('Rendering CardMaintenance component');


  const history = useHistory();
  // https://stackoverflow.com/a/59464381/4700162
  const handleEdit = (item: Maintenance) => {
    history.push({
      pathname: `/newItem/edit/${item._id}`,
      // search: '?update=true',  // query string
      state: {  // location state
        item: item,
      },
    })

  };

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

  // Calcolo dei dati reali per la manutenzione
  const tipoManutenzione = tipo;
  const dataManutenzione = maintenance?.data || 'N/A';

  const statusText = daFare ? 'DA FARE' : 'OK';



  return (
    <div style={{ margin: '16px 0' }}>
      <IonCard color='light' style={{ borderRadius: 18, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <IonCardHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <IonCardTitle style={{ fontSize: 22 }}>{tipoManutenzione}</IonCardTitle>
              <IonCardSubtitle>{dataManutenzione}</IonCardSubtitle>
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
            <div style={{ fontSize: 34, fontWeight: 600, color: daFare ? '#FF0000' : '#008000' }}>{statusText}</div>
            <div style={{ fontSize: 15, color: "#5c5c5c" }}>{maintenance.note}</div>
          </div>
          {/* <div style={{ fontSize: 16, color: "#777", minWidth: 54, textAlign: "right" }}>
            {maintenance?.note && (
              <div style={{ fontSize: 12, fontStyle: 'italic' }}>{maintenance.note}</div>
            )}
          </div> */}
        </IonCardContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 16px' }}>
            <IonButton fill="outline" onClick={() => handleEdit(maintenance)}>
              <IonIcon icon={pencil} /> Modifica
            </IonButton>
          </div>
        </div>
      </IonCard>
    </div>
  )
}
