import { AppError } from '../domain/AppError.js';
import { Socio } from '../domain/Socio.js';
import { validarId } from '../domain/validaciones.js';

const CAMPOS_SOCIO = new Set(['documento', 'nombre', 'email', 'bloqueado']);

export class SocioService {
  constructor({ socioDao }) {
    this.socioDao = socioDao;
  }

  listar() {
    return this.socioDao.listar();
  }

  obtener(id) {
    const socio = this.socioDao.buscarPorId(validarId(id));
    if (!socio) throw new AppError(404, 'SOCIO_NO_ENCONTRADO', 'No se encontró el socio solicitado.');
    return socio;
  }

  crear(datos) {
    return this.socioDao.crear(new Socio(datos));
  }

  actualizar(id, datos) {
    const socioActual = this.obtener(id);
    const desconocidos = Object.keys(datos).filter((campo) => !CAMPOS_SOCIO.has(campo));
    if (desconocidos.length) {
      throw new AppError(400, 'CAMPOS_DESCONOCIDOS', `Campos no permitidos: ${desconocidos.join(', ')}.`);
    }
    return this.socioDao.actualizar(socioActual.id, new Socio({
      documento: datos.documento ?? socioActual.documento,
      nombre: datos.nombre ?? socioActual.nombre,
      email: datos.email === undefined ? socioActual.email : datos.email,
      bloqueado: datos.bloqueado ?? socioActual.bloqueado,
    }));
  }

  eliminar(id) {
    const socio = this.obtener(id);
    if (this.socioDao.tieneHistorialPrestamos(socio.id)) {
      throw new AppError(409, 'SOCIO_CON_HISTORIAL', 'No se puede eliminar un socio que tiene préstamos registrados.');
    }
    this.socioDao.eliminar(socio.id);
    return { mensaje: 'Socio eliminado correctamente.' };
  }
}
