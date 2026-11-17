import express from 'express';
import { createDatabase } from './dao/database.js';
import { LibroDao } from './dao/libroDao.js';
import { SocioDao } from './dao/socioDao.js';
import { PrestamoDao } from './dao/prestamoDao.js';
import { LibroService } from './services/libroService.js';
import { SocioService } from './services/socioService.js';
import { PrestamoService } from './services/prestamoService.js';
import { LibroController } from './controllers/libroController.js';
import { SocioController } from './controllers/socioController.js';
import { PrestamoController } from './controllers/prestamoController.js';
import { crearRutasLibro } from './routes/libroRoutes.js';
import { crearRutasSocio } from './routes/socioRoutes.js';
import { crearRutasPrestamo } from './routes/prestamoRoutes.js';
import { AppError } from './domain/AppError.js';
import { validarObjeto } from './domain/validaciones.js';

export function createApp({ db = createDatabase() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use((req, _res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        validarObjeto(req.body);
      } catch (error) {
        next(error);
        return;
      }
    }
    next();
  });

  const libroDao = new LibroDao(db);
  const socioDao = new SocioDao(db);
  const prestamoDao = new PrestamoDao(db);
  const libroService = new LibroService({ libroDao, prestamoDao });
  const socioService = new SocioService({ socioDao });
  const prestamoService = new PrestamoService({ db, libroDao, socioDao, prestamoDao });

  app.get('/', (_req, res) => res.json({ mensaje: 'API de biblioteca', recursos: ['/libros', '/socios', '/prestamos'] }));
  app.use('/libros', crearRutasLibro(new LibroController({ libroService })));
  app.use('/socios', crearRutasSocio(new SocioController({ socioService })));
  app.use('/prestamos', crearRutasPrestamo(new PrestamoController({ prestamoService })));

  app.use((_req, _res, next) => next(new AppError(404, 'RUTA_NO_ENCONTRADA', 'La ruta solicitada no existe.')));
  app.use((error, _req, res, _next) => {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: { codigo: error.code, mensaje: error.message } });
      return;
    }
    if (error?.type === 'entity.parse.failed') {
      res.status(400).json({ error: { codigo: 'JSON_INVALIDO', mensaje: 'El cuerpo no contiene JSON válido.' } });
      return;
    }
    if (error?.code?.startsWith('SQLITE_CONSTRAINT_UNIQUE')) {
      res.status(409).json({ error: { codigo: 'DATO_DUPLICADO', mensaje: 'Ya existe un registro con ese ISBN, documento o email.' } });
      return;
    }
    if (error?.code?.startsWith('SQLITE_CONSTRAINT')) {
      res.status(409).json({ error: { codigo: 'RESTRICCION_DATOS', mensaje: 'La operación viola una restricción de integridad.' } });
      return;
    }
    console.error(error);
    res.status(500).json({ error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrió un error interno.' } });
  });

  app.locals.db = db;
  return app;
}
