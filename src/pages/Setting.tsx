import { Header } from '../components/Header';
import { IonContent } from '@ionic/react';
import ImportItem from '../components/ImportItem';
import ExportItem from '../components/ExportItem';
import DeleteAllItem from '../components/DeleteAllItems';



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
