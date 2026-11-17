import { AppError } from '../domain/AppError.js';
import { Prestamo } from '../domain/Prestamo.js';
import { validarId } from '../domain/validaciones.js';

export class PrestamoService {
  constructor({ db, libroDao, socioDao, prestamoDao }) {
    this.db = db;
    this.libroDao = libroDao;
    this.socioDao = socioDao;
    this.prestamoDao = prestamoDao;
    this.crearPrestamoAtomico = db.transaction((prestamo) => {
      const socio = this.socioDao.buscarPorId(prestamo.socioId);
      if (!socio) throw new AppError(404, 'SOCIO_NO_ENCONTRADO', 'No se encontró el socio solicitado.');
      if (socio.bloqueado) throw new AppError(409, 'SOCIO_BLOQUEADO', 'El socio está bloqueado y no puede pedir préstamos.');

      const libro = this.libroDao.buscarPorId(prestamo.libroId);
      if (!libro) throw new AppError(404, 'LIBRO_NO_ENCONTRADO', 'No se encontró el libro solicitado.');
      if (this.socioDao.contarPrestamosActivos(socio.id) >= 3) {
        throw new AppError(409, 'LIMITE_PRESTAMOS', 'El socio ya tiene 3 préstamos activos.');
      }
      if (libro.ejemplaresDisponibles < 1) {
        throw new AppError(409, 'SIN_STOCK', 'No hay ejemplares disponibles para prestar.');
      }

      const nuevoPrestamo = this.prestamoDao.crear(prestamo);
      this.libroDao.ajustarDisponibles(libro.id, -1);
      return nuevoPrestamo;
    });
    this.devolverAtomico = db.transaction(({ id, fecha }) => {
      const prestamo = this.prestamoDao.buscarPorId(id);
      if (!prestamo) throw new AppError(404, 'PRESTAMO_NO_ENCONTRADO', 'No se encontró el préstamo solicitado.');
      if (!prestamo.activo) throw new AppError(409, 'PRESTAMO_YA_DEVUELTO', 'El préstamo ya fue devuelto.');
      if (fecha < prestamo.fechaPrestamo) {
        throw new AppError(400, 'FECHA_DEVOLUCION_INVALIDA', 'La fecha de devolución no puede ser anterior a la fecha del préstamo.');
      }
      const devuelto = this.prestamoDao.registrarDevolucion(id, fecha);
      if (!devuelto) throw new AppError(409, 'PRESTAMO_YA_DEVUELTO', 'El préstamo ya fue devuelto.');
      this.libroDao.ajustarDisponibles(prestamo.libroId, 1);
      return devuelto;
    });
  }

  listar() {
    return this.prestamoDao.listar();
  }

  obtener(id) {
    const prestamo = this.prestamoDao.buscarPorId(validarId(id));
    if (!prestamo) throw new AppError(404, 'PRESTAMO_NO_ENCONTRADO', 'No se encontró el préstamo solicitado.');
    return prestamo;
  }

  crear(datos) {
    return this.crearPrestamoAtomico(new Prestamo(datos));
  }

  devolver(id) {
    const prestamoId = validarId(id);
    const fecha = new Date().toISOString().slice(0, 10);
    return this.devolverAtomico({ id: prestamoId, fecha });
  }
}
