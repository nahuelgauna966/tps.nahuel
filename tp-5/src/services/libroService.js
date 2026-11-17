import { AppError } from '../domain/AppError.js';
import { Libro, validarEnteroPositivo, validarTextoActualizable } from '../domain/Libro.js';
import { validarId } from '../domain/validaciones.js';

const CAMPOS_LIBRO = new Set(['isbn', 'titulo', 'autor', 'ejemplaresTotales']);

export class LibroService {
  constructor({ libroDao, prestamoDao }) {
    this.libroDao = libroDao;
    this.prestamoDao = prestamoDao;
  }

  listar() {
    return this.libroDao.listar();
  }

  obtener(id) {
    const libro = this.libroDao.buscarPorId(validarId(id));
    if (!libro) throw new AppError(404, 'LIBRO_NO_ENCONTRADO', 'No se encontró el libro solicitado.');
    return libro;
  }

  crear(datos) {
    const libro = new Libro(datos);
    return this.libroDao.crear(libro);
  }

  actualizar(id, datos) {
    const libroActual = this.obtener(id);
    validarCampos(datos, CAMPOS_LIBRO);
    const actualizado = new Libro({
      isbn: datos.isbn ?? libroActual.isbn,
      titulo: datos.titulo ?? libroActual.titulo,
      autor: datos.autor ?? libroActual.autor,
      ejemplaresTotales: datos.ejemplaresTotales ?? libroActual.ejemplaresTotales,
    });

    const activos = this.libroDao.contarPrestamosActivos(libroActual.id);
    if (actualizado.ejemplaresTotales < activos) {
      throw new AppError(409, 'STOCK_INFERIOR_A_PRESTAMOS', 'Los ejemplares totales no pueden ser menores que los préstamos activos.');
    }
    return this.libroDao.actualizar(libroActual.id, {
      ...actualizado,
      ejemplaresDisponibles: actualizado.ejemplaresTotales - activos,
    });
  }

  eliminar(id) {
    const libro = this.obtener(id);
    if (this.libroDao.tieneHistorialPrestamos(libro.id)) {
      throw new AppError(409, 'LIBRO_CON_HISTORIAL', 'No se puede eliminar un libro que tiene préstamos registrados.');
    }
    this.libroDao.eliminar(libro.id);
    return { mensaje: 'Libro eliminado correctamente.' };
  }
}

function validarCampos(datos, permitidos) {
  const desconocidos = Object.keys(datos).filter((campo) => !permitidos.has(campo));
  if (desconocidos.length) {
    throw new AppError(400, 'CAMPOS_DESCONOCIDOS', `Campos no permitidos: ${desconocidos.join(', ')}.`);
  }
  if ('isbn' in datos) datos.isbn = validarTextoActualizable(datos.isbn, 'isbn');
  if ('titulo' in datos) datos.titulo = validarTextoActualizable(datos.titulo, 'titulo');
  if ('autor' in datos) datos.autor = validarTextoActualizable(datos.autor, 'autor');
  if ('ejemplaresTotales' in datos) {
    datos.ejemplaresTotales = validarEnteroPositivo(datos.ejemplaresTotales, 'ejemplaresTotales');
  }
}
