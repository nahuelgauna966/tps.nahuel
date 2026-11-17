import { mapearPrestamo } from '../domain/mapeo.js';

const SELECT_PRESTAMO = `
  SELECT p.*, s.nombre AS socio_nombre, l.titulo AS libro_titulo
  FROM prestamos p
  JOIN socios s ON s.id = p.socio_id
  JOIN libros l ON l.id = p.libro_id
`;

export class PrestamoDao {
  constructor(db) {
    this.db = db;
    this.insertarStmt = db.prepare(`
      INSERT INTO prestamos (socio_id, libro_id, fecha_prestamo)
      VALUES (@socioId, @libroId, @fechaPrestamo)
    `);
  }

  listar() {
    return this.db.prepare(`${SELECT_PRESTAMO} ORDER BY p.id`).all().map(mapearPrestamo);
  }

  buscarPorId(id) {
    return mapearPrestamo(this.db.prepare(`${SELECT_PRESTAMO} WHERE p.id = ?`).get(id));
  }

  crear(prestamo) {
    const result = this.insertarStmt.run({
      socioId: prestamo.socioId,
      libroId: prestamo.libroId,
      fechaPrestamo: prestamo.fechaPrestamo,
    });
    return this.buscarPorId(Number(result.lastInsertRowid));
  }

  registrarDevolucion(id, fecha) {
    const result = this.db.prepare(`
      UPDATE prestamos SET fecha_devolucion = ?
      WHERE id = ? AND fecha_devolucion IS NULL
    `).run(fecha, id);
    return result.changes > 0 ? this.buscarPorId(id) : null;
  }
}
