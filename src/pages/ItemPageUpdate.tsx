import { useParams } from 'react-router-dom';
import NewMaintenance from './NewMaintenance';
import { useMaintenanceDb } from '../hooks/useDbContext';
import { useState, useEffect } from 'react';
import { Maintenance } from '../models/MaintenanceType';

const ItemPageUpdate = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const db = useMaintenanceDb();
  const [item, setItem] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.get(id)
      .then((fetched) => {
        setItem(fetched);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Errore nel recupero item', error);
        setLoading(false);
      });
  }, [id, db]);

  if (loading) return <div>Caricamento…</div>;
  if (!item) return <div>Item non trovato</div>;

  return <NewMaintenance editingItem={item} key={id} />;
};

export default ItemPageUpdate;
