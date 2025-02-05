import { IonInput, IonDatetime, IonPopover, IonContent } from "@ionic/react";
import { useState, useRef } from "react";

// https://www.damirscorner.com/blog/posts/20220107-DatePickerPopupInIonic6.html
const DataPickerPopup = ({ title }) => {

  const [ currentDate, useCurrentDate] = useState(new Date().toLocaleDateString("it-IT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }));

  const popover = useRef<HTMLIonPopoverElement>(null);

  const handleDateChange = (e: any) => {
    const selectedDate = new Date(e.detail.value).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    useCurrentDate(selectedDate);

    if (popover.current) {
      popover.current.dismiss();
    }
  };
  return (
    <>
      <IonInput label={title} value={currentDate} id="click-trigger" className="ion-text-end"></IonInput>
      <IonPopover ref={popover} trigger="click-trigger" side="top" alignment="center" triggerAction="click">
        <IonContent class="ion-padding">
          <IonDatetime presentation="date" onIonChange={handleDateChange}></IonDatetime>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default DataPickerPopup;
