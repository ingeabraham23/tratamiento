import Dexie from 'dexie';

const db = new Dexie('MedicationAppDatabase');

db.version(4).stores({
  medications: '++id,nombre',
  recetas: '++id,pacienteNombre',
});

export default db;