import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonThumbnail } from "@ionic/react";
import { useMaintenanceIcon } from "../hooks/useMaitenanceIcon";
import { pencil } from "ionicons/icons";
import { MaintenanceType } from "../models/MaintenanceType";
interface CardProps {
    title: string,
    subtitle?: string,
    mainNote?: string,
    comment?: string,
    id: any,
    shadowColor: string,
    iconContent: {
        type: 'image' | 'icon';
        source: string | typeof pencil; // esempio di icona, aggiorna in base alle tue necessità
        alt?: string;
    };
    daFare?: boolean | undefined,
    onEdit(): void 
}
export const Card = ({title, subtitle, mainNote, comment, id, shadowColor, iconContent, daFare, onEdit} : CardProps) => {

    const getTextColor = () => {
        if (daFare === undefined) return '#000000';
        return daFare ? '#FF0000' : '#008000';
    };

    const renderIcon = () => {
        if (iconContent.type === 'image') {
            return (
                <IonThumbnail slot="start" style={{ fontSize: 38, color: "var(--ion-color-medium)" }}>
                    <img src={iconContent.source as string} alt={iconContent.alt || ''} />
                </IonThumbnail>
            );
        }
        return (
            <IonIcon 
                icon={iconContent.source as typeof pencil} 
                style={{ fontSize: 38, color: "var(--ion-color-medium)" }} 
            />
        );
    };

    return (
        <div style={{ margin: '16px 0' }}>
            <IonCard color='light' style={{ borderRadius: 18, boxShadow: `0 4px 12px ${shadowColor}` }}>
                <IonCardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <IonCardTitle style={{ fontSize: 22 }}>{title}</IonCardTitle>
                            <IonCardSubtitle>{subtitle}</IonCardSubtitle>
                        </div>
                        {renderIcon()}
                    </div>
                </IonCardHeader>
                <IonCardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 34, fontWeight: 600, color: getTextColor() }}>{mainNote}</div>
                        <div style={{ fontSize: 15, color: "#5c5c5c" }}>{comment}</div>
                    </div>
                    {/* <div style={{ fontSize: 16, color: "#777", minWidth: 54, textAlign: "right" }}>
                {maintenance?.note && (
                  <div style={{ fontSize: 12, fontStyle: 'italic' }}>{maintenance.note}</div>
                )}
              </div> */}
                </IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 16px' }}>
                        <IonButton
                            fill="outline"
                            style={{
                                '--color': shadowColor ,
                                '--border-color': shadowColor ,
                                '--border-width': '2px',
                                '--border-style': 'solid',
                                '--border-radius': '50%',
                                '--background': 'light',
                            } as React.CSSProperties}
                            onClick={onEdit}
                        >
                            <IonIcon slot="icon-only" icon={pencil} />
                        </IonButton>
                    </div>
                </div>
            </IonCard>
        </div>
    )
}