import { createApp } from './app.js';
import { createDatabase } from './dao/database.js';

const port = Number(process.env.PORT ?? 3000);
const db = createDatabase(process.env.DATABASE_PATH);
const app = createApp({ db });
const server = app.listen(port, () => {
  console.log(`API de biblioteca escuchando en http://localhost:${port}`);
});

function cerrarServidor() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', cerrarServidor);
process.on('SIGTERM', cerrarServidor);
