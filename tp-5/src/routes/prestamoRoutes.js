import { Router } from 'express';

export function crearRutasPrestamo(controller) {
  const router = Router();
  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', controller.crear);
  router.post('/:id/devolucion', controller.devolver);
  return router;
}
