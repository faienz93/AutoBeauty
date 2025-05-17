
import { v4 as uuidv4 } from 'uuid';

export const getDateString = () => {
    return new Date().toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getMaintenanceKey = () => {
  return 'mnt-';
}

export const getUUIDKey = () => {
  // return 'mnt-' + Date.now();
  return getMaintenanceKey() + uuidv4();
}