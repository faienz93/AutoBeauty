import { Header } from './Header';
import { IonContent } from '@ionic/react';
import ImportItem from './ImportItem';
import ExportItem from './ExportItem';
import DeleteAllItem from './DeleteAllItems';



const Setting = () => {
  

  return (
    <>
      <Header title="Setting" />
      <IonContent color="light">
        <ImportItem />
        <ExportItem />
        <DeleteAllItem />
      </IonContent>
    </>
  );
};

export default Setting;
