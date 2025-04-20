import { Header } from './Header';
import { IonContent } from '@ionic/react';
import ImportItem from './ImportItem';
import ExportItem from './ExportItem';



const Setting = () => {
  

  return (
    <>
      <Header title="Setting" />
      <IonContent color="light">
        <ImportItem />
        <ExportItem />
      </IonContent>
    </>
  );
};

export default Setting;
