import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAccordionGroup,
  IonAccordion,
  IonDatetimeButton,
  IonDatetime
} from '@ionic/react';





function NewItemPage() {
  console.log('Rendering NewItem component');





  // const nextTagliando = () => {
  //   const lastTagliando = maintenances.filter(m => m.type === 'Tagliando').pop();
  //   if (lastTagliando) {
  //     return lastTagliando.km + 15000;
  //   }
  //   return 15000;
  // };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Maintenance</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen class="component-content">
          <IonList inset={true}>
            <IonItem lines="inset" slot="header">
              <IonLabel position="floating">Data</IonLabel>
              <IonInput type="date"></IonInput>
            </IonItem>
            <IonItem lines="inset" slot="header">
              <IonLabel position="floating">Km</IonLabel>
              <IonInput type="number" min={0}></IonInput>
            </IonItem>
            <IonItem lines="inset" slot="header">
              <IonLabel position="floating">Tipo</IonLabel>
              <IonSelect aria-label="Maintenance" interface="action-sheet" placeholder="Select Maintenance">
                <IonSelectOption value="Tagliando">Tagliando</IonSelectOption>
                <IonSelectOption value="Gomme">Gomme</IonSelectOption>
                <IonSelectOption value="Revisione">Revisione</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Costo (€)</IonLabel>
              <IonInput type="number" min={0}></IonInput>
            </IonItem>
            <IonButton expand="full">Aggiungi Manutenzione</IonButton>
          </IonList>
        </IonContent>
      </IonPage>

    </>
  );
};

export default NewItemPage;