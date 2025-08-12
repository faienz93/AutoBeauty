import { IonInput, IonDatetime, IonPopover, IonContent } from '@ionic/react';

interface DataPickerPopouProps {
  title: string;
  currentDate: string;
  onChange(inputIdentifier: any, newValue: any): void;
}
// https://www.damirscorner.com/blog/posts/20220107-DatePickerPopupInIonic6.html
const DataPickerPopup: React.FC<DataPickerPopouProps> = ({ title, currentDate, onChange }) => {
  const handleDateChange = (isoDate: any) => {
    const date = new Date(isoDate);
    onChange('data', date);
  };
  return (
    <>
      <IonInput label={title} value={currentDate} id="click-trigger" className="ion-text-end"></IonInput>
      <IonPopover trigger="click-trigger" side="top" alignment="center" triggerAction="click">
        <IonContent class="ion-padding">
          {/* <IonDatetime presentation="date" onIonChange={(e) => onChange('data', e.detail.value)}></IonDatetime> */}
          <IonDatetime presentation="date" onIonChange={(e) => handleDateChange(e.detail.value)}></IonDatetime>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default DataPickerPopup;
