import { IonInput, IonDatetime, IonPopover, IonContent } from "@ionic/react";
import { useState, useRef } from "react";

// https://www.damirscorner.com/blog/posts/20220107-DatePickerPopupInIonic6.html
const DataPickerPopup = ({ title, currentDate, onChange }) => {
  return (
    <>
      <IonInput label={title} value={currentDate} id="click-trigger" className="ion-text-end"></IonInput>
      <IonPopover trigger="click-trigger" side="top" alignment="center" triggerAction="click">
        <IonContent class="ion-padding">
          <IonDatetime presentation="date" onIonChange={(e) => onChange('data', e.detail.value)}></IonDatetime>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default DataPickerPopup;
