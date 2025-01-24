import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import Dexie from 'dexie';
import D from 'i18n';
import { unregister } from '../serviceWorkerRegistration';
import './devtools.css';
import { seedData } from 'utils/functions/seeder';

export const DevTools = () => {
  const handleDeleteAll = async () => {
    try {
      const databases = await Dexie.getDatabaseNames();
      await Promise.all(databases.map(db => Dexie.delete(db)));
      unregister();
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      window.localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error(`Error deleting the database`, e);
    }
  };
  return (
    <div id="dev-tools" aria-label="DevTools">
      <div>🛠</div>
      <div className="tools">
        <Button
          variant="contained"
          color="danger"
          onClick={handleDeleteAll}
          startIcon={<DeleteIcon />}
        >
          {D.deleteAll}
        </Button>

        <Button variant="contained" onClick={seedData}>
          Importer des données de test
        </Button>
      </div>
    </div>
  );
};
