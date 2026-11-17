import { createDatabase } from './dao/database.js';

const db = createDatabase(process.env.DATABASE_PATH);
const insertarLibro = db.prepare(`
  INSERT OR IGNORE INTO libros (isbn, titulo, autor, ejemplares_totales, ejemplares_disponibles)
  VALUES (?, ?, ?, ?, ?)
`);
const insertarSocio = db.prepare(`
  INSERT OR IGNORE INTO socios (documento, nombre, email, bloqueado)
  VALUES (?, ?, ?, ?)
`);

const cargarEjemplos = db.transaction(() => {
  insertarLibro.run('978-987-629-507-1', 'El principito', 'Antoine de Saint-Exupéry', 2, 2);
  insertarLibro.run('978-950-07-0001-5', 'Cuentos de la selva', 'Horacio Quiroga', 1, 1);
  insertarSocio.run('30111222', 'Ana Pérez', 'ana@example.com', 0);
  insertarSocio.run('28999888', 'Tomás Gómez', 'tomas@example.com', 0);
  insertarSocio.run('20000111', 'Socio Bloqueado', 'bloqueado@example.com', 1);
});

cargarEjemplos();
db.close();
console.log('Datos de ejemplo cargados (sin duplicar registros existentes).');
